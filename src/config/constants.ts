/**
 * @file constants.ts
 * @description Constantes globales de la aplicación
 *
 * Organización:
 * - APP: Configuración general
 * - UI: Constantes de interfaz
 * - API: Endpoints y configuración
 * - LIMITS: Límites y restricciones
 */

export const APP = {
  NAME: "Destino IA",
  DESCRIPTION: "El taller definitivo de IA Generativa para mentes creativas",
  VERSION: "0.1.0",
  AUTHOR: "Destino IA Labs",
  YEAR: 2025,
} as const;

export const UI = {
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },

  // Animaciones (ms)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Colores (para uso programático)
  COLORS: {
    PRIMARY: "#10b981",
    PRIMARY_HOVER: "#059669",
    BACKGROUND: "#050508",
    SURFACE: "#0a0a0f",
  },
} as const;

export const API = {
  // Timeouts (ms)
  TIMEOUTS: {
    DEFAULT: 30000,
    REALTIME: 10000,
  },
} as const;

export const LIMITS = {
  // Participantes
  MAX_PARTICIPANTS: 50,
  MAX_NAME_LENGTH: 30,
  MIN_NAME_LENGTH: 2,

  // Chat
  MAX_MESSAGE_LENGTH: 500,
  MESSAGES_PER_PAGE: 50,

  // Slides
  MAX_SLIDES: 100,
  MAX_TITLE_LENGTH: 60,
  MAX_CONTENT_LENGTH: 500,
} as const;

export const ROUTES = {
  HOME: "/",
  ADMIN: "#admin",
  JOIN: "#join",
  WORKSHOP: "#workshop",
} as const;

/**
 * Canales de Supabase Realtime
 */
export const REALTIME_CHANNELS = {
  SESSION_STATE: "session_state_updates",
  PARTICIPANTS: "participants_updates",
  CHAT: "chat_messages",
} as const;
