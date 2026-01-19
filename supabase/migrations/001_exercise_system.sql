-- Migration SQL pour Supabase - Système de gestion des exercices en temps réel

-- Table pour stocker l'état de session
CREATE TABLE IF NOT EXISTS public.session_state (
  session_id TEXT PRIMARY KEY,
  current_exercise JSONB,
  is_exercise_active BOOLEAN DEFAULT false,
  is_presentation_paused BOOLEAN DEFAULT false,
  presentation_slide_index INTEGER DEFAULT 0,
  participants JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les notifications temps réel
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_session_state_session_id ON public.session_state(session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_session_id ON public.notifications(session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Activer Row Level Security (RLS)
ALTER TABLE public.session_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde de lire l'état de session
CREATE POLICY "Tout le monde peut lire l'état de session"
  ON public.session_state
  FOR SELECT
  USING (true);

-- Politique pour permettre à tout le monde d'insérer/mettre à jour l'état de session
-- Note: En production, vous devriez restreindre cela aux admins uniquement
CREATE POLICY "Les admins peuvent modifier l'état de session"
  ON public.session_state
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Politique pour permettre à tout le monde de lire les notifications
CREATE POLICY "Tout le monde peut lire les notifications"
  ON public.notifications
  FOR SELECT
  USING (true);

-- Politique pour permettre à tout le monde d'insérer des notifications
CREATE POLICY "Tout le monde peut créer des notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Fonction pour nettoyer les anciennes notifications (optionnel)
CREATE OR REPLACE FUNCTION clean_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.notifications
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documentation
COMMENT ON TABLE public.session_state IS 'Stocke l''état actuel de la session incluant l''exercice en cours';
COMMENT ON TABLE public.notifications IS 'Notifications temps réel pour synchroniser admin et participants';
COMMENT ON COLUMN public.session_state.current_exercise IS 'Objet JSON contenant les détails de l''exercice actuel';
COMMENT ON COLUMN public.session_state.participants IS 'Array JSON des participants avec leur statut de complétion';
