-- ============================================================
-- 🚀 DESTINO IA — Script SQL unique (base vierge)
-- ============================================================
-- Copier/coller TOUT ce fichier dans :
-- Supabase Dashboard → SQL Editor → New Query → Coller → Run
--
-- Ce script crée TOUT le système en une seule exécution :
-- 1. Tables (participants, messages, exercices, quiz, session, profils)
-- 2. Sécurité RLS (Row Level Security)
-- 3. Triggers et fonctions
-- 4. Realtime
-- 5. Données initiales
-- ============================================================


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 1 : FONCTIONS UTILITAIRES
-- ████████████████████████████████████████████████████████████

-- Fonction générique pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 2 : TABLE PROFILES (liée à Supabase Auth)
-- ████████████████████████████████████████████████████████████
-- Chaque utilisateur qui s'inscrit obtient automatiquement un profil.

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'participant'
    CHECK (role IN ('admin', 'participant')),
  current_session_id TEXT DEFAULT 'destino-ia-workshop',
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_session ON public.profiles(current_session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_online ON public.profiles(is_online) WHERE is_online = true;

CREATE TRIGGER trigger_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger : créer le profil automatiquement à l'inscription
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 3 : TABLE PARTICIPANTS (inscription atelier)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected'
    CHECK (status IN ('connected', 'disconnected')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (session_id, email)
);

CREATE INDEX IF NOT EXISTS idx_participants_session_id ON public.participants(session_id);
CREATE INDEX IF NOT EXISTS idx_participants_session_status ON public.participants(session_id, status);
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);

CREATE OR REPLACE FUNCTION update_participants_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participants_last_seen
  BEFORE UPDATE ON public.participants
  FOR EACH ROW EXECUTE FUNCTION update_participants_last_seen();


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 4 : TABLE SESSION_STATE (pilotage temps réel)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.session_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  slide_theme TEXT NOT NULL DEFAULT 'default',
  slide_manifest_url TEXT NOT NULL DEFAULT '/slides/slides-manifest.json',
  current_slide_index INTEGER NOT NULL DEFAULT 1,
  total_slides INTEGER NOT NULL DEFAULT 0,
  current_mode TEXT NOT NULL DEFAULT 'presentation'
    CHECK (current_mode IN ('presentation', 'exercise', 'quiz')),
  paused_slide_index INTEGER,
  active_exercise_id TEXT,
  is_quiz_active BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_started_at TIMESTAMPTZ,
  is_live BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id)
);

CREATE INDEX IF NOT EXISTS idx_session_state_session_id ON public.session_state(session_id);

CREATE OR REPLACE FUNCTION update_session_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_session_state_updated
  BEFORE UPDATE ON public.session_state
  FOR EACH ROW EXECUTE FUNCTION update_session_state_timestamp();

