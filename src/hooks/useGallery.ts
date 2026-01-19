import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../services/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type {
  ExerciseSubmission,
  GalleryBroadcastState,
  ExerciseStats,
} from '../types/gallery';
import * as submissionsService from '../services/submissions';

/**
 * Hook pour gérer la galerie collaborative
 * Gère les soumissions d'images et la diffusion de la galerie
 */

interface UseGalleryOptions {
  sessionId: string;
  exerciseId?: string;
  participantId?: string;
}

interface UseGalleryReturn {
  // État des soumissions
  submissions: ExerciseSubmission[];
  mySubmission: ExerciseSubmission | null;
  stats: ExerciseStats | null;
  loading: boolean;
  error: string | null;

  // État de la diffusion
  broadcastState: GalleryBroadcastState | null;
  isBroadcasting: boolean;

  // Actions participant
  submitImage: (file: File) => Promise<void>;
  uploadProgress: number;

  // Actions admin
  toggleFavorite: (submissionId: string, isFavorite: boolean) => Promise<void>;
  startBroadcast: (
    mode: 'all' | 'favorites' | 'single',
    exerciseId: string,
    submissionId?: string
  ) => Promise<void>;
  stopBroadcast: () => Promise<void>;

  // Utilitaires
  refreshSubmissions: () => Promise<void>;
}

