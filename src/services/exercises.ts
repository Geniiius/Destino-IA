/**
 * @file services/exercises.ts
 * @description Service de persistance des exercices participants
 *
 * Permet de sauvegarder et restaurer le travail des participants
 * sur les exercices (prompts, réponses) même après déconnexion.
 */

/* eslint-disable no-console, camelcase */

import { getSupabaseClient } from '@/services/supabase/client';

// ============================================
// TYPES
// ============================================

export interface ParticipantExercise {
  id: string;
  user_id: string;
  session_id: string;
  exercise_id: string;
  prompt_text: string;
  response_text: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  metadata: Record<string, unknown>;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// LECTURE
// ============================================

/**
 * Récupère tout le travail d'un participant pour une session.
 */
export async function getParticipantExercises(
  userId: string,
  sessionId: string = 'destino-ia-workshop'
): Promise<ParticipantExercise[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('participant_exercises')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('exercise_id', { ascending: true });

    if (error) throw error;
    return (data as ParticipantExercise[]) || [];
  } catch (err) {
    console.error('[Exercises] Erreur lecture:', err);
    return [];
  }
}

/**
 * Récupère le travail d'un participant sur un exercice spécifique.
 */
export async function getExerciseProgress(
  userId: string,
  exerciseId: string,
  sessionId: string = 'destino-ia-workshop'
): Promise<ParticipantExercise | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('participant_exercises')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('exercise_id', exerciseId)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw error;
    return data as ParticipantExercise;
  } catch (err) {
    console.error('[Exercises] Erreur lecture exercice:', err);
    return null;
  }
}

// ============================================
// SAUVEGARDE
// ============================================

/**
 * Sauvegarde le travail d'un participant sur un exercice.
 * Utilise upsert pour créer ou mettre à jour.
 */
export async function saveExerciseProgress(
  userId: string,
  exerciseId: string,
  updates: {
    prompt_text?: string;
    response_text?: string;
    status?: 'not_started' | 'in_progress' | 'completed';
    score?: number;
    metadata?: Record<string, unknown>;
  },
  sessionId: string = 'destino-ia-workshop'
): Promise<ParticipantExercise | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const now = new Date().toISOString();

    const record = {
      user_id: userId,
      session_id: sessionId,
      exercise_id: exerciseId,
      ...updates,
      ...(updates.status === 'in_progress' && !updates.metadata ? { started_at: now } : {}),
      ...(updates.status === 'completed' ? { completed_at: now } : {}),
    };

    const { data, error } = await supabase
      .from('participant_exercises')
      .upsert(record, { onConflict: 'user_id,session_id,exercise_id' })
      .select()
      .single();

    if (error) throw error;

    if (import.meta.env.DEV) {
      console.log(`[Exercises] ✅ Sauvegardé exercice ${exerciseId}:`, updates.status);
    }

    return data as ParticipantExercise;
  } catch (err) {
    console.error('[Exercises] Erreur sauvegarde:', err);
    return null;
  }
}

// ============================================
// ADMIN : VUE GLOBALE
// ============================================

/**
 * Obtenir les exercices de tous les participants (admin).
 */
export async function getAllExercisesProgress(
  sessionId: string = 'destino-ia-workshop'
): Promise<ParticipantExercise[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('participant_exercises')
      .select('*')
      .eq('session_id', sessionId)
      .order('exercise_id', { ascending: true });

    if (error) throw error;
    return (data as ParticipantExercise[]) || [];
  } catch (err) {
    console.error('[Exercises] Erreur admin lecture:', err);
    return [];
  }
}
