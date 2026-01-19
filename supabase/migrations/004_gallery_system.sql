-- ============================================
-- MIGRATION 004: Système de Galerie Collaborative
-- ============================================

-- 1. Modifier table participants pour ajouter email
ALTER TABLE public.participants
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE NOT NULL DEFAULT '';

-- Retirer le DEFAULT après ajout (pour forcer l'email dans les futurs inserts)
ALTER TABLE public.participants
ALTER COLUMN email DROP DEFAULT;

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);

COMMENT ON COLUMN public.participants.email IS 'Email unique pour reconnexion automatique';

-- ============================================
-- 2. TABLE: exercise_submissions
-- ============================================

CREATE TABLE IF NOT EXISTS public.exercise_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL, -- Identifiant de l'exercice (ex: "exercise-1")
  image_url TEXT NOT NULL, -- URL de l'image dans Storage
  image_thumbnail_url TEXT, -- URL miniature pour performance
  is_favorite BOOLEAN DEFAULT false, -- Marqué comme favori par l'admin
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte : Une seule soumission par participant par exercice
  UNIQUE(session_id, participant_id, exercise_id)
);

COMMENT ON TABLE public.exercise_submissions IS 'Images soumises par les participants pendant les exercices';
COMMENT ON COLUMN public.exercise_submissions.exercise_id IS 'ID de l\'exercice (ex: exercise-1, exercise-2)';
COMMENT ON COLUMN public.exercise_submissions.is_favorite IS 'Marqué comme favori par l\'admin pour mise en avant';

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_submissions_session ON public.exercise_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_submissions_participant ON public.exercise_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exercise ON public.exercise_submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_submissions_favorites ON public.exercise_submissions(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.exercise_submissions(submitted_at);

-- ============================================
-- 3. TABLE: gallery_broadcast_state
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery_broadcast_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE REFERENCES public.sessions(id) ON DELETE CASCADE,
  is_broadcasting BOOLEAN DEFAULT false,
  broadcast_mode TEXT CHECK (broadcast_mode IN ('all', 'favorites', 'single')) DEFAULT 'all',
  broadcast_exercise_id TEXT, -- ID de l'exercice diffusé
  broadcast_submission_id UUID REFERENCES public.exercise_submissions(id) ON DELETE SET NULL, -- Pour mode 'single'
  started_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.gallery_broadcast_state IS 'État de diffusion de la galerie pour chaque session';
COMMENT ON COLUMN public.gallery_broadcast_state.broadcast_mode IS 'Mode de diffusion: all (toutes), favorites (favoris), single (image unique)';
COMMENT ON COLUMN public.gallery_broadcast_state.broadcast_submission_id IS 'ID de la soumission affichée en mode single';

-- Index
CREATE INDEX IF NOT EXISTS idx_broadcast_session ON public.gallery_broadcast_state(session_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_active ON public.gallery_broadcast_state(is_broadcasting) WHERE is_broadcasting = true;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.exercise_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_broadcast_state ENABLE ROW LEVEL SECURITY;

-- POLICIES: exercise_submissions

-- Tout le monde peut lire les soumissions de sa session
CREATE POLICY "Participants peuvent lire les soumissions de leur session"
  ON public.exercise_submissions FOR SELECT
  USING (true);

-- Participants peuvent créer leurs soumissions
CREATE POLICY "Participants peuvent soumettre des images"
  ON public.exercise_submissions FOR INSERT
  WITH CHECK (true);

-- Participants peuvent mettre à jour leurs propres soumissions
CREATE POLICY "Participants peuvent modifier leurs soumissions"
  ON public.exercise_submissions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Admins peuvent marquer comme favori
CREATE POLICY "Admins peuvent modifier le statut favori"
  ON public.exercise_submissions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- POLICIES: gallery_broadcast_state

-- Tout le monde peut lire l'état de diffusion
CREATE POLICY "Tous peuvent lire l'état de diffusion"
  ON public.gallery_broadcast_state FOR SELECT
  USING (true);

-- Admins peuvent gérer la diffusion
CREATE POLICY "Admins peuvent gérer la diffusion"
  ON public.gallery_broadcast_state FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour compter les soumissions par exercice
CREATE OR REPLACE FUNCTION count_exercise_submissions(
  p_session_id UUID,
  p_exercise_id TEXT
)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.exercise_submissions
    WHERE session_id = p_session_id
      AND exercise_id = p_exercise_id
  );
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION count_exercise_submissions IS 'Compte le nombre de soumissions pour un exercice donné';

-- Fonction pour obtenir les stats d'un exercice
CREATE OR REPLACE FUNCTION get_exercise_stats(
  p_session_id UUID,
  p_exercise_id TEXT
)
RETURNS TABLE (
  total_submissions INTEGER,
  total_favorites INTEGER,
  last_submission_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_submissions,
    COUNT(*) FILTER (WHERE is_favorite = true)::INTEGER as total_favorites,
    MAX(submitted_at) as last_submission_at
  FROM public.exercise_submissions
  WHERE session_id = p_session_id
    AND exercise_id = p_exercise_id;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_exercise_stats IS 'Retourne les statistiques complètes d\'un exercice';

-- Trigger pour mettre à jour updated_at sur exercise_submissions
CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON public.exercise_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger pour mettre à jour updated_at sur gallery_broadcast_state
CREATE TRIGGER broadcast_updated_at
  BEFORE UPDATE ON public.gallery_broadcast_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FONCTION DE NETTOYAGE
-- ============================================

-- Supprimer les soumissions de sessions terminées depuis plus de 30 jours
CREATE OR REPLACE FUNCTION clean_old_submissions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.exercise_submissions
  WHERE session_id IN (
    SELECT id FROM public.sessions
    WHERE status = 'ended'
      AND ended_at < NOW() - INTERVAL '30 days'
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION clean_old_submissions IS 'Nettoie les soumissions des sessions terminées depuis > 30 jours';

-- ============================================
-- INITIALISATION broadcast_state
-- ============================================

-- Créer un broadcast_state pour toutes les sessions existantes
INSERT INTO public.gallery_broadcast_state (session_id, is_broadcasting, broadcast_mode)
SELECT id, false, 'all'
FROM public.sessions
WHERE id NOT IN (SELECT session_id FROM public.gallery_broadcast_state)
ON CONFLICT (session_id) DO NOTHING;

-- ============================================
-- DOCUMENTATION FINALE
-- ============================================

COMMENT ON COLUMN public.participants.email IS 'Email unique pour reconnexion automatique et identification';
