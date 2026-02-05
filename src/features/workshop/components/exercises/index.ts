/**
 * @file exercises/index.ts
 * @description Barrel export para el sistema de ejercicios con lazy loading
 *
 * IMPORTANTE: Los ejercicios individuales NO se exportan aquí para forzar
 * el uso de ExerciseLoader que gestiona el lazy loading.
 */

// Loader principal (único punto de entrada recomendado)
export { ExerciseLoader } from './ExerciseLoader';
export type { ExerciseLoaderProps } from './ExerciseLoader';

// Fallback (para uso en Suspense personalizado)
export { ExerciseFallback, ExerciseFallbackCompact } from './ExerciseFallback';

// Registry y helpers
export {
  // Funciones de consulta
  getExercise,
  getAllExercises,
  getExercisesByTool,
  getExercisesByCategory,
  getExercisesByDifficulty,
  searchExercises,
  getSimilarExercises,
  // Constantes UI
  TOOL_COLORS,
  TOOL_NAMES,
  CATEGORY_NAMES,
  DIFFICULTY_NAMES,
  DIFFICULTY_COLORS,
} from './exerciseRegistry';

// Types
export type {
  AITool,
  ExerciseCategory,
  ExerciseDifficulty,
  ExerciseProps,
  ExerciseResult,
  ExerciseConfig,
} from './exerciseRegistry';
