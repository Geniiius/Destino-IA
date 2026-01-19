/**
 * @file types/api.ts
 * @description Tipos específicos para respuestas de API
 *
 * Solo PDF.js + Supabase - Sin IA
 */

import type { Participant, ChatMessage, SessionState } from "./index";

// ============================================
// RESPUESTAS DE SUPABASE
// ============================================

export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
}

// ============================================
// PAYLOADS DE REQUESTS
// ============================================

export interface CreateParticipantPayload {
  name: string;
}

export interface UpdateSessionPayload {
  current_slide_id?: string;
  is_exercise_active?: boolean;
  active_tab?: SessionState["active_tab"];
}

export interface SendMessagePayload {
  participantName: string;
  text: string;
  isAdmin?: boolean;
}

// ============================================
// EVENTOS REALTIME
// ============================================

export type RealtimeEventType = "INSERT" | "UPDATE" | "DELETE";

export interface RealtimeEvent<T> {
  eventType: RealtimeEventType;
  new: T;
  old: T | null;
}

export interface SessionUpdateEvent extends RealtimeEvent<SessionState> {}
export interface ParticipantUpdateEvent extends RealtimeEvent<Participant> {}
export interface ChatMessageEvent extends RealtimeEvent<ChatMessage> {}