-- Insérer l'état par défaut
INSERT INTO public.session_state (session_id, slide_theme, current_slide_index, total_slides, current_mode, is_live)
VALUES ('destino-ia-workshop', 'DESTINO+IA – Marketing', 1, 45, 'presentation', false)
ON CONFLICT (session_id) DO NOTHING;


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 5 : TABLE DIRECT_MESSAGES (admin → participant)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_participant_id ON public.direct_messages(participant_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_session_id ON public.direct_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON public.direct_messages(created_at DESC);


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 6 : TABLE EXERCISE_AI_EXAMPLES (exemples IA)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.exercise_ai_examples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercise_ai_examples_exercise_id ON public.exercise_ai_examples(exercise_id);

CREATE TRIGGER update_exercise_ai_examples_updated_at
  BEFORE UPDATE ON public.exercise_ai_examples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données placeholder
INSERT INTO public.exercise_ai_examples (exercise_id, type, url, prompt, description) VALUES
  ('01', 'image', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 01'),
  ('02', 'image', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 02'),
  ('03', 'video', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 03'),
  ('04', 'video', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 04'),
  ('05', 'image', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 05'),
  ('07', 'image', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 07'),
  ('08', 'video', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 08'),
  ('09', 'image', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 09'),
  ('10', 'video', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 10'),
  ('11', 'video', 'https://via.placeholder.com/1080x1920', 'Prompt à configurer...', 'Exercice 11')
ON CONFLICT (exercise_id) DO NOTHING;


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 7 : TABLE PARTICIPANT_EXERCISES (travail persisté)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.participant_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  exercise_id TEXT NOT NULL,
  prompt_text TEXT DEFAULT '',
  response_text TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, session_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_participant_exercises_user ON public.participant_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_participant_exercises_session ON public.participant_exercises(session_id);

CREATE TRIGGER trigger_participant_exercises_updated
  BEFORE UPDATE ON public.participant_exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 8 : TABLES QUIZ (réponses + scores)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.participant_quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  quiz_id TEXT NOT NULL DEFAULT 'main',
  question_index INTEGER NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  response_time_ms INTEGER,
  points INTEGER NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, session_id, quiz_id, question_index)
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_user ON public.participant_quiz_answers(user_id);

CREATE TABLE IF NOT EXISTS public.participant_quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  quiz_id TEXT NOT NULL DEFAULT 'main',
  total_points INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  total_time_ms INTEGER NOT NULL DEFAULT 0,
  rank_position INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, session_id, quiz_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_ranking
  ON public.participant_quiz_scores(session_id, quiz_id, total_points DESC);


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 9 : TABLE BROADCAST_MESSAGES (admin → tous)
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS public.broadcast_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL DEFAULT 'destino-ia-workshop',
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'info'
    CHECK (message_type IN ('info', 'warning', 'success', 'alert')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_broadcast_session ON public.broadcast_messages(session_id, created_at DESC);


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 10 : SÉCURITÉ RLS (Row Level Security)
-- ████████████████████████████████████████████████████████████

-- ── Profiles ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── Participants ──
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants_select" ON public.participants
  FOR SELECT USING (true);

CREATE POLICY "participants_insert" ON public.participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "participants_update" ON public.participants
  FOR UPDATE USING (true) WITH CHECK (true);

-- ── Session State ──
ALTER TABLE public.session_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "session_state_select" ON public.session_state
  FOR SELECT USING (true);

CREATE POLICY "session_state_insert" ON public.session_state
  FOR INSERT WITH CHECK (true);

CREATE POLICY "session_state_update" ON public.session_state
  FOR UPDATE USING (true);

-- ── Direct Messages ──
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direct_messages_select" ON public.direct_messages
  FOR SELECT USING (true);

CREATE POLICY "direct_messages_insert" ON public.direct_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "direct_messages_update" ON public.direct_messages
  FOR UPDATE USING (true) WITH CHECK (true);

-- ── Exercise AI Examples ──
ALTER TABLE public.exercise_ai_examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercise_ai_examples_select" ON public.exercise_ai_examples
  FOR SELECT USING (true);

CREATE POLICY "exercise_ai_examples_all" ON public.exercise_ai_examples
  FOR ALL USING (true) WITH CHECK (true);

-- ── Participant Exercises ──
ALTER TABLE public.participant_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises_select_own" ON public.participant_exercises
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "exercises_insert_own" ON public.participant_exercises
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "exercises_update_own" ON public.participant_exercises
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ── Quiz Answers ──
ALTER TABLE public.participant_quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_answers_select" ON public.participant_quiz_answers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "quiz_answers_insert" ON public.participant_quiz_answers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ── Quiz Scores ──
ALTER TABLE public.participant_quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_scores_select" ON public.participant_quiz_scores
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "quiz_scores_insert" ON public.participant_quiz_scores
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "quiz_scores_update" ON public.participant_quiz_scores
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ── Broadcast Messages ──
ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "broadcast_select" ON public.broadcast_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "broadcast_insert_admin" ON public.broadcast_messages
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 11 : REALTIME
-- ████████████████████████████████████████████████████████████

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_exercises;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_quiz_answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_quiz_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcast_messages;


-- ████████████████████████████████████████████████████████████
-- ÉTAPE 12 : FONCTIONS UTILITAIRES
-- ████████████████████████████████████████████████████████████

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

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
  SELECT qs.user_id, p.display_name, qs.total_points, qs.correct_answers,
         qs.total_questions, qs.total_time_ms,
         ROW_NUMBER() OVER (ORDER BY qs.total_points DESC, qs.total_time_ms ASC)
  FROM public.participant_quiz_scores qs
  JOIN public.profiles p ON p.id = qs.user_id
  WHERE qs.session_id = p_session_id AND qs.quiz_id = p_quiz_id
  ORDER BY qs.total_points DESC, qs.total_time_ms ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_session_stats(
  p_session_id TEXT DEFAULT 'destino-ia-workshop'
)
RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'total_participants', (SELECT COUNT(*) FROM public.profiles WHERE current_session_id = p_session_id),
    'online_participants', (SELECT COUNT(*) FROM public.profiles WHERE current_session_id = p_session_id AND is_online = true),
    'exercises_completed', (SELECT COUNT(*) FROM public.participant_exercises WHERE session_id = p_session_id AND status = 'completed'),
    'quiz_participants', (SELECT COUNT(DISTINCT user_id) FROM public.participant_quiz_scores WHERE session_id = p_session_id),
    'average_quiz_score', (SELECT COALESCE(AVG(total_points), 0) FROM public.participant_quiz_scores WHERE session_id = p_session_id)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ████████████████████████████████████████████████████████████
-- ✅ TERMINÉ !
-- ████████████████████████████████████████████████████████████
-- 
-- Prochaine étape : créer les comptes dans
-- Supabase Dashboard → Authentication → Users → Add User
--
-- 1. ADMIN :
--    Email    : admin@destino-ia.com
--    Password : Destino-IA-Admin-2026!
--
-- 2. PARTICIPANT TEST :
--    Email    : test@destino-ia.com
--    Password : Test-Participant-2026!
--
-- Puis exécuter cette requête pour promouvoir l'admin :
--
--   UPDATE public.profiles 
--   SET role = 'admin', display_name = 'Admin Destino IA'
--   WHERE email = 'admin@destino-ia.com';
--
