import { useState, useEffect } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../../../services/supabase/client";
import { Exercise } from "../../../data/exercises";

export interface SessionState {
  sessionId: string;
  currentExercise: Exercise | null;
  isExerciseActive: boolean;
  isPresentationPaused: boolean;
  presentationSlideIndex: number;
  participants: {
    userId: string;
    hasCompleted: boolean;
  }[];
  startedAt?: string;
}

export const useExerciseSync = (
  sessionId: string,
  isAdmin: boolean = false
) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId,
    currentExercise: null,
    isExerciseActive: false,
    isPresentationPaused: false,
    presentationSlideIndex: 0,
    participants: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'état initial
  useEffect(() => {
    if (isSupabaseConfigured()) {
      loadSessionState();
    } else {
      setLoading(false);
      console.warn(
        "⚠️ Mode local : Supabase non configuré. La synchronisation temps réel est désactivée."
      );
    }
  }, [sessionId]);

  // S'abonner aux changements temps réel
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_state",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            updateLocalState(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId]);

  const loadSessionState = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("session_state")
        .select("*")
        .eq("session_id", sessionId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        updateLocalState(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const updateLocalState = (data: any) => {
    setSessionState({
      sessionId: data.session_id,
      currentExercise: data.current_exercise,
      isExerciseActive: data.is_exercise_active,
      isPresentationPaused: data.is_presentation_paused,
      presentationSlideIndex: data.presentation_slide_index || 0,
      participants: data.participants || [],
      startedAt: data.started_at,
    });
  };

  const launchExercise = async (
    exercise: Exercise,
    currentSlideIndex: number = 0
  ) => {
    if (!isAdmin) {
      throw new Error("Seul l'admin peut lancer un exercice");
    }

    // Mode local sans Supabase : mise à jour de l'état local uniquement
    if (!supabase) {
      setSessionState((prev) => ({
        ...prev,
        currentExercise: exercise,
        isExerciseActive: true,
        isPresentationPaused: true,
        presentationSlideIndex: currentSlideIndex,
        startedAt: new Date().toISOString(),
      }));
      console.info("✓ Exercice lancé en mode local (sans synchronisation)");
      return true;
    }

    try {
      const newState = {
        session_id: sessionId,
        current_exercise: exercise,
        is_exercise_active: true,
        is_presentation_paused: true,
        presentation_slide_index: currentSlideIndex,
        participants: [],
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("session_state")
        .upsert(newState, { onConflict: "session_id" });

      if (error) throw error;

      // Envoyer une notification aux participants
      await supabase.from("notifications").insert({
        session_id: sessionId,
        type: "exercise_started",
        data: { exercise },
        created_at: new Date().toISOString(),
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de lancement");
      return false;
    }
  };

  const stopExercise = async () => {
    if (!isAdmin) {
      throw new Error("Seul l'admin peut arrêter un exercice");
    }

    // Mode local sans Supabase
    if (!supabase) {
      setSessionState((prev) => ({
        ...prev,
        isExerciseActive: false,
        isPresentationPaused: false,
      }));
      console.info("✓ Exercice terminé en mode local (sans synchronisation)");
      return true;
    }

    try {
      const { error } = await supabase
        .from("session_state")
        .update({
          is_exercise_active: false,
          is_presentation_paused: false,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId);

      if (error) throw error;

      // Notifier les participants
      await supabase.from("notifications").insert({
        session_id: sessionId,
        type: "exercise_ended",
        data: { resumeSlideIndex: sessionState.presentationSlideIndex },
        created_at: new Date().toISOString(),
      });

      return true;
    } catch (err) {
      console.error("Error stopping exercise:", err);
      setError(err instanceof Error ? err.message : "Erreur d'arrêt");
      return false;
    }
  };

  const markExerciseComplete = async (userId: string) => {
    // Mode local sans Supabase
    if (!supabase) {
      const updatedParticipants = [
        ...sessionState.participants.filter((p) => p.userId !== userId),
        { userId, hasCompleted: true },
      ];
      setSessionState((prev) => ({
        ...prev,
        participants: updatedParticipants,
      }));
      return true;
    }

    try {
      const updatedParticipants = [
        ...sessionState.participants.filter((p) => p.userId !== userId),
        { userId, hasCompleted: true },
      ];

      const { error } = await supabase
        .from("session_state")
        .update({
          participants: updatedParticipants,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId);

      if (error) throw error;

      return true;
    } catch (err) {
      return false;
    }
  };

  const updatePresentationSlide = async (slideIndex: number) => {
    if (!isAdmin) return false;

    // Mode local sans Supabase
    if (!supabase) {
      setSessionState((prev) => ({
        ...prev,
        presentationSlideIndex: slideIndex,
      }));
      return true;
    }

    try {
      const { error } = await supabase
        .from("session_state")
        .update({
          presentation_slide_index: slideIndex,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId);

      if (error) throw error;
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    sessionState,
    loading,
    error,
    launchExercise,
    stopExercise,
    markExerciseComplete,
    updatePresentationSlide,
  };
};
