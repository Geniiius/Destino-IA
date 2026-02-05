/**
 * @file lib/sessionId.ts
 * @description Generación y gestión de Session IDs para Destino IA
 *
 * FORMATO: DIA-XXXXXX
 * - Prefijo: DIA- (Destino IA)
 * - Cuerpo: 6 caractères alphanumériques
 * - Alphabet: Sin 0/O/1/I/L pour éviter la confusion
 */

import { customAlphabet } from 'nanoid';

// ============================================
// CONSTANTS
// ============================================

/** Prefijo de todos los Session IDs */
export const SESSION_ID_PREFIX = 'DIA-';

/** Longitud del código (sin prefijo) */
export const SESSION_CODE_LENGTH = 6;

/**
 * Alfabeto personnalisé sans caractères ambigus
 * Exclus: 0 (zéro), O (o mayúscula), 1 (uno), I (i mayúscula), L (ele)
 */
export const SESSION_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Regex para validar un Session ID completo */
export const SESSION_ID_REGEX = /^DIA-[A-HJ-NP-Z2-9]{6}$/;

/** Regex para validar solo el código (sin prefijo) */
export const SESSION_CODE_REGEX = /^[A-HJ-NP-Z2-9]{6}$/;

/** Clave para localStorage */
const STORAGE_KEY = 'destino-ia-session-id';
const STORAGE_CREATED_KEY = 'destino-ia-session-created';

// ============================================
// GENERADOR
// ============================================

/** Generador de códigos con nanoid */
const generateCode = customAlphabet(SESSION_ALPHABET, SESSION_CODE_LENGTH);

/**
 * Genera un nuevo Session ID único
 *
 * @returns Session ID en formato DIA-XXXXXX
 *
 * @example
 * ```ts
 * const id = generateSessionId();
 * // => "DIA-K7M3P9"
 * ```
 */
export function generateSessionId(): string {
  return `${SESSION_ID_PREFIX}${generateCode()}`;
}

// ============================================
// VALIDACIÓN
// ============================================

/**
 * Valida si un string es un Session ID válido
 *
 * @param id - String a validar
 * @returns true si el formato es válido
 *
 * @example
 * ```ts
 * isValidSessionId('DIA-K7M3P9'); // true
 * isValidSessionId('DIA-K7M3P0'); // false (contiene 0)
 * isValidSessionId('k7m3p9');     // false (sin prefijo)
 * ```
 */
export function isValidSessionId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return SESSION_ID_REGEX.test(id.toUpperCase());
}

/**
 * Valida solo el código (sin prefijo)
 */
export function isValidSessionCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  return SESSION_CODE_REGEX.test(code.toUpperCase());
}

/**
 * Normaliza un Session ID (agrega prefijo si falta, pasa a mayúsculas)
 *
 * @param input - Input del usuario
 * @returns Session ID normalizado o null si inválido
 *
 * @example
 * ```ts
 * normalizeSessionId('k7m3p9');     // "DIA-K7M3P9"
 * normalizeSessionId('dia-k7m3p9'); // "DIA-K7M3P9"
 * normalizeSessionId('DIA-K7M3P9'); // "DIA-K7M3P9"
 * normalizeSessionId('invalid');    // null
 * ```
 */
export function normalizeSessionId(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Limpiar espacios y pasar a mayúsculas
  const cleaned = input.trim().toUpperCase();

  // Si ya tiene el prefijo
  if (cleaned.startsWith(SESSION_ID_PREFIX)) {
    return SESSION_ID_REGEX.test(cleaned) ? cleaned : null;
  }

  // Si es solo el código
  if (SESSION_CODE_REGEX.test(cleaned)) {
    return `${SESSION_ID_PREFIX}${cleaned}`;
  }

  return null;
}

// ============================================
// PERSISTENCIA (localStorage)
// ============================================

/**
 * Guarda el Session ID en localStorage
 */
export function saveSessionId(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch (error) {
    console.warn('[sessionId] Error saving to localStorage:', error);
  }
}

/**
 * Recupera el Session ID guardado
 */
