-- ============================================
-- Migration 001: Participants
-- ============================================
-- Table des participants de l'atelier.
-- Référencée par direct_messages (003) via FK.
-- Gère la connexion/déconnexion et les métadonnées.

CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Session à laquelle le participant appartient
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',

  -- Identité
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Statut de connexion
  status TEXT NOT NULL DEFAULT 'connected'
    CHECK (status IN ('connected', 'disconnected')),

  -- Timestamps
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Métadonnées libres (user-agent, préférences, etc.)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Un même email ne peut s'inscrire qu'une fois par session
  UNIQUE (session_id, email)
);

-- ── Index ──────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_participants_session_id
  ON public.participants(session_id);

CREATE INDEX IF NOT EXISTS idx_participants_session_status
  ON public.participants(session_id, status);

CREATE INDEX IF NOT EXISTS idx_participants_email
  ON public.participants(email);

-- ── Trigger updated_at ─────────────────────────

-- Réutilise la fonction si elle existe déjà (créée aussi par 002),
-- sinon la crée.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participants_last_seen
  BEFORE UPDATE ON public.participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ─────────────────────────

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire la liste (l'admin en a besoin)
CREATE POLICY "participants_select_all"
  ON public.participants
  FOR SELECT
  USING (true);

-- Tout le monde peut s'inscrire (le formulaire JoinForm)
CREATE POLICY "participants_insert_all"
  ON public.participants
  FOR INSERT
  WITH CHECK (true);

-- Tout le monde peut se mettre à jour (statut, last_seen_at)
CREATE POLICY "participants_update_all"
  ON public.participants
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ── Realtime ───────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;

-- ── Commentaires ───────────────────────────────

COMMENT ON TABLE public.participants
  IS 'Participants inscrits à l''atelier. FK cible pour direct_messages.';
COMMENT ON COLUMN public.participants.session_id
  IS 'ID de la session (permet multi-ateliers)';
COMMENT ON COLUMN public.participants.status
  IS 'connected = en ligne, disconnected = déconnecté';
COMMENT ON COLUMN public.participants.metadata
  IS 'Données libres (user-agent, préférences, score quiz, etc.)';
