/**
 * @file hooks/useCache.ts
 * @description Hook genérico para fetching con caché
 *
 * CARACTERÍSTICAS:
 * - Caché en memoria con TTL configurable
 * - Deduplicación de fetches simultáneos
 * - Soporte para refetch manual
 * - Callbacks onSuccess/onError
 * - TypeScript estricto
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  get,
  set,
  invalidate,
  isExpired,
  getStale,
  hasPendingRequest,
  getPendingRequest,
  setPendingRequest,
  DEFAULT_TTL,
} from '@/lib/cache';

// ============================================
// TYPES
// ============================================

export interface UseCacheOptions<T> {
  /** Clave única para la caché */
  key: string;
  /** Función que realiza el fetch de datos */
  fetcher: () => Promise<T>;
  /** Tiempo de vida en ms (default: 5 minutos) */
  ttl?: number;
  /** Si false, no ejecuta el fetch automáticamente */
  enabled?: boolean;
  /** Callback cuando el fetch es exitoso */
  onSuccess?: (data: T) => void;
  /** Callback cuando hay un error */
  onError?: (error: Error) => void;
  /** Si true, devuelve datos stale mientras revalida */
  staleWhileRevalidate?: boolean;
}

export interface UseCacheResult<T> {
  /** Datos obtenidos (o null si loading/error) */
  data: T | null;
  /** true mientras se está cargando */
  isLoading: boolean;
  /** Error si lo hubo */
  error: Error | null;
  /** Fuerza un nuevo fetch (ignora caché) */
  refetch: () => Promise<void>;
  /** Invalida la entrada de caché */
  invalidate: () => void;
  /** true si los datos son stale (expirados pero disponibles) */
  isStale: boolean;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook genérico para fetching con caché
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useCache({
 *   key: 'participants',
 *   fetcher: () => fetchParticipants(),
 *   ttl: 30_000, // 30 segundos
 * });
 * ```
 */
export function useCache<T>(options: UseCacheOptions<T>): UseCacheResult<T> {
  const {
    key,
    fetcher,
    ttl = DEFAULT_TTL,
    enabled = true,
    onSuccess,
    onError,
    staleWhileRevalidate = false,
  } = options;

  // Estado local
  const [data, setData] = useState<T | null>(() => get<T>(key));
  const [isLoading, setIsLoading] = useState<boolean>(!get<T>(key) && enabled);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);

  // Refs para evitar closures obsoletos
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Actualizar refs cuando cambien las opciones
  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [fetcher, onSuccess, onError]);

  // Función de fetch principal
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Si no está habilitado, no hacer nada
      if (!enabled && !forceRefresh) {
        return;
      }

      // Verificar caché válida (a menos que sea force refresh)
      if (!forceRefresh && !isExpired(key)) {
        const cached = get<T>(key);
        if (cached !== null) {
          setData(cached);
          setIsLoading(false);
          setIsStale(false);
          return;
        }
      }

      // Stale-while-revalidate: mostrar datos stale mientras cargamos nuevos
      if (staleWhileRevalidate) {
        const staleData = getStale<T>(key);
        if (staleData !== null) {
          setData(staleData);
          setIsStale(true);
        }
      }

      // Deduplicación: si ya hay un fetch en curso, esperar a que termine
      if (hasPendingRequest(key)) {
        try {
          const pendingResult = await getPendingRequest<T>(key);
          if (pendingResult !== null) {
            setData(pendingResult);
            setIsLoading(false);
            setIsStale(false);
          }
        } catch (err) {
          // El error ya fue manejado por el fetch original
        }
        return;
      }

      // Iniciar nuevo fetch
      setIsLoading(true);
      setError(null);

      try {
        // Crear y registrar la promesa
        const promise = fetcherRef.current();
        setPendingRequest(key, promise);

        const result = await promise;

        // Guardar en caché
        set(key, result, ttl);

        // Actualizar estado
        setData(result);
        setIsStale(false);

        // Callback de éxito
        onSuccessRef.current?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        // Callback de error
        onErrorRef.current?.(error);

        console.error(`[useCache] Error fetching "${key}":`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [key, ttl, enabled, staleWhileRevalidate]
  );

  // Ejecutar fetch al montar o cuando cambie la key/enabled
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [key, enabled, fetchData]);

  // Función para refetch manual
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Función para invalidar la caché
  const invalidateCache = useCallback(() => {
    invalidate(key);
    setData(null);
    setIsStale(false);
  }, [key]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate: invalidateCache,
    isStale,
  };
}

// ============================================
// UTILITIES
// ============================================

/**
 * Hook simplificado para casos donde solo necesitas datos estáticos
 */
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): UseCacheResult<T> {
  return useCache({ key, fetcher, ttl });
}
