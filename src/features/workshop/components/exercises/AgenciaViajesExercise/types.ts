/**
 * @file types.ts
 * @description Tipos TypeScript para el ejercicio Agencia de Viajes
 */

// ============================================
// TIPOS DE PANTALLAS
// ============================================

export type ScreenType =
  | "intro"
  | "tutorial"
  | "example"
  | "practice"
  | "completed";

// ============================================
// COLORES POR ELEMENTO
// ============================================

export type ElementColor = "blue" | "emerald" | "amber" | "purple" | "pink";

// ============================================
// ESTRUCTURA DE TUTORIAL
// ============================================

export interface TutorialStep {
  num: number;
  title: string;
  subtitle: string;
  color: ElementColor;
  examples: string[];
  description?: string;
}

// ============================================
// RESPUESTAS DEL PARTICIPANTE
// ============================================

export interface ParticipantAnswers {
  rol: string;
  objetivo: string;
  escena: string;
  emocion: string;
  estilo: string;
  salida: string;
}

// ============================================
// EJEMPLO COMPLETO
// ============================================

export interface ExamplePrompt {
  rol: string;
  objetivo: string;
  escena: string;
  emocion: string;
  estilo: string;
  salida: string;
  prompt: string;
  description?: string;
}

// ============================================
// ESTADO DEL EJERCICIO
// ============================================

export interface ExerciseState {
  currentScreen: ScreenType;
  currentStep: number;
  answers: Partial<ParticipantAnswers>;
  timeSpent: number;
  isCompleted: boolean;
}

// ============================================
// PROPS DE COMPONENTES
// ============================================

export interface AgenciaViajesExerciseProps {
  participantId: string;
  participantName: string;
  sessionId: string;
  onComplete?: (answers: ParticipantAnswers, timeSpent: number) => void;
  onExit?: () => void;
}

export interface IntroScreenProps {
  onStartTutorial: () => void;
  onStartPractice: () => void;
}

export interface TutorialScreenProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export interface ExampleScreenProps {
  onContinue: () => void;
}

export interface PracticeScreenProps {
  answers: Partial<ParticipantAnswers>;
  onAnswerChange: (field: keyof ParticipantAnswers, value: string) => void;
  onSubmit: () => void;
  onExit: () => void;
}
