/**
 * @file hooks/useAIExamples.ts
 * @description Hook para cargar y filtrar ejemplos de IA desde assets estáticos
 *
 * MIGRACIÓN FINOPS:
 * - Assets movidos de Supabase Storage a /public/assets/
 * - Servidos via Vercel CDN (0 egress Supabase)
 * - Usa sistema de caché genérico (src/lib/cache.ts)
 */

import { useMemo, useCallback } from 'react';
import { useCache } from './useCache';
import { invalidate as invalidateCacheKey, LONG_TTL } from '@/lib/cache';
import type {
  AIExample,
  AIExamplesData,
  AITool,
  AIExampleType,
  UseAIExamplesOptions,
  UseAIExamplesResult,
} from '@/types/aiExamples';

// ============================================
// CONSTANTES
// ============================================

/** Clave de caché para ejemplos de IA */
const CACHE_KEY = 'ai-examples';

/** URL del archivo JSON estático */
const EXAMPLES_URL = '/assets/ai-examples/examples.json';

// ============================================
// FETCHER
// ============================================

async function fetchExamples(): Promise<AIExamplesData> {
  const response = await fetch(EXAMPLES_URL);

  if (!response.ok) {
    throw new Error(`Failed to load AI examples: ${response.status}`);
  }

  return response.json();
}

// ============================================
// HOOK PRINCIPAL
// ============================================

/**
 * Hook para cargar y filtrar ejemplos de IA
 *
 * @param options - Opciones de filtrado
 * @returns Ejemplos filtrados con helpers
 *
 * @example
 * ```tsx
 * // Todos los ejemplos
 * const { examples, isLoading } = useAIExamples();
 *
 * // Solo imágenes de Grok
 * const { examples } = useAIExamples({ tool: 'grok', type: 'image' });
 *
 * // Ejemplos de un ejercicio específico
 * const { examples } = useAIExamples({ exerciseId: 'intro' });
 * ```
 */
export function useAIExamples(options: UseAIExamplesOptions = {}): UseAIExamplesResult {
  // Usar el hook de caché genérico
  const {
    data,
    isLoading,
    error,
  } = useCache<AIExamplesData>({
    key: CACHE_KEY,
    fetcher: fetchExamples,
    ttl: LONG_TTL, // 30 minutos (datos estáticos)
  });

  // Todos los ejemplos sin filtrar
  const allExamples = useMemo(() => data?.examples || [], [data]);

  // Aplicar filtros
  const filteredExamples = useMemo(() => {
    let result = allExamples;

    // Filtrar por herramienta
    if (options.tool && options.tool !== 'all') {
      result = result.filter((ex) => ex.tool === options.tool);
    }

    // Filtrar por tipo
    if (options.type && options.type !== 'all') {
      result = result.filter((ex) => ex.type === options.type);
    }

    // Filtrar por dificultad
    if (options.difficulty && options.difficulty !== 'all') {
      result = result.filter((ex) => ex.difficulty === options.difficulty);
    }

    // Filtrar por ejercicio
    if (options.exerciseId) {
      result = result.filter((ex) => ex.exerciseId === options.exerciseId);
    }

    // Filtrar por tags
    if (options.tags && options.tags.length > 0) {
      result = result.filter((ex) =>
        options.tags!.some((tag) => ex.tags.includes(tag))
      );
    }

    return result;
  }, [allExamples, options.tool, options.type, options.difficulty, options.exerciseId, options.tags]);

  // === HELPERS ===

  const getByTool = useCallback(
    (tool: AITool): AIExample[] => {
      return allExamples.filter((ex) => ex.tool === tool);
    },
    [allExamples]
  );

  const getByType = useCallback(
    (type: AIExampleType): AIExample[] => {
      return allExamples.filter((ex) => ex.type === type);
    },
    [allExamples]
  );

  const getById = useCallback(
    (id: string): AIExample | undefined => {
      return allExamples.find((ex) => ex.id === id);
    },
    [allExamples]
  );

  const getByExercise = useCallback(
    (exerciseId: string): AIExample[] => {
      return allExamples.filter((ex) => ex.exerciseId === exerciseId);
    },
    [allExamples]
  );

  const getByTags = useCallback(
    (tags: string[]): AIExample[] => {
      return allExamples.filter((ex) =>
        tags.some((tag) => ex.tags.includes(tag))
      );
    },
    [allExamples]
  );

  return {
    examples: filteredExamples,
    allExamples,
    isLoading,
    error,
    getByTool,
    getByType,
    getById,
    getByExercise,
    getByTags,
    meta: data?._meta || null,
  };
}

// ============================================
// UTILITARIOS
// ============================================

/**
 * Invalida el cache manualmente (útil después de una actualización admin)
 */
export function invalidateAIExamplesCache(): void {
  invalidateCacheKey(CACHE_KEY);
}

/**
 * Precarga los ejemplos (útil al inicio de la app)
 */
export async function preloadAIExamples(): Promise<void> {
  // Precarga simplemente haciendo el fetch y dejando que useCache lo almacene
  try {
    await fetchExamples();
  } catch (err) {
    console.warn('[preloadAIExamples] Failed to preload:', err);
  }
}

/**
 * Obtiene la URL completa de un asset
 * (para uso fuera de componentes React)
 */
export function getAssetUrl(assetPath: string): string {
  // En desarrollo, la ruta relativa funciona directamente
  // En producción con Vercel, también funciona
  return assetPath;
}
