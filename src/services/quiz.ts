/**
 * @file services/quiz.ts
 * @description Service de persistance des réponses et scores de quiz
 *
 * Gère :
 * - Sauvegarde des réponses individuelles
 * - Calcul et mise à jour des scores
 * - Classement (leaderboard)
 * - Reprise après déconnexion
 */

/* eslint-disable no-console, camelcase */

import { getSupabaseClient } from '@/services/supabase/client';

// ============================================
// TYPES
// ============================================

export interface QuizAnswer {
  id: string;
  user_id: string;
  session_id: string;
  quiz_id: string;
  question_index: number;
  selected_answer: number;
  is_correct: boolean;
  response_time_ms: number | null;
  points: number;
  answered_at: string;
}

export interface QuizScore {
  id: string;
  user_id: string;
  session_id: string;
  quiz_id: string;
  total_points: number;
  correct_answers: number;
  total_questions: number;
  total_time_ms: number;
  rank_position: number | null;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_points: number;
  correct_answers: number;
  total_questions: number;
  total_time_ms: number;
  rank_position: number;
}

// ============================================
// RÉPONSES
// ============================================

/**
 * Enregistre une réponse de quiz.
 */
export async function submitQuizAnswer(
  userId: string,
  questionIndex: number,
  selectedAnswer: number,
  isCorrect: boolean,
  points: number,
  responseTimeMs: number,
  quizId: string = 'main',
  sessionId: string = 'destino-ia-workshop'
): Promise<QuizAnswer | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('participant_quiz_answers')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        quiz_id: quizId,
        question_index: questionIndex,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        points,
        response_time_ms: responseTimeMs,
      }, { onConflict: 'user_id,session_id,quiz_id,question_index' })
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour le score agrégé
    await updateQuizScore(userId, quizId, sessionId);

    return data as QuizAnswer;
  } catch (err) {
    console.error('[Quiz] Erreur soumission réponse:', err);
    return null;
  }
}

/**
 * Récupère les réponses d'un participant pour un quiz.
 * Utile pour la reprise après déconnexion.
 */
export async function getQuizAnswers(
  userId: string,
  quizId: string = 'main',
  sessionId: string = 'destino-ia-workshop'
): Promise<QuizAnswer[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('participant_quiz_answers')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('quiz_id', quizId)
      .order('question_index', { ascending: true });

    if (error) throw error;
    return (data as QuizAnswer[]) || [];
  } catch (err) {
    console.error('[Quiz] Erreur lecture réponses:', err);
    return [];
  }
}

// ============================================
// SCORES
// ============================================

/**
 * Met à jour le score agrégé d'un participant.
 */
async function updateQuizScore(
  userId: string,
  quizId: string = 'main',
  sessionId: string = 'destino-ia-workshop'
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Calculer le score depuis les réponses
    const { data: answers, error: answersError } = await supabase
      .from('participant_quiz_answers')
      .select('points, is_correct, response_time_ms')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('quiz_id', quizId);

    if (answersError) throw answersError;

    const totalPoints = (answers || []).reduce((sum, a) => sum + (a.points || 0), 0);
    const correctAnswers = (answers || []).filter(a => a.is_correct).length;
    const totalTimeMs = (answers || []).reduce((sum, a) => sum + (a.response_time_ms || 0), 0);

    await supabase
      .from('participant_quiz_scores')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        quiz_id: quizId,
        total_points: totalPoints,
        correct_answers: correctAnswers,
        total_questions: (answers || []).length,
        total_time_ms: totalTimeMs,
      }, { onConflict: 'user_id,session_id,quiz_id' });

  } catch (err) {
    console.error('[Quiz] Erreur mise à jour score:', err);
  }
}

/**
 * Obtenir le score d'un participant.
 */
export async function getQuizScore(
  userId: string,
  quizId: string = 'main',
  sessionId: string = 'destino-ia-workshop'
): Promise<QuizScore | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('participant_quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('quiz_id', quizId)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw error;
    return data as QuizScore;
  } catch (err) {
    console.error('[Quiz] Erreur lecture score:', err);
    return null;
  }
}

// ============================================
// CLASSEMENT
// ============================================

/**
 * Obtenir le classement du quiz via la fonction SQL.
 */
export async function getLeaderboard(
  quizId: string = 'main',
  sessionId: string = 'destino-ia-workshop',
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .rpc('get_quiz_leaderboard', {
        p_session_id: sessionId,
        p_quiz_id: quizId,
        p_limit: limit,
      });

    if (error) throw error;
    return (data as LeaderboardEntry[]) || [];
  } catch (err) {
    console.error('[Quiz] Erreur leaderboard:', err);
    return [];
  }
}
