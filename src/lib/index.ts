/**
 * @file lib/index.ts
 * @description Barrel export para utilidades
 */

export * from './utils';

// Sistema de caché
export {
  get as cacheGet,
  set as cacheSet,
  invalidate as cacheInvalidate,
  invalidateAll as cacheInvalidateAll,
  isExpired as cacheIsExpired,
  getStale as cacheGetStale,
  getCacheStats,
  DEFAULT_TTL,
  SHORT_TTL,
  LONG_TTL,
} from './cache';

export type { CacheEntry, CacheOptions } from './cache';

// Sistema de Session ID
export {
  // Generación
  generateSessionId,
  // Validación
  isValidSessionId,
  isValidSessionCode,
  normalizeSessionId,
  // Persistencia
  saveSessionId,
  getSavedSessionId,
  clearSavedSessionId,
  getSessionCreatedAt,
  // Helpers
  createNewSession,
  joinSession,
  formatSessionIdDisplay,
  extractCode,
  // Constantes
  SESSION_ID_PREFIX,
  SESSION_CODE_LENGTH,
  SESSION_ALPHABET,
  SESSION_ID_REGEX,
  SESSION_CODE_REGEX,
} from './sessionId';

export type { NewSessionResult, JoinSessionResult } from './sessionId';
