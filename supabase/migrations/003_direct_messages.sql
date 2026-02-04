-- Migration pour la messagerie directe Admin → Participant
-- Cette table stocke les messages envoyés par l'animateur aux participants

-- Table des messages directs
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_direct_messages_participant_id 
  ON public.direct_messages(participant_id);

CREATE INDEX IF NOT EXISTS idx_direct_messages_session_id 
  ON public.direct_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at 
  ON public.direct_messages(created_at DESC);

-- Activer Row Level Security (RLS)
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde de lire les messages (filtrés par l'app)
CREATE POLICY "Participants peuvent lire leurs messages"
  ON public.direct_messages
  FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion (admin envoie des messages)
CREATE POLICY "Admins peuvent envoyer des messages"
  ON public.direct_messages
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la mise à jour (marquer comme lu)
CREATE POLICY "Participants peuvent marquer comme lu"
  ON public.direct_messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Activer le Realtime pour cette table
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- Commentaires pour documentation
COMMENT ON TABLE public.direct_messages IS 'Messages directs envoyés par l''admin aux participants';
COMMENT ON COLUMN public.direct_messages.session_id IS 'ID de la session du workshop';
COMMENT ON COLUMN public.direct_messages.participant_id IS 'ID du participant destinataire';
COMMENT ON COLUMN public.direct_messages.message IS 'Contenu du message';
COMMENT ON COLUMN public.direct_messages.is_read IS 'Indique si le message a été lu';