export function useGallery({
  sessionId,
  exerciseId,
  participantId,
}: UseGalleryOptions): UseGalleryReturn {
  const [submissions, setSubmissions] = useState<ExerciseSubmission[]>([]);
  const [mySubmission, setMySubmission] = useState<ExerciseSubmission | null>(
    null
  );
  const [stats, setStats] = useState<ExerciseStats | null>(null);
  const [broadcastState, setBroadcastState] =
    useState<GalleryBroadcastState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const supabase = getSupabaseClient();

  /**
   * Charger les soumissions d'un exercice
   */
  const loadSubmissions = useCallback(async () => {
    if (!exerciseId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await submissionsService.getExerciseSubmissions(
        sessionId,
        exerciseId
      );
      setSubmissions(data);

      // Charger les stats
      const statsData = await submissionsService.getExerciseStats(
        sessionId,
        exerciseId
      );
      setStats(statsData);

      // Si on a un participantId, charger sa soumission
      if (participantId) {
        const myData = await submissionsService.getParticipantSubmission(
          sessionId,
          participantId,
          exerciseId
        );
        setMySubmission(myData);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError(
        err instanceof Error ? err.message : 'Error al cargar las imágenes'
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId, exerciseId, participantId]);

  /**
   * Charger l'état de diffusion
   */
  const loadBroadcastState = useCallback(async () => {
    try {
      const data = await submissionsService.getBroadcastState(sessionId);
      setBroadcastState(data);
    } catch (err) {
      console.error('Error loading broadcast state:', err);
    }
  }, [sessionId]);

  /**
   * Soumettre une image (participant)
   */
  const submitImageHandler = useCallback(
    async (file: File) => {
      if (!exerciseId || !participantId) {
        throw new Error('Exercise ID y Participant ID son requeridos');
      }

      try {
        setUploadProgress(0);
        setError(null);

        // Valider le fichier
        const validation = submissionsService.validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Upload vers Storage
        const imageUrl = await submissionsService.uploadImageToStorage(
          file,
          sessionId,
          participantId,
          exerciseId,
          setUploadProgress
        );

        // Créer la soumission dans la DB
        const submission = await submissionsService.submitImage(
          sessionId,
          participantId,
          exerciseId,
          imageUrl
        );

        setMySubmission(submission);
        setUploadProgress(100);

        // Rafraîchir les soumissions
        await loadSubmissions();
      } catch (err) {
        console.error('Error submitting image:', err);
        setError(
          err instanceof Error ? err.message : 'Error al enviar la imagen'
        );
        throw err;
      }
    },
    [sessionId, exerciseId, participantId, loadSubmissions]
  );

  /**
   * Toggle favori (admin)
   */
  const toggleFavoriteHandler = useCallback(
    async (submissionId: string, isFavorite: boolean) => {
      try {
        await submissionsService.toggleFavorite(submissionId, isFavorite);

        // Mettre à jour localement
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId ? { ...sub, is_favorite: isFavorite } : sub
          )
        );

        // Rafraîchir les stats
        if (exerciseId) {
          const statsData = await submissionsService.getExerciseStats(
            sessionId,
            exerciseId
          );
          setStats(statsData);
        }
      } catch (err) {
        console.error('Error toggling favorite:', err);
        throw err;
      }
    },
    [sessionId, exerciseId]
  );

  /**
   * Démarrer la diffusion (admin)
   */
  const startBroadcastHandler = useCallback(
    async (
      mode: 'all' | 'favorites' | 'single',
      broadcastExerciseId: string,
      submissionId?: string
    ) => {
      try {
        await submissionsService.startBroadcast(
          sessionId,
          mode,
          broadcastExerciseId,
          submissionId
        );
        await loadBroadcastState();
      } catch (err) {
        console.error('Error starting broadcast:', err);
        throw err;
      }
    },
    [sessionId, loadBroadcastState]
  );

  /**
   * Arrêter la diffusion (admin)
   */
  const stopBroadcastHandler = useCallback(async () => {
    try {
      await submissionsService.stopBroadcast(sessionId);
      await loadBroadcastState();
    } catch (err) {
      console.error('Error stopping broadcast:', err);
      throw err;
    }
  }, [sessionId, loadBroadcastState]);

  /**
   * Setup Realtime subscriptions
   */
  useEffect(() => {
    if (!supabase) return;

    let submissionsChannel: RealtimeChannel | null = null;
    let broadcastChannel: RealtimeChannel | null = null;

    const setupRealtimeSubmissions = () => {
      submissionsChannel = supabase
        .channel(`exercise_submissions:${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'exercise_submissions',
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            console.log('Submission change:', payload);

            if (payload.eventType === 'INSERT') {
              // Nouvelle soumission
              const newSubmission = payload.new as ExerciseSubmission;
              if (newSubmission.exercise_id === exerciseId) {
                loadSubmissions();
              }
            } else if (payload.eventType === 'UPDATE') {
              // Soumission mise à jour (remplacement ou favori)
              const updatedSubmission = payload.new as ExerciseSubmission;
              if (updatedSubmission.exercise_id === exerciseId) {
                setSubmissions((prev) =>
                  prev.map((sub) =>
                    sub.id === updatedSubmission.id ? updatedSubmission : sub
                  )
                );

                // Si c'est ma soumission
                if (updatedSubmission.participant_id === participantId) {
                  setMySubmission(updatedSubmission);
                }
              }
            } else if (payload.eventType === 'DELETE') {
              // Soumission supprimée
              const deletedId = payload.old.id;
              setSubmissions((prev) => prev.filter((sub) => sub.id !== deletedId));
              if (mySubmission?.id === deletedId) {
                setMySubmission(null);
              }
            }
          }
        )
        .subscribe();
    };

    const setupRealtimeBroadcast = () => {
      broadcastChannel = supabase
        .channel(`gallery_broadcast:${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'gallery_broadcast_state',
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            console.log('Broadcast change:', payload);
            if (payload.new) {
              setBroadcastState(payload.new as GalleryBroadcastState);
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubmissions();
    setupRealtimeBroadcast();

    return () => {
      if (submissionsChannel) {
        supabase.removeChannel(submissionsChannel);
      }
      if (broadcastChannel) {
        supabase.removeChannel(broadcastChannel);
      }
    };
  }, [supabase, sessionId, exerciseId, participantId, loadSubmissions, mySubmission]);

  /**
   * Chargement initial
   */
  useEffect(() => {
    loadSubmissions();
    loadBroadcastState();
  }, [loadSubmissions, loadBroadcastState]);

  return {
    // État
    submissions,
    mySubmission,
    stats,
    loading,
    error,
    broadcastState,
    isBroadcasting: broadcastState?.is_broadcasting || false,

    // Actions participant
    submitImage: submitImageHandler,
    uploadProgress,

    // Actions admin
    toggleFavorite: toggleFavoriteHandler,
    startBroadcast: startBroadcastHandler,
    stopBroadcast: stopBroadcastHandler,

    // Utilitaires
    refreshSubmissions: loadSubmissions,
  };
}
