/**
 * @file features/admin/index.ts
 * @description Exports del módulo Admin
 */

export { AdminDashboard } from "./components/AdminDashboard";
export { AdminAuth } from "./components/AdminAuth";
export { useSlideGeneration } from "./hooks/useSlideGeneration";
export {
  mockSlides,
  mockParticipants,
  initialSessionState,
} from "./data/mockData";
