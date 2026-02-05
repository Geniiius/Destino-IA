/**
 * @file hooks/useParticipants.ts
 * @description Hook para gestionar participantes con caché
 *
 * CARACTERÍSTICAS:
 * - Caché de 30 segundos (datos que cambian frecuentemente)
 * - Deduplicación automática de fetches
 * - Refetch manual para actualización inmediata
 * - Soporte para filtrado por estado
 */

import { useMemo, useCallback } from 'react';
import { useCache } from './useCache';
import { invalidate as invalidateCacheKey, SHORT_TTL } from '@/lib/cache';
import { getSessionParticipants, type Participant } from '@/services/participants';

// ============================================
// TYPES
// ============================================

export interface UseParticipantsOptions {
  /** ID de la sesión */
  sessionId: string;
  /** Habilitar/deshabilitar el fetch */
  enabled?: boolean;
  /** Callback cuando se cargan los datos */
  onSuccess?: (participants: Participant[]) => void;
  /** Callback en caso de error */
  onError?: (error: Error) => void;
}

export interface UseParticipantsResult {
  /** Lista de todos los participantes */
  participants: Participant[];
  /** Solo participantes conectados */
  connectedParticipants: Participant[];
  /** Solo participantes desconectados */
  disconnectedParticipants: Participant[];
  /** Número total de participantes */
  totalCount: number;
  /** Número de participantes conectados */
  onlineCount: number;
  /** Estado de carga */
  isLoading: boolean;
  /** Error si lo hubo */
  error: Error | null;
  /** Forzar recarga */
  refetch: () => Promise<void>;
  /** Invalidar caché */
  invalidate: () => void;
  /** Buscar participante por ID */
  getById: (id: string) => Participant | undefined;
  /** Buscar participante por email */
  getByEmail: (email: string) => Participant | undefined;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook para gestionar participantes de una sesión
 *
 * @param options - Opciones del hook
 * @returns Participantes con helpers y estado
 *
 * @example
 * ```tsx
 * const {
 *   participants,
 *   onlineCount,
 *   isLoading,
 *   refetch
 * } = useParticipants({ sessionId: 'abc123' });
 *
 * // Mostrar participantes conectados
 * const { connectedParticipants } = useParticipants({ sessionId });
 * ```
 */
export function useParticipants(options: UseParticipantsOptions): UseParticipantsResult {
  const { sessionId, enabled = true, onSuccess, onError } = options;

  // Clave de caché única por sesión
  const cacheKey = `participants-${sessionId}`;

  // Usar el hook de caché genérico
  const {
    data,
    isLoading,
    error,
    refetch,
    invalidate: invalidateCache,
  } = useCache<Participant[]>({
    key: cacheKey,
    fetcher: () => getSessionParticipants(sessionId),
    ttl: SHORT_TTL, // 30 segundos
    enabled: enabled && !!sessionId,
    onSuccess,
    onError,
    staleWhileRevalidate: true, // Mostrar datos anteriores mientras carga
  });

  // Participantes (array vacío si no hay datos)
  const participants = useMemo(() => data || [], [data]);

  // Filtrar por estado de conexión
  const connectedParticipants = useMemo(
    () => participants.filter((p) => p.status === 'connected'),
    [participants]
  );

  const disconnectedParticipants = useMemo(
    () => participants.filter((p) => p.status === 'disconnected'),
    [participants]
  );

  // Conteos
  const totalCount = participants.length;
  const onlineCount = connectedParticipants.length;

  // === HELPERS ===

  const getById = useCallback(
    (id: string): Participant | undefined => {
      return participants.find((p) => p.id === id);
    },
    [participants]
  );

  const getByEmail = useCallback(
    (email: string): Participant | undefined => {
      const normalizedEmail = email.toLowerCase().trim();
      return participants.find((p) => p.email === normalizedEmail);
    },
    [participants]
  );

  return {
    participants,
    connectedParticipants,
    disconnectedParticipants,
    totalCount,
    onlineCount,
    isLoading,
    error,
    refetch,
    invalidate: invalidateCache,
    getById,
    getByEmail,
  };
}

// ============================================
// UTILITARIOS
// ============================================

/**
 * Invalida el caché de participantes para una sesión específica
 */
export function invalidateParticipantsCache(sessionId: string): void {
  invalidateCacheKey(`participants-${sessionId}`);
}

/**
 * Re-exportar tipo Participant para comodidad
 */
export type { Participant } from '@/services/participants';
