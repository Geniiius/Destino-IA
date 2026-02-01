/**
 * @file types/gallery.ts
 * @description Types pour le système de galerie d'images/vidéos
 */

/**
 * Type de média dans la galerie
 */
export type MediaType = "image" | "video";

/**
 * Statut de traitement du média
 */
export type MediaStatus = "uploading" | "processing" | "ready" | "error";

/**
 * Média dans la galerie
 */
export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  participantId: string;
  participantName: string;
  exerciseId: string;
  exerciseName?: string;
  prompt?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    format?: string;
  };
  status: MediaStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * État global de la galerie
 */
export interface GalleryState {
  images: GalleryImage[];
  isLoading: boolean;
  error: string | null;
  selectedImage: GalleryImage | null;
  filters: {
    exerciseId?: string;
    participantId?: string;
    type?: MediaType;
    status?: MediaStatus;
  };
}

/**
 * Paramètres pour charger la galerie
 */
export interface LoadGalleryParams {
  sessionId?: string;
  exerciseId?: string;
  participantId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Paramètres pour uploader un média
 */
export interface UploadMediaParams {
  file: File;
  participantId: string;
  participantName: string;
  exerciseId: string;
  prompt?: string;
  metadata?: GalleryImage["metadata"];
}

/**
 * Résultat d'upload
 */
export interface UploadMediaResult {
  success: boolean;
  image?: GalleryImage;
  error?: string;
}
