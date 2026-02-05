/**
 * @file contexts/index.ts
 * @description Barrel export para contexts
 */

// Session Context
export {
  SessionProvider,
  useSession,
  useSlideNavigation,
  useParticipantsState,
  useSessionUI,
} from './SessionContext';

export type {
  Participant,
  Slide,
  SessionState,
  SessionActions,
  SessionContextValue,
} from './SessionContext';
