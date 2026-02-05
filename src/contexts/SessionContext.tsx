/**
 * @file contexts/SessionContext.tsx
 * @description Context de React para el estado global de sesión
 *
 * CARACTERÍSTICAS:
 * - Estado centralizado con useReducer
 * - Acciones tipadas y memoizadas
 * - Logging de acciones en desarrollo
 * - Verificación de contexto en useSession
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

// ============================================
// TYPES
// ============================================

export interface Participant {
  id: string;
  name: string;
  email?: string;
  status: 'online' | 'offline' | 'away';
  joinedAt: Date;
  lastSeenAt: Date;
}

export interface Slide {
  id: string;
  type: 'intro' | 'theory' | 'exercise' | 'challenge';
  title: string;
  content?: string;
  imageUrl?: string;
  order_index?: number;
}

export interface SessionState {
  // Identidad
  sessionId: string;
  sessionName: string;
  isAdmin: boolean;
  currentUserId: string | null;

  // Presentación
  slides: Slide[];
  currentSlideIndex: number;

  // Participantes
  participants: Participant[];

  // UI
  isSidebarOpen: boolean;
  activeTab: 'slides' | 'exercises' | 'quiz' | 'challenge';
}

export interface SessionActions {
  // Sesión
  initSession: (sessionId: string, isAdmin: boolean, userId?: string) => void;
  resetSession: () => void;
  setSessionName: (name: string) => void;

  // Navegación
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;

  // Participantes
  addParticipant: (participant: Participant) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  removeParticipant: (id: string) => void;
  setParticipants: (participants: Participant[]) => void;

  // Slides
  setSlides: (slides: Slide[]) => void;

  // UI
  toggleSidebar: () => void;
  setActiveTab: (tab: SessionState['activeTab']) => void;
}

export type SessionContextValue = SessionState & SessionActions;

// ============================================
// ACTIONS
// ============================================

type SessionAction =
  | { type: 'INIT_SESSION'; payload: { sessionId: string; isAdmin: boolean; userId?: string } }
  | { type: 'RESET_SESSION' }
  | { type: 'SET_SESSION_NAME'; payload: string }
  | { type: 'GO_TO_SLIDE'; payload: number }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREVIOUS_SLIDE' }
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'UPDATE_PARTICIPANT'; payload: { id: string; updates: Partial<Participant> } }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'SET_PARTICIPANTS'; payload: Participant[] }
  | { type: 'SET_SLIDES'; payload: Slide[] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_TAB'; payload: SessionState['activeTab'] };

// ============================================
// INITIAL STATE
// ============================================

const initialState: SessionState = {
  // Identidad
  sessionId: '',
  sessionName: '',
  isAdmin: false,
  currentUserId: null,

  // Presentación
  slides: [],
  currentSlideIndex: 0,

  // Participantes
  participants: [],

  // UI
  isSidebarOpen: true,
  activeTab: 'slides',
};

// ============================================
// REDUCER
// ============================================

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  // Logging en desarrollo
  if (import.meta.env.DEV) {
    console.log('[SessionContext]', action.type, 'payload' in action ? action.payload : '');
  }

  switch (action.type) {
    // === SESIÓN ===
    case 'INIT_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        isAdmin: action.payload.isAdmin,
        currentUserId: action.payload.userId ?? null,
      };

    case 'RESET_SESSION':
      return { ...initialState };

    case 'SET_SESSION_NAME':
      return {
        ...state,
        sessionName: action.payload,
      };

    // === NAVEGACIÓN ===
    case 'GO_TO_SLIDE':
      return {
        ...state,
        currentSlideIndex: Math.max(0, Math.min(action.payload, state.slides.length - 1)),
      };

    case 'NEXT_SLIDE':
      return {
        ...state,
        currentSlideIndex: Math.min(state.currentSlideIndex + 1, state.slides.length - 1),
      };

    case 'PREVIOUS_SLIDE':
      return {
        ...state,
        currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
      };

    // === PARTICIPANTES ===
    case 'ADD_PARTICIPANT':
      // Evitar duplicados
      if (state.participants.some((p) => p.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };

    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
      };

    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload,
      };

    // === SLIDES ===
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.payload,
        // Reset al primer slide si el índice actual es inválido
        currentSlideIndex:
          state.currentSlideIndex >= action.payload.length ? 0 : state.currentSlideIndex,
      };

    // === UI ===
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };

    default:
      // TypeScript exhaustiveness check
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

// ============================================
// CONTEXT
// ============================================

const SessionContext = createContext<SessionContextValue | null>(null);

// Nombre para React DevTools
SessionContext.displayName = 'SessionContext';

// ============================================
// PROVIDER
// ============================================

interface SessionProviderProps {
  children: ReactNode;
  /** Estado inicial personalizado (útil para tests) */
  initialState?: Partial<SessionState>;
}