export function getSavedSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    // Verificar que sigue siendo válido
    if (saved && isValidSessionId(saved)) {
      return saved;
    }

    return null;
  } catch (error) {
    console.warn('[sessionId] Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Elimina el Session ID guardado
 */
export function clearSavedSessionId(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_CREATED_KEY);
  } catch (error) {
    console.warn('[sessionId] Error clearing localStorage:', error);
  }
}

// ============================================
// HELPERS
// ============================================

export interface NewSessionResult {
  sessionId: string;
  createdAt: Date;
}

/**
 * Crea una nueva sesión (para Admin)
 * Genera un ID, lo guarda y retorna los datos
 *
 * @example
 * ```ts
 * const { sessionId, createdAt } = createNewSession();
 * // sessionId: "DIA-K7M3P9"
 * // createdAt: Date
 * ```
 */
export function createNewSession(): NewSessionResult {
  const sessionId = generateSessionId();
  const createdAt = new Date();

  // Guardar en localStorage
  saveSessionId(sessionId);

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CREATED_KEY, createdAt.toISOString());
    }
  } catch {
    // Ignorar errores de localStorage
  }

  return { sessionId, createdAt };
}

export interface JoinSessionResult {
  /** Si el Session ID es válido */
  valid: boolean;
  /** Session ID normalizado (mayúsculas, con prefijo) */
  normalized: string;
  /** Mensaje de error si inválido */
  error?: string;
}

/**
 * Valida y normaliza un Session ID para unirse (para Participante)
 *
 * @param input - Input del usuario
 * @returns Resultado con validación y ID normalizado
 *
 * @example
 * ```ts
 * joinSession('k7m3p9');
 * // { valid: true, normalized: "DIA-K7M3P9" }
 *
 * joinSession('invalid');
 * // { valid: false, normalized: "", error: "..." }
 * ```
 */
export function joinSession(input: string): JoinSessionResult {
  // Input vacío
  if (!input || !input.trim()) {
    return {
      valid: false,
      normalized: '',
      error: 'Ingresa el código de sesión',
    };
  }

  const normalized = normalizeSessionId(input);

  if (normalized) {
    return {
      valid: true,
      normalized,
    };
  }

  // Determinar el tipo de error
  const cleaned = input.trim().toUpperCase().replace(SESSION_ID_PREFIX, '');

  if (cleaned.length < SESSION_CODE_LENGTH) {
    return {
      valid: false,
      normalized: '',
      error: `El código debe tener ${SESSION_CODE_LENGTH} caracteres`,
    };
  }

  if (cleaned.length > SESSION_CODE_LENGTH) {
    return {
      valid: false,
      normalized: '',
      error: `El código es demasiado largo`,
    };
  }

  // Contiene caracteres inválidos
  const invalidChars = cleaned.match(/[0OIL1]/g);
  if (invalidChars) {
    return {
      valid: false,
      normalized: '',
      error: `Caracteres no permitidos: ${[...new Set(invalidChars)].join(', ')}`,
    };
  }

  return {
    valid: false,
    normalized: '',
    error: 'Código de sesión inválido',
  };
}

/**
 * Obtiene la fecha de creación de la sesión guardada
 */
export function getSessionCreatedAt(): Date | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_CREATED_KEY);
    return saved ? new Date(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Formatea un Session ID para mostrar (con espaciado visual)
 *
 * @example
 * ```ts
 * formatSessionIdDisplay('DIA-K7M3P9');
 * // => "DIA-K7M3P9" (sin cambios por ahora)
 * ```
 */
export function formatSessionIdDisplay(sessionId: string): string {
  return sessionId;
}

/**
 * Extrae solo el código de un Session ID
 *
 * @example
 * ```ts
 * extractCode('DIA-K7M3P9'); // => "K7M3P9"
 * ```
 */
export function extractCode(sessionId: string): string {
  if (!sessionId) return '';

  const upper = sessionId.toUpperCase();

  if (upper.startsWith(SESSION_ID_PREFIX)) {
    return upper.slice(SESSION_ID_PREFIX.length);
  }

  return upper;
}
