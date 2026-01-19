import { getSupabaseClient } from './supabase';
import type {
  ExerciseSubmission,
  GalleryBroadcastState,
  ExerciseStats,
} from '../types/gallery';

/**
 * Service pour gérer les soumissions d'images des exercices
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FORMATS = ['image/png', 'image/jpeg', 'image/webp'];
const STORAGE_BUCKET = 'workshop-content';

/**
 * Valide un fichier image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no válido. Solo PNG, JPG o WEBP.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Archivo demasiado grande. Máximo 5 MB.',
    };
  }

  return { valid: true };
}

/**
 * Upload une image vers Supabase Storage
 */
export async function uploadImageToStorage(
  file: File,
  sessionId: string,
  participantId: string,
  exerciseId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  // Générer un nom de fichier unique
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${sessionId}/${exerciseId}/${participantId}-${timestamp}.${extension}`;

  // Upload avec progression
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  // Simuler la progression (Storage API ne fournit pas de progression native)
  if (onProgress) {
    onProgress(100);
  }

  // Obtenir l'URL publique
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Soumettre une image pour un exercice
 */
export async function submitImage(
  sessionId: string,
  participantId: string,
  exerciseId: string,
  imageUrl: string
): Promise<ExerciseSubmission> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  // Vérifier si une soumission existe déjà (pour remplacer)
  const { data: existingSubmission } = await supabase
    .from('exercise_submissions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('participant_id', participantId)
    .eq('exercise_id', exerciseId)
    .single();

  if (existingSubmission) {
    // Mettre à jour la soumission existante
    const { data, error } = await supabase
      .from('exercise_submissions')
      .update({
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSubmission.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating submission:', error);
      throw new Error(`Error al actualizar la imagen: ${error.message}`);
    }

    return data;
  } else {
    // Créer une nouvelle soumission
    const { data, error } = await supabase
      .from('exercise_submissions')
      .insert({
        session_id: sessionId,
        participant_id: participantId,
        exercise_id: exerciseId,
        image_url: imageUrl,
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating submission:', error);
      throw new Error(`Error al enviar la imagen: ${error.message}`);
    }

    return data;
  }
}

/**
 * Obtenir toutes les soumissions d'un exercice
 */
export async function getExerciseSubmissions(
  sessionId: string,
  exerciseId: string
): Promise<ExerciseSubmission[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  const { data, error } = await supabase
    .from('exercise_submissions')
    .select(
      `
      *,
      participant:participants(name, email)
    `
    )
    .eq('session_id', sessionId)
    .eq('exercise_id', exerciseId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    throw new Error(`Error al cargar las imágenes: ${error.message}`);
  }

  // Mapper les données avec les infos du participant
  return data.map((submission: any) => ({
    ...submission,
    participant_name: submission.participant?.name || 'Anónimo',
    participant_email: submission.participant?.email || '',
  }));
}

/**
 * Obtenir la soumission d'un participant pour un exercice
 */
export async function getParticipantSubmission(
  sessionId: string,
  participantId: string,
  exerciseId: string
): Promise<ExerciseSubmission | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('exercise_submissions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('participant_id', participantId)
    .eq('exercise_id', exerciseId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Pas de soumission trouvée
      return null;
    }
    console.error('Error fetching participant submission:', error);
    return null;
  }

  return data;
}

/**
 * Marquer une soumission comme favorite (admin)
 */
export async function toggleFavorite(
  submissionId: string,
  isFavorite: boolean
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  const { error } = await supabase
    .from('exercise_submissions')
    .update({ is_favorite: isFavorite })
    .eq('id', submissionId);

  if (error) {
    console.error('Error toggling favorite:', error);
    throw new Error(`Error al marcar como favorito: ${error.message}`);
  }
}

/**
 * Obtenir les statistiques d'un exercice
 */
export async function getExerciseStats(
  sessionId: string,
  exerciseId: string
): Promise<ExerciseStats> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      exercise_id: exerciseId,
      total_submissions: 0,
      total_favorites: 0,
      last_submission_at: null,
    };
  }

  const { data, error } = await supabase.rpc('get_exercise_stats', {
    p_session_id: sessionId,
    p_exercise_id: exerciseId,
  });

  if (error) {
    console.error('Error fetching exercise stats:', error);
    return {
      exercise_id: exerciseId,
      total_submissions: 0,
      total_favorites: 0,
      last_submission_at: null,
    };
  }

  return {
    exercise_id: exerciseId,
    ...data[0],
  };
}

/**
 * Obtenir l'état de diffusion de la galerie
 */
export async function getBroadcastState(
  sessionId: string
): Promise<GalleryBroadcastState | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('gallery_broadcast_state')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Pas d'état de broadcast, créer un par défaut
      return await createDefaultBroadcastState(sessionId);
    }
    console.error('Error fetching broadcast state:', error);
    return null;
  }

  return data;
}

/**
 * Créer un état de broadcast par défaut
 */
async function createDefaultBroadcastState(
  sessionId: string
): Promise<GalleryBroadcastState | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('gallery_broadcast_state')
    .insert({
      session_id: sessionId,
      is_broadcasting: false,
      broadcast_mode: 'all',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating broadcast state:', error);
    return null;
  }

  return data;
}

/**
 * Démarrer la diffusion de la galerie (admin)
 */
export async function startBroadcast(
  sessionId: string,
  mode: 'all' | 'favorites' | 'single',
  exerciseId: string,
  submissionId?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  const { error } = await supabase
    .from('gallery_broadcast_state')
    .upsert({
      session_id: sessionId,
      is_broadcasting: true,
      broadcast_mode: mode,
      broadcast_exercise_id: exerciseId,
      broadcast_submission_id: submissionId || null,
      started_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error starting broadcast:', error);
    throw new Error(`Error al iniciar la difusión: ${error.message}`);
  }
}

/**
 * Arrêter la diffusion de la galerie (admin)
 */
export async function stopBroadcast(sessionId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  const { error } = await supabase
    .from('gallery_broadcast_state')
    .update({
      is_broadcasting: false,
      broadcast_exercise_id: null,
      broadcast_submission_id: null,
    })
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error stopping broadcast:', error);
    throw new Error(`Error al detener la difusión: ${error.message}`);
  }
}
