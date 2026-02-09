/**
 * @file services/sessionState.ts
 * @description Service Supabase pour la gestion de l'état de session temps réel
 *
 * Responsabilités :
 * - CRUD sur la table session_state
 * - Abonnement Realtime (postgres_changes)
 * - Fallback local si Supabase non configuré
 *
 * Architecture :
 * - Toutes les fonctions retournent { data, error } pour cohérence
 * - L'abonnement Realtime retourne une fonction de cleanup
 * - Compatible mode local (sans Supabase)
 */

/* eslint-disable no-console, camelcase */

import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase/client';
import {
  DEFAULT_SESSION_ID,
  DEFAULT_LIVE_STATE,
  type LiveSessionState,
  type SessionMode,
} from '@/types/session';

// ============================================
// TYPES INTERNES
// ============================================

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

type SessionStateCallback = (state: LiveSessionState) => void;

// ============================================
// STORE LOCAL (fallback sans Supabase)
// ============================================

/**
 * En mode local (sans Supabase), on maintient l'état en mémoire
 * pour ne pas écraser les champs existants à chaque mise à jour.
 */
const localStore: Map<string, LiveSessionState> = new Map();

/** Callbacks Realtime locaux pour simuler la synchro */
const localCallbacks: Map<string, Set<SessionStateCallback>> = new Map();

function getLocalState(sessionId: string): LiveSessionState {
  if (!localStore.has(sessionId)) {
    localStore.set(sessionId, { ...DEFAULT_LIVE_STATE, session_id: sessionId });
  }
  return localStore.get(sessionId)!;
}

function setLocalState(sessionId: string, state: LiveSessionState): void {
  localStore.set(sessionId, state);
  // Notifier les callbacks locaux (simule Realtime)
  const cbs = localCallbacks.get(sessionId);
  if (cbs) {
    cbs.forEach((cb) => cb(state));
  }
}

// ============================================
// LECTURE
// ============================================

/**
 * Récupère l'état courant de la session depuis Supabase.
 * Retourne l'état par défaut si non trouvé ou Supabase non configuré.
 */

