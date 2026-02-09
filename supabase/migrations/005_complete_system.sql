-- ============================================================
-- Migration 005: Système complet Destino IA
-- ============================================================
-- Authentification Supabase Auth, rôles admin/participant,
-- persistance exercices/quiz, synchronisation temps réel,
-- gestion des messages et sécurité RLS.
--
-- Exécuter dans l'éditeur SQL de Supabase (Dashboard > SQL Editor)
-- ============================================================

-- ▶ IMPORTANT : Ce script est conçu pour être exécuté SUR une base
--   qui a DÉJÀ les migrations 001 à 004 appliquées.
--   Il ajoute les tables/fonctions manquantes et ajuste les RLS.

-- ============================================================
-- 1. TABLE PROFILES (liée à auth.users)
-- ============================================================
-- Chaque utilisateur Supabase Auth obtient automatiquement
-- un profil avec un rôle (admin ou participant).

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identité
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  
  -- Rôle
  role TEXT NOT NULL DEFAULT 'participant'
    CHECK (role IN ('admin', 'participant')),
  
  -- Session courante
  current_session_id TEXT DEFAULT 'destino-ia-workshop',
  
  -- Statut de connexion
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Métadonnées (préférences, score total, etc.)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_session ON public.profiles(current_session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_online ON public.profiles(is_online) WHERE is_online = true;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated ON public.profiles;
CREATE TRIGGER trigger_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_timestamp();

-- ============================================================
-- 2. TRIGGER : Créer un profil à l'inscription
-- ============================================================
-- Dès qu'un utilisateur s'inscrit via Supabase Auth,
-- son profil est automatiquement créé.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(COALESCE(NEW.email, ''), '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer si existe déjà pour éviter les doublons
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. TABLE PARTICIPANT_EXERCISES (persistance des exercices)
-- ============================================================
-- Stocke le travail de chaque participant sur chaque exercice.
-- Survit aux déconnexions.

CREATE TABLE IF NOT EXISTS public.participant_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Qui
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  
  -- Quel exercice
  exercise_id TEXT NOT NULL,
  
  -- Contenu sauvegardé
  prompt_text TEXT DEFAULT '',
  response_text TEXT DEFAULT '',
  
  -- Statut
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  
  -- Score éventuel (pour les exercices notés)
  score INTEGER,
  
  -- Metadata (images générées, URLs, etc.)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Un seul enregistrement par user/session/exercice
  UNIQUE(user_id, session_id, exercise_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_participant_exercises_user 
  ON public.participant_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_participant_exercises_session 
  ON public.participant_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_participant_exercises_exercise 
  ON public.participant_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_participant_exercises_status 
  ON public.participant_exercises(status);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trigger_participant_exercises_updated ON public.participant_exercises;
CREATE TRIGGER trigger_participant_exercises_updated
  BEFORE UPDATE ON public.participant_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_timestamp();

-- ============================================================
-- 4. TABLE PARTICIPANT_QUIZ_ANSWERS (réponses au quiz)
-- ============================================================
-- Stocke chaque réponse de quiz individuellement pour
-- permettre la reprise et le scoring temps réel.

CREATE TABLE IF NOT EXISTS public.participant_quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Qui
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  
  -- Quiz et question
  quiz_id TEXT NOT NULL DEFAULT 'main',
  question_index INTEGER NOT NULL,
  
  -- Réponse
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  
  -- Temps de réponse (ms)
  response_time_ms INTEGER,
  
  -- Points attribués
  points INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamp
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Une seule réponse par question par participant
  UNIQUE(user_id, session_id, quiz_id, question_index)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user 
  ON public.participant_quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session 
  ON public.participant_quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_quiz 
  ON public.participant_quiz_answers(quiz_id);

-- ============================================================
-- 5. TABLE PARTICIPANT_QUIZ_SCORES (score agrégé par quiz)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.participant_quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  quiz_id TEXT NOT NULL DEFAULT 'main',
  
  -- Score
  total_points INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  
  -- Temps total (ms)
  total_time_ms INTEGER NOT NULL DEFAULT 0,
  
  -- Rang (calculé après chaque mise à jour)
  rank_position INTEGER,
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, session_id, quiz_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_ranking
  ON public.participant_quiz_scores(session_id, quiz_id, total_points DESC);

-- ============================================================
-- 6. TABLE BROADCAST_MESSAGES (messages admin → tous)
-- ============================================================
-- Messages diffusés par l'admin à tous les participants.
-- Les messages directs (1-to-1) restent dans direct_messages (003).

CREATE TABLE IF NOT EXISTS public.broadcast_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Contenu
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'info'
    CHECK (message_type IN ('info', 'warning', 'success', 'alert')),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_broadcast_session 
  ON public.broadcast_messages(session_id, created_at DESC);

-- ============================================================
-- 7. RLS (Row Level Security) — SÉCURITÉ
-- ============================================================

-- ── Profiles ──────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tout utilisateur authentifié peut lire les profils
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Un utilisateur ne peut modifier que son propre profil
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Seul un admin peut modifier les autres profils
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── Participant Exercises ─────────────────────────

ALTER TABLE public.participant_exercises ENABLE ROW LEVEL SECURITY;

-- Les participants voient leurs propres exercices
CREATE POLICY "exercises_select_own"
  ON public.participant_exercises FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Les admins voient tout
CREATE POLICY "exercises_select_admin"
  ON public.participant_exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Les participants insèrent/mettent à jour leurs propres exercices
CREATE POLICY "exercises_insert_own"
  ON public.participant_exercises FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "exercises_update_own"
  ON public.participant_exercises FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Quiz Answers ──────────────────────────────────

ALTER TABLE public.participant_quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_answers_select_own"
  ON public.participant_quiz_answers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "quiz_answers_select_admin"
  ON public.participant_quiz_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "quiz_answers_insert_own"
  ON public.participant_quiz_answers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ── Quiz Scores ───────────────────────────────────

ALTER TABLE public.participant_quiz_scores ENABLE ROW LEVEL SECURITY;

-- Les scores sont visibles par tous (classement)
CREATE POLICY "quiz_scores_select_all"
  ON public.participant_quiz_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quiz_scores_upsert_own"
  ON public.participant_quiz_scores FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "quiz_scores_update_own"
  ON public.participant_quiz_scores FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ── Broadcast Messages ────────────────────────────

ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;

-- Tous les authentifiés peuvent lire
CREATE POLICY "broadcast_select_all"
  ON public.broadcast_messages FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les admins envoient des messages
CREATE POLICY "broadcast_insert_admin"
  ON public.broadcast_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── Session State : ajuster les RLS pour auth ─────

-- Supprimer les anciennes policies trop permissives
DROP POLICY IF EXISTS "session_state_select_all" ON public.session_state;
DROP POLICY IF EXISTS "session_state_insert_all" ON public.session_state;
DROP POLICY IF EXISTS "session_state_update_all" ON public.session_state;

-- Nouvelles policies basées sur l'auth
CREATE POLICY "session_state_select_auth"
  ON public.session_state FOR SELECT
  TO authenticated
  USING (true);

-- Aussi permettre aux anonymes (avant login) de lire
CREATE POLICY "session_state_select_anon"
  ON public.session_state FOR SELECT
  TO anon
  USING (true);

-- Seul l'admin peut modifier l'état de session
CREATE POLICY "session_state_update_admin"
  ON public.session_state FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "session_state_insert_admin"
  ON public.session_state FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- 8. REALTIME — Activer les publications
-- ============================================================

-- Les tables de la migration 001-004 sont déjà dans supabase_realtime.
-- On ajoute les nouvelles.
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_exercises;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_quiz_answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_quiz_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcast_messages;

-- ============================================================
-- 9. FONCTIONS UTILITAIRES
-- ============================================================

-- ── Vérifier si l'utilisateur courant est admin ───

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── Obtenir le classement du quiz ─────────────────

CREATE OR REPLACE FUNCTION public.get_quiz_leaderboard(
  p_session_id TEXT DEFAULT 'destino-ia-workshop',
  p_quiz_id TEXT DEFAULT 'main',
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  total_points INTEGER,
  correct_answers INTEGER,
  total_questions INTEGER,
  total_time_ms INTEGER,
  rank_position BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qs.user_id,
    p.display_name,
    qs.total_points,
    qs.correct_answers,
    qs.total_questions,
    qs.total_time_ms,
    ROW_NUMBER() OVER (ORDER BY qs.total_points DESC, qs.total_time_ms ASC) as rank_position
  FROM public.participant_quiz_scores qs
  JOIN public.profiles p ON p.id = qs.user_id
  WHERE qs.session_id = p_session_id
    AND qs.quiz_id = p_quiz_id
  ORDER BY qs.total_points DESC, qs.total_time_ms ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── Statistiques admin : résumé de session ────────

CREATE OR REPLACE FUNCTION public.get_session_stats(
  p_session_id TEXT DEFAULT 'destino-ia-workshop'
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_participants', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE current_session_id = p_session_id
    ),
    'online_participants', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE current_session_id = p_session_id AND is_online = true
    ),
    'exercises_completed', (
      SELECT COUNT(*) FROM public.participant_exercises 
      WHERE session_id = p_session_id AND status = 'completed'
    ),
    'quiz_participants', (
      SELECT COUNT(DISTINCT user_id) FROM public.participant_quiz_scores 
      WHERE session_id = p_session_id
    ),
    'average_quiz_score', (
      SELECT COALESCE(AVG(total_points), 0) FROM public.participant_quiz_scores 
      WHERE session_id = p_session_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── Réinitialiser le mot de passe admin ───────────
-- (Utiliser via Supabase Dashboard ou API admin)

CREATE OR REPLACE FUNCTION public.admin_reset_user_password(
  target_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier que l'appelant est admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Accès refusé : admin uniquement';
  END IF;
  
  -- La réinitialisation réelle se fait via l'API admin Supabase
  -- Cette fonction marque juste le profil
  UPDATE public.profiles 
  SET metadata = metadata || '{"password_reset_requested": true}'::jsonb
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 10. DONNÉES INITIALES
-- ============================================================

-- Note : Le compte admin et le compte test doivent être créés
-- via l'API Supabase Auth (voir le script de seed ci-dessous).
-- Les profils seront automatiquement créés par le trigger.

-- ============================================================
-- 11. COMMENTAIRES
-- ============================================================

COMMENT ON TABLE public.profiles IS 
  'Profils utilisateurs liés à auth.users. Rôle admin ou participant.';
COMMENT ON TABLE public.participant_exercises IS 
  'Travail persisté de chaque participant sur les exercices.';
COMMENT ON TABLE public.participant_quiz_answers IS 
  'Réponses individuelles au quiz (une ligne par question).';
COMMENT ON TABLE public.participant_quiz_scores IS 
  'Scores agrégés du quiz pour le classement.';
COMMENT ON TABLE public.broadcast_messages IS 
  'Messages diffusés par l''admin à tous les participants.';
COMMENT ON FUNCTION public.is_admin() IS 
  'Retourne true si l''utilisateur courant est admin.';
COMMENT ON FUNCTION public.get_quiz_leaderboard IS 
  'Classement du quiz avec noms et scores.';
COMMENT ON FUNCTION public.get_session_stats IS 
  'Statistiques résumées d''une session pour le dashboard admin.';
