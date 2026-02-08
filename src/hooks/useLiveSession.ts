/**
 * @file hooks/useLiveSession.ts
 * @description Hook React pour le pilotage et le suivi de session en temps réel
 *
 * Usage Admin :
 *   const { state, actions, isReady } = useLiveSession();
 *   actions.goToSlide(5);
 *   actions.pauseForExercise('agencia');
 *   actions.resumePresentation();
 *
 * Usage Participant :
 *   const { state, isReady } = useLiveSession();
 *   // state se met à jour automatiquement via Realtime
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  LiveSessionState,
  SessionMode,
  SlideTheme,
  UseLiveSessionReturn,
} from '@/types/session';
import { DEFAULT_SESSION_ID, DEFAULT_LIVE_STATE } from '@/types/session';
import {
  getSessionState,
  updateSessionState,
  changeMode,
  resumePresentation as resumePresentationService,
  subscribeToSessionState,
} from '@/services/sessionState';

// ============================================
// HOOK PRINCIPAL
// ============================================

interface UseLiveSessionOptions {
  /** ID de la session (défaut: destino-ia-workshop) */
  sessionId?: string;
  /** Activer l'abonnement Realtime (défaut: true) */
  realtime?: boolean;
}

export function useLiveSession(
  options: UseLiveSessionOptions = {}
): UseLiveSessionReturn {
  const { sessionId = DEFAULT_SESSION_ID, realtime = true } = options;

  const [state, setState] = useState<LiveSessionState>(DEFAULT_LIVE_STATE);
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref pour éviter les mises à jour après unmount
  const mountedRef = useRef(true);

  // ── Chargement initial ─────────────────────────

  useEffect(() => {
    mountedRef.current = true;

    async function loadInitialState() {
      const { data, error: loadError } = await getSessionState(sessionId);

      if (!mountedRef.current) return;

      if (loadError) {
        setError(loadError);
        console.warn('[useLiveSession] Erreur chargement, fallback local:', loadError);
      }

      if (data) {
        setState(data);
      }

      setIsReady(true);
    }

    loadInitialState();

    return () => {
      mountedRef.current = false;
    };
  }, [sessionId]);

  // ── Abonnement Realtime ────────────────────────

  useEffect(() => {
    if (!realtime || !isReady) return;

    const unsubscribe = subscribeToSessionState((newState) => {
      if (mountedRef.current) {
        setState(newState);
        setIsConnected(true);

        if (import.meta.env.DEV) {
          console.log('[useLiveSession] 📡 État synchronisé:', {
            slide: newState.current_slide_index,
            mode: newState.current_mode,
            live: newState.is_live,
          });
        }
      }
    }, sessionId);

    setIsConnected(true);

    return () => {
      unsubscribe();
      if (mountedRef.current) {
        setIsConnected(false);
      }
    };
  }, [sessionId, realtime, isReady]);

  // ── Helpers internes ───────────────────────────

  /**
   * Applique une mise à jour optimiste : met à jour le state local
   * immédiatement, puis synchronise avec Supabase.
   */
  const optimisticUpdate = useCallback(
    async (updates: Partial<LiveSessionState>) => {
      // Mise à jour optimiste locale
      setState((prev) => ({ ...prev, ...updates }));

      // Synchronisation Supabase
      const { data, error: updateError } = await updateSessionState(updates, sessionId);

      if (updateError) {
        setError(updateError);
        console.error('[useLiveSession] Erreur sync:', updateError);
        // Recharger l'état réel en cas d'erreur
        const { data: freshData } = await getSessionState(sessionId);
        if (freshData && mountedRef.current) {
          setState(freshData);
        }
      } else if (data && mountedRef.current) {
        // Pas besoin de setState ici car le Realtime va le faire
        // sauf en mode local
        setState(data);
      }
    },
    [sessionId]
  );

  // ── Actions de pilotage ────────────────────────

  const goToSlide = useCallback(
    async (index: number) => {
      const clampedIndex = Math.max(1, Math.min(index, state.total_slides));
      await optimisticUpdate({ current_slide_index: clampedIndex });
    },
    [optimisticUpdate, state.total_slides]
  );

  const nextSlide = useCallback(async () => {
    if (state.current_slide_index < state.total_slides) {
      await goToSlide(state.current_slide_index + 1);
    }
  }, [goToSlide, state.current_slide_index, state.total_slides]);

  const previousSlide = useCallback(async () => {
    if (state.current_slide_index > 1) {
      await goToSlide(state.current_slide_index - 1);
    }
  }, [goToSlide, state.current_slide_index]);

  const setMode = useCallback(
    async (mode: SessionMode) => {
      const { data, error: modeError } = await changeMode(
        mode,
        {
          pausedSlideIndex: mode !== 'presentation' ? state.current_slide_index : undefined,
        },
        sessionId
      );

      if (modeError) {
        setError(modeError);
      } else if (data && mountedRef.current) {
        setState(data);
      }
    },
    [sessionId, state.current_slide_index]
  );

  const pauseForExercise = useCallback(
    async (exerciseId: string) => {
      const { data, error: exError } = await changeMode(
        'exercise',
        {
          exerciseId,
          pausedSlideIndex: state.current_slide_index,
        },
        sessionId
      );

      if (exError) {
        setError(exError);
      } else if (data && mountedRef.current) {
        setState(data);
      }
    },
    [sessionId, state.current_slide_index]
  );

  const pauseForQuiz = useCallback(async () => {
    const { data, error: quizError } = await changeMode(
      'quiz',
      {
        pausedSlideIndex: state.current_slide_index,
      },
      sessionId
    );

    if (quizError) {
      setError(quizError);
    } else if (data && mountedRef.current) {
      setState(data);
    }
  }, [sessionId, state.current_slide_index]);

  const resumePresentation = useCallback(async () => {
    const { data, error: resumeError } = await resumePresentationService(sessionId);

    if (resumeError) {
      setError(resumeError);
    } else if (data && mountedRef.current) {
      setState(data);
    }
  }, [sessionId]);

  const setTheme = useCallback(
    async (theme: SlideTheme) => {
      await optimisticUpdate({
        slide_theme: theme.name,
        slide_manifest_url: theme.manifestUrl,
        total_slides: theme.slideCount ?? state.total_slides,
        current_slide_index: 1, // Reset au premier slide du nouveau thème
      });
    },
    [optimisticUpdate, state.total_slides]
  );

  const toggleLive = useCallback(async () => {
    await optimisticUpdate({ is_live: !state.is_live });
  }, [optimisticUpdate, state.is_live]);

  // ── Valeur retournée ───────────────────────────

  return {
    state,
    isReady,
    isConnected,
    error,
    actions: {
      goToSlide,
      nextSlide,
      previousSlide,
      setMode,
      pauseForExercise,
      pauseForQuiz,
      resumePresentation,
      setTheme,
      toggleLive,
    },
  };
}
