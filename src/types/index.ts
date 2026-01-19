/**
 * @file types/index.ts
 * @description Tipos globales de la aplicación
 *
 * Organización:
 * - Entidades del dominio
 * - Estados de la aplicación
 * - Tipos de UI
 * - Utilidades de tipos
 */

// ============================================
// ENTIDADES DEL DOMINIO
// ============================================

export type SlideType = "intro" | "theory" | "exercise" | "challenge";

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  order_index: number;
  type: SlideType;
  is_active: boolean;
  imageUrl?: string; // URL de l'image de la page PDF (data URL ou storage URL)
}

export interface Exercise extends Slide {
  description: string;
  example_images: string[];
  ai_tool_name: string;
  ai_tool_url: string;
}

export interface Participant {
  id: string;
  name: string;
  status: "online" | "offline";
  assigned_email?: string;
  joined_at: string;
}

export interface ChatMessage {
  id: string;
  participantName: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================

export type ActiveTab =
  | "slides"
  | "exercises"
  | "gallery"
  | "quiz"
  | "challenge"
  | "examples";

export interface SessionState {
  current_slide_id: string;
  is_exercise_active: boolean;
  active_tab: ActiveTab;
  is_quiz_active: boolean;
  quiz_started_at?: string;
}

export const SESSION_STATE_ID = "00000000-0000-0000-0000-000000000000";

// ============================================
// TIPOS DE UI
// ============================================

export type ViewType = "home" | "admin" | "join" | "workshop";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

// ============================================
// UTILIDADES DE TIPOS
// ============================================

/**
 * Hace todas las propiedades opcionales excepto las especificadas
 */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

/**
 * Extrae el tipo de un array
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Tipo para respuestas de API
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: "success" | "error" | "loading";
}

// ============================================
// SISTEMA DE GALERÍA
// ============================================
export * from './gallery';