export function SessionProvider({ children, initialState: customInitial }: SessionProviderProps) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    customInitial ? { ...initialState, ...customInitial } : initialState
  );

  // === ACCIONES MEMOIZADAS ===

  // Sesión
  const initSession = useCallback(
    (sessionId: string, isAdmin: boolean, userId?: string) => {
      dispatch({ type: 'INIT_SESSION', payload: { sessionId, isAdmin, userId } });
    },
    []
  );

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
  }, []);

  const setSessionName = useCallback((name: string) => {
    dispatch({ type: 'SET_SESSION_NAME', payload: name });
  }, []);

  // Navegación
  const goToSlide = useCallback((index: number) => {
    dispatch({ type: 'GO_TO_SLIDE', payload: index });
  }, []);

  const nextSlide = useCallback(() => {
    dispatch({ type: 'NEXT_SLIDE' });
  }, []);

  const previousSlide = useCallback(() => {
    dispatch({ type: 'PREVIOUS_SLIDE' });
  }, []);

  // Participantes
  const addParticipant = useCallback((participant: Participant) => {
    dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
  }, []);

  const updateParticipant = useCallback((id: string, updates: Partial<Participant>) => {
    dispatch({ type: 'UPDATE_PARTICIPANT', payload: { id, updates } });
  }, []);

  const removeParticipant = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_PARTICIPANT', payload: id });
  }, []);

  const setParticipants = useCallback((participants: Participant[]) => {
    dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
  }, []);

  // Slides
  const setSlides = useCallback((slides: Slide[]) => {
    dispatch({ type: 'SET_SLIDES', payload: slides });
  }, []);

  // UI
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setActiveTab = useCallback((tab: SessionState['activeTab']) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  // === VALOR DEL CONTEXT ===
  const value = useMemo<SessionContextValue>(
    () => ({
      // Estado
      ...state,
      // Acciones
      initSession,
      resetSession,
      setSessionName,
      goToSlide,
      nextSlide,
      previousSlide,
      addParticipant,
      updateParticipant,
      removeParticipant,
      setParticipants,
      setSlides,
      toggleSidebar,
      setActiveTab,
    }),
    [
      state,
      initSession,
      resetSession,
      setSessionName,
      goToSlide,
      nextSlide,
      previousSlide,
      addParticipant,
      updateParticipant,
      removeParticipant,
      setParticipants,
      setSlides,
      toggleSidebar,
      setActiveTab,
    ]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// ============================================
// HOOK
// ============================================

/**
 * Hook para acceder al contexto de sesión
 *
 * @throws Error si se usa fuera de SessionProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { sessionId, isAdmin, goToSlide } = useSession();
 *
 *   return (
 *     <div>
 *       <p>Session: {sessionId}</p>
 *       <button onClick={() => goToSlide(0)}>Ir al inicio</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (context === null) {
    throw new Error(
      'useSession debe usarse dentro de un <SessionProvider>. ' +
        'Asegúrate de envolver tu aplicación con <SessionProvider>.'
    );
  }

  return context;
}

// ============================================
// HOOKS SELECTORES (optimización de re-renders)
// ============================================

/**
 * Hook para obtener solo el estado de navegación
 */
export function useSlideNavigation() {
  const { slides, currentSlideIndex, goToSlide, nextSlide, previousSlide } = useSession();

  return {
    slides,
    currentSlideIndex,
    currentSlide: slides[currentSlideIndex] ?? null,
    totalSlides: slides.length,
    canGoNext: currentSlideIndex < slides.length - 1,
    canGoPrevious: currentSlideIndex > 0,
    goToSlide,
    nextSlide,
    previousSlide,
  };
}

/**
 * Hook para obtener solo el estado de participantes
 */
export function useParticipantsState() {
  const {
    participants,
    addParticipant,
    updateParticipant,
    removeParticipant,
    setParticipants,
  } = useSession();

  return {
    participants,
    onlineParticipants: participants.filter((p) => p.status === 'online'),
    offlineParticipants: participants.filter((p) => p.status !== 'online'),
    participantCount: participants.length,
    onlineCount: participants.filter((p) => p.status === 'online').length,
    addParticipant,
    updateParticipant,
    removeParticipant,
    setParticipants,
  };
}

/**
 * Hook para obtener solo el estado de UI
 */
export function useSessionUI() {
  const { isSidebarOpen, activeTab, toggleSidebar, setActiveTab } = useSession();

  return {
    isSidebarOpen,
    activeTab,
    toggleSidebar,
    setActiveTab,
  };
}
