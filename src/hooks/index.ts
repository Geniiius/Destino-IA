/**
 * @file hooks/index.ts
 * @description Barrel export para hooks
 */

// Hooks utilitarios generales
export { useLocalStorage } from "./useLocalStorage";
export { useDebounce } from "./useDebounce";
export { useCopyToClipboard } from "./useCopyToClipboard";

// Hook de caché genérico
export { useCache, useCachedFetch } from "./useCache";
export type { UseCacheOptions, UseCacheResult } from "./useCache";

// Hook de mensajes
export { useParticipantMessages } from "./useParticipantMessages";

// Hook de ejemplos de IA
export { 
  useAIExamples, 
  invalidateAIExamplesCache, 
  preloadAIExamples,
  getAssetUrl 
} from "./useAIExamples";

// Hook de participantes
export { 
  useParticipants,
  invalidateParticipantsCache
} from "./useParticipants";
export type { 
  UseParticipantsOptions, 
  UseParticipantsResult 
} from "./useParticipants";

// Los tipos de AI Examples se exportan desde @/types/aiExamples
