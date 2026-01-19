/**
 * @file features/admin/index.ts
 * @description Exports del módulo Admin
 */

export { AdminDashboard } from "./components/AdminDashboard";
export { ExerciseControl } from "./components/ExerciseControl";
export { useSlideGeneration } from "./hooks/useSlideGeneration";
export { useExerciseSync } from "./hooks/useExerciseSync";
export type { SessionState } from "./hooks/useExerciseSync";
export {
  mockSlides,
  mockParticipants,
  initialSessionState,
} from "./data/mockData";
