-- ============================================
-- Migration 004: Session State (pilotage temps réel)
-- ============================================
-- Table de synchronisation entre l'admin et les participants
-- Permet de piloter en temps réel : slide actif, mode, thème, etc.

CREATE TABLE IF NOT EXISTS session_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  
  -- Thème de slides actif
  slide_theme TEXT NOT NULL DEFAULT 'default',
  slide_manifest_url TEXT NOT NULL DEFAULT '/slides/slides-manifest.json',
  
  -- Navigation dans les slides
  current_slide_index INTEGER NOT NULL DEFAULT 1,
  total_slides INTEGER NOT NULL DEFAULT 0,
  
  -- Mode courant : presentation | exercise | quiz
  current_mode TEXT NOT NULL DEFAULT 'presentation' 
    CHECK (current_mode IN ('presentation', 'exercise', 'quiz')),
  
  -- Slide à reprendre après un exercice ou quiz
  paused_slide_index INTEGER,
  
  -- Exercice actif (null si aucun)
  active_exercise_id TEXT,
  
  -- Quiz
  is_quiz_active BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_started_at TIMESTAMPTZ,
  
  -- Session diffusée ?
  is_live BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Contrainte d'unicité par session
  UNIQUE(session_id)
);

-- Index pour lookup rapide par session
CREATE INDEX IF NOT EXISTS idx_session_state_session_id ON session_state(session_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_session_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_session_state_updated ON session_state;
CREATE TRIGGER trigger_session_state_updated
  BEFORE UPDATE ON session_state
  FOR EACH ROW
  EXECUTE FUNCTION update_session_state_timestamp();

-- RLS (Row Level Security)
ALTER TABLE session_state ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire l'état de session (participants)
CREATE POLICY "session_state_select_all" ON session_state
  FOR SELECT USING (true);

-- Tout le monde peut insérer (pour créer la session initiale)
CREATE POLICY "session_state_insert_all" ON session_state
  FOR INSERT WITH CHECK (true);

-- Tout le monde peut mettre à jour (l'admin pilote via le client)
CREATE POLICY "session_state_update_all" ON session_state
  FOR UPDATE USING (true);

-- Activer le Realtime sur cette table
ALTER PUBLICATION supabase_realtime ADD TABLE session_state;

-- Insérer un état par défaut
INSERT INTO session_state (session_id, slide_theme, current_slide_index, total_slides, current_mode, is_live)
VALUES ('destino-ia-workshop', 'DESTINO+IA – Marketing', 1, 45, 'presentation', false)
ON CONFLICT (session_id) DO NOTHING;
