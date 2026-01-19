/**
 * Types pour le système de galerie collaborative
 */

export interface ExerciseSubmission {
  id: string;
  session_id: string;
  participant_id: string;
  exercise_id: string;
  image_url: string;
  image_thumbnail_url: string | null;
  is_favorite: boolean;
  submitted_at: string;
  updated_at: string;
  // Données dénormalisées pour l'affichage
  participant_name?: string;
  participant_email?: string;
}

export interface GalleryBroadcastState {
  id: string;
  session_id: string;
  is_broadcasting: boolean;
  broadcast_mode: 'all' | 'favorites' | 'single';
  broadcast_exercise_id: string | null;
  broadcast_submission_id: string | null;
  started_at: string | null;
  updated_at: string;
}

export interface ExerciseStats {
  exercise_id: string;
  total_submissions: number;
  total_favorites: number;
  last_submission_at: string | null;
}

export interface SubmissionUploadProgress {
  file: File;
  progress: number; // 0-100
  status: 'uploading' | 'success' | 'error';
  error?: string;
}
