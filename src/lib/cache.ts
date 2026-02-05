/**
 * @file lib/cache.ts
 * @description Utilidad de caché en memoria genérica
 *
 * CARACTERÍSTICAS:
 * - Caché basada en Map (O(1) para get/set)
 * - TTL configurable por entrada
 * - Deduplicación de fetches simultáneos
 * - Sobrevive a re-renders, pero no a refresh de página
 * - TypeScript estricto con genéricos
 */

// ============================================
// TYPES
// ============================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  /** Tiempo de vida en milisegundos */
  ttl: number;
  /** Clave única para la entrada */
  key: string;
  /** Si true, devuelve datos stale mientras revalida */
  staleWhileRevalidate?: boolean;
}

// ============================================
// CACHE STORE (singleton fuera de React)
// ============================================

/** Almacén principal de entradas de caché */
const cacheStore = new Map<string, CacheEntry<unknown>>();

/** Almacén de promesas en curso para deduplicación */
const pendingRequests = new Map<string, Promise<unknown>>();

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

/**
 * Obtiene un valor de la caché
 * @returns Los datos si existen y no han expirado, null en caso contrario
 */
export function get<T>(key: string): T | null {
  const entry = cacheStore.get(key) as CacheEntry<T> | undefined;

  if (!entry) {
    return null;
  }

  // Verificar expiración
  if (Date.now() > entry.expiresAt) {
    // Entrada expirada, eliminarla
    cacheStore.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Almacena un valor en la caché
 * @param key - Clave única
 * @param data - Datos a almacenar
 * @param ttl - Tiempo de vida en milisegundos
 */
export function set<T>(key: string, data: T, ttl: number): void {
  const now = Date.now();

  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiresAt: now + ttl,
  };

  cacheStore.set(key, entry as CacheEntry<unknown>);
}

/**
 * Invalida (elimina) una entrada específica de la caché
 */
export function invalidate(key: string): void {
  cacheStore.delete(key);
  pendingRequests.delete(key);
}

/**
 * Invalida todas las entradas de la caché
 */
export function invalidateAll(): void {
  cacheStore.clear();
  pendingRequests.clear();
}

/**
 * Verifica si una entrada ha expirado
 * @returns true si la entrada no existe o ha expirado
 */
export function isExpired(key: string): boolean {
  const entry = cacheStore.get(key);

  if (!entry) {
    return true;
  }

  return Date.now() > entry.expiresAt;
}

/**
 * Obtiene datos stale (aunque hayan expirado)
 * Útil para stale-while-revalidate
 */
export function getStale<T>(key: string): T | null {
  const entry = cacheStore.get(key) as CacheEntry<T> | undefined;
  return entry?.data ?? null;
}

/**
 * Verifica si hay una solicitud pendiente para esta clave
 */
export function hasPendingRequest(key: string): boolean {
  return pendingRequests.has(key);
}

/**
 * Obtiene la promesa pendiente para una clave
 */
export function getPendingRequest<T>(key: string): Promise<T> | null {
  return (pendingRequests.get(key) as Promise<T>) ?? null;
}

/**
 * Registra una promesa pendiente para deduplicación
 */
export function setPendingRequest<T>(key: string, promise: Promise<T>): void {
  pendingRequests.set(key, promise);

  // Limpiar la promesa cuando se resuelva o rechace
  promise.finally(() => {
    pendingRequests.delete(key);
  });
}

/**
 * Obtiene estadísticas de la caché (útil para debugging)
 */
export function getCacheStats(): {
  entries: number;
  pendingRequests: number;
  keys: string[];
} {
  return {
    entries: cacheStore.size,
    pendingRequests: pendingRequests.size,
    keys: Array.from(cacheStore.keys()),
  };
}

// ============================================
// CONSTANTES PÚBLICAS
// ============================================

/** TTL por defecto: 5 minutos */
export const DEFAULT_TTL = 5 * 60 * 1000;

/** TTL corto: 30 segundos (para datos que cambian frecuentemente) */
export const SHORT_TTL = 30 * 1000;

/** TTL largo: 30 minutos (para datos estáticos) */
export const LONG_TTL = 30 * 60 * 1000;