export async function getSessionState(
  sessionId: string = DEFAULT_SESSION_ID
): Promise<ServiceResult<LiveSessionState>> {
  const supabase = isSupabaseConfigured() ? getSupabaseClient() : null;

  if (!supabase) {
    return { data: { ...getLocalState(sessionId) }, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('session_state')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error?.code === 'PGRST116') {
      return createSessionState(sessionId);
    }
    if (error) throw error;

    return { data: data as LiveSessionState, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[SessionState] Erreur lecture:', message);
    return { data: { ...DEFAULT_LIVE_STATE }, error: message };
  }
}

// ============================================
// CRÉATION
// ============================================

/**
 * Crée un état de session initial dans Supabase.
 */
export async function createSessionState(
  sessionId: string = DEFAULT_SESSION_ID
): Promise<ServiceResult<LiveSessionState>> {
  if (!isSupabaseConfigured()) {
    const state = getLocalState(sessionId);
    return { data: { ...state }, error: null };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { data: { ...DEFAULT_LIVE_STATE, session_id: sessionId }, error: null };
    }

    const initialState: Partial<LiveSessionState> = {
      session_id: sessionId,
      slide_theme: DEFAULT_LIVE_STATE.slide_theme,
      slide_manifest_url: DEFAULT_LIVE_STATE.slide_manifest_url,
      current_slide_index: 1,
      total_slides: DEFAULT_LIVE_STATE.total_slides,
      current_mode: 'presentation',
      paused_slide_index: null,
      active_exercise_id: null,
      is_quiz_active: false,
      quiz_started_at: null,
      is_live: false,
    };

    const { data, error } = await supabase
      .from('session_state')
      .upsert(initialState, { onConflict: 'session_id' })
      .select()
      .single();

    if (error) throw error;

    console.log('[SessionState] État créé pour session:', sessionId);
    return { data: data as LiveSessionState, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur création';
    console.error('[SessionState] Erreur création:', message);
    return { data: { ...DEFAULT_LIVE_STATE, session_id: sessionId }, error: message };
  }
}

// ============================================
// MISE À JOUR
// ============================================

/**
 * Met à jour des champs spécifiques de l'état de session.
 * Utilisé par l'admin pour piloter en temps réel.
 */
export async function updateSessionState(
  updates: Partial<LiveSessionState>,
  sessionId: string = DEFAULT_SESSION_ID
): Promise<ServiceResult<LiveSessionState>> {
  const supabase = isSupabaseConfigured() ? getSupabaseClient() : null;

  if (!supabase) {
    const current = getLocalState(sessionId);
    const newState = { ...current, ...updates, session_id: sessionId };
    setLocalState(sessionId, newState);
    return { data: { ...newState }, error: null };
  }

  try {

    // Ne pas envoyer les champs id, session_id, created_at, updated_at
    const cleanUpdates = { ...updates };
    delete cleanUpdates.id;
    delete cleanUpdates.session_id;
    delete cleanUpdates.created_at;
    delete cleanUpdates.updated_at;

    const { data, error } = await supabase
      .from('session_state')
      .update(cleanUpdates)
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) throw error;

    if (import.meta.env.DEV) {
      console.log('[SessionState] ✅ Mise à jour:', cleanUpdates);
    }

    return { data: data as LiveSessionState, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur mise à jour';
    console.error('[SessionState] Erreur update:', message);
    return { data: null, error: message };
  }
}

// ============================================
// ACTIONS DE PILOTAGE (helpers)
// ============================================

/**
 * Naviguer vers un slide spécifique.
 */
export function navigateToSlide(
  slideIndex: number,
  sessionId: string = DEFAULT_SESSION_ID
): Promise<ServiceResult<LiveSessionState>> {
  return updateSessionState({ current_slide_index: slideIndex }, sessionId);
}

/**
 * Changer le mode de la session.
 */
export function changeMode(
  mode: SessionMode,
  options?: {
    exerciseId?: string;
    pausedSlideIndex?: number;
  },
  sessionId: string = DEFAULT_SESSION_ID
): Promise<ServiceResult<LiveSessionState>> {
  const updates: Partial<LiveSessionState> = {
    current_mode: mode,
  };

  if (mode === 'exercise') {
    updates.active_exercise_id = options?.exerciseId ?? null;
    updates.paused_slide_index = options?.pausedSlideIndex ?? null;
    updates.is_quiz_active = false;
  } else if (mode === 'quiz') {
    updates.is_quiz_active = true;
    updates.quiz_started_at = new Date().toISOString();
    updates.active_exercise_id = null;
    updates.paused_slide_index = options?.pausedSlideIndex ?? null;
  } else {
    // presentation
    updates.active_exercise_id = null;
    updates.is_quiz_active = false;
    updates.quiz_started_at = null;
    // paused_slide_index est conservé pour la reprise
  }

  return updateSessionState(updates, sessionId);
}

/**
 * Reprendre la présentation après un exercice/quiz.
 * Retourne au slide qui était affiché avant la pause.
 */
export async function resumePresentation(
  sessionId: string = DEFAULT_SESSION_ID
): Promise<ServiceResult<LiveSessionState>> {
  // D'abord, lire l'état pour savoir quel slide reprendre
  const { data: current } = await getSessionState(sessionId);
  const resumeIndex = current?.paused_slide_index ?? current?.current_slide_index ?? 1;

  return updateSessionState(
    {
      current_mode: 'presentation',
      current_slide_index: resumeIndex,
      paused_slide_index: null,
      active_exercise_id: null,
      is_quiz_active: false,
      quiz_started_at: null,
    },
    sessionId
  );
}

// ============================================
// ABONNEMENT REALTIME
// ============================================

/** Compteur pour des noms de canal uniques (évite les conflits après remontage React) */
let channelCounter = 0;

/**
 * S'abonne aux changements de l'état de session en temps réel.
 *
 * @param callback Fonction appelée à chaque changement
 * @param sessionId Filtrer par session ID
 * @returns Fonction de cleanup pour se désabonner
 */
export function subscribeToSessionState(
  callback: SessionStateCallback,
  sessionId: string = DEFAULT_SESSION_ID
): () => void {
  if (!isSupabaseConfigured()) {
    console.log('[SessionState] Mode local - abonnement via store local');
    if (!localCallbacks.has(sessionId)) {
      localCallbacks.set(sessionId, new Set());
    }
    localCallbacks.get(sessionId)!.add(callback);
    return () => {
      localCallbacks.get(sessionId)?.delete(callback);
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  // Nom de canal unique pour éviter les conflits lors de remontages React
  channelCounter += 1;
  const channelName = `session_state:${sessionId}:${channelCounter}`;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'session_state',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        if (import.meta.env.DEV) {
          console.log('[SessionState] 📡 Changement reçu:', payload.new);
        }
        callback(payload.new as LiveSessionState);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'session_state',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        callback(payload.new as LiveSessionState);
      }
    )
    .subscribe((status) => {
      if (import.meta.env.DEV) {
        console.log(`[SessionState] Canal ${channelName}: ${status}`);
      }
    });

  // Retourner la fonction de cleanup
  return () => {
    if (import.meta.env.DEV) {
      console.log(`[SessionState] 🔌 Désabonnement du canal ${channelName}`);
    }
    supabase.removeChannel(channel);
  };
}
