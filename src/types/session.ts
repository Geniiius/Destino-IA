/**
 * @file types/session.ts
 * @description Types pour la gestion de session temps réel
 *
 * Les noms de champs utilisent snake_case pour correspondre
 * exactement aux colonnes de la table Supabase session_state.
 *
 * Utilisé par :
 * - services/sessionState.ts (CRUD Supabase)
 * - hooks/useLiveSession.ts (pilotage admin + suivi participant)
 * - AdminDashboard.tsx (vue admin)
 * - WorkshopView.tsx (vue participant)
 */

/* eslint-disable camelcase */

// ============================================
// MODE DE SESSION
// ============================================

/**
 * Mode courant de la session :
 * - presentation : le slide PDF actif est affiché
 * - exercise : un exercice spécifique est lancé
 * - quiz : le quiz gamifié est actif
 */
export type SessionMode = 'presentation' | 'exercise' | 'quiz';

// ============================================
// ÉTAT EN TEMPS RÉEL
// ============================================

/**
 * État complet de la session synchronisé via Supabase Realtime.
 * Représente l'état exact que chaque participant doit afficher.
 */
export interface LiveSessionState {
  /** UUID de la ligne (optionnel côté client) */
  id?: string;

  /** Identifiant unique de la session (ex: "destino-ia-workshop") */
  session_id: string;

  // ── Thème / Source ──────────────────────────────

  /** Nom du thème de slides actif */
  slide_theme: string;

  /** URL vers le manifest JSON des slides */
  slide_manifest_url: string;

  // ── Navigation slides ──────────────────────────

  /** Index du slide courant (1-based, comme le manifest) */
  current_slide_index: number;

  /** Nombre total de slides */
  total_slides: number;

  // ── Mode ────────────────────────────────────────

  /** Mode actuel de la session */
  current_mode: SessionMode;

  /**
   * Slide mis en pause lors d'un switch vers exercise/quiz.
   * Permet de reprendre exactement au même endroit.
   */
  paused_slide_index: number | null;

  // ── Exercice ────────────────────────────────────

  /** ID de l'exercice actif (null si aucun) */
  active_exercise_id: string | null;

  // ── Quiz ────────────────────────────────────────

  /** true si le quiz est lancé */
  is_quiz_active: boolean;

  /** Timestamp de début du quiz */
  quiz_started_at: string | null;

  // ── Diffusion ───────────────────────────────────

  /** true si la session est en live (diffusion active) */
  is_live: boolean;

  // ── Timestamps ──────────────────────────────────

  created_at?: string;
  updated_at?: string;
}

// ============================================
// THÈME DE SLIDES
// ============================================

/**
 * Thème sélectionnable pour la présentation.
 * Chaque thème pointe vers un manifest différent.
 */
export interface SlideTheme {
  /** Identifiant unique (ex: "destino-ia-marketing") */
  id: string;

  /** Nom affiché (ex: "DESTINO+IA – Marketing") */
  name: string;

  /** URL du manifest JSON */
  manifestUrl: string;

  /** Nombre de slides (extrait du manifest) */
  slideCount?: number;

  /** Taille totale en bytes */
  totalSize?: number;
}

// ============================================
// ACTIONS ADMIN (pilotage)
// ============================================

/**
 * Actions que l'admin peut exécuter pour piloter la session.
 */
export interface LiveSessionActions {
  /** Naviguer vers un slide spécifique (1-based) */
  goToSlide: (index: number) => Promise<void>;

  /** Slide suivant */
  nextSlide: () => Promise<void>;

  /** Slide précédent */
  previousSlide: () => Promise<void>;

  /** Changer le mode de la session */
  setMode: (mode: SessionMode) => Promise<void>;

  /** Mettre en pause la présentation pour lancer un exercice */
  pauseForExercise: (exerciseId: string) => Promise<void>;

  /** Mettre en pause pour le quiz */
  pauseForQuiz: () => Promise<void>;

  /** Reprendre la présentation après un exercice/quiz */
  resumePresentation: () => Promise<void>;

  /** Changer le thème de slides */
  setTheme: (theme: SlideTheme) => Promise<void>;

  /** Activer/désactiver la diffusion live */
  toggleLive: () => Promise<void>;
}

// ============================================
// VALEUR DU HOOK
// ============================================

export interface UseLiveSessionReturn {
  /** État courant de la session */
  state: LiveSessionState;

  /** true quand l'état est chargé */
  isReady: boolean;

  /** true si connecté au canal realtime */
  isConnected: boolean;

  /** Erreur éventuelle */
  error: string | null;

  /** Actions de pilotage (admin uniquement) */
  actions: LiveSessionActions;
}

// ============================================
// CONSTANTES
// ============================================

/** Session ID par défaut */
export const DEFAULT_SESSION_ID = 'destino-ia-workshop';

/** État initial (fallback local) */
export const DEFAULT_LIVE_STATE: LiveSessionState = {
  session_id: DEFAULT_SESSION_ID,
  slide_theme: 'DESTINO+IA – Marketing',
  slide_manifest_url: '/slides/slides-manifest.json',
  current_slide_index: 1,
  total_slides: 45,
  current_mode: 'presentation',
  paused_slide_index: null,
  active_exercise_id: null,
  is_quiz_active: false,
  quiz_started_at: null,
  is_live: false,
};
