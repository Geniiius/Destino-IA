/**
 * @file useExerciseState.ts
 * @description Hook personalizado para gestionar el estado del ejercicio
 */

import { useState, useCallback } from "react";
import type { ExerciseState, ScreenType, ParticipantAnswers } from "../types";
import { TUTORIAL_STEPS } from "../constants";

const INITIAL_STATE: ExerciseState = {
  currentScreen: "intro",
  currentStep: 0,
  answers: {},
  timeSpent: 0,
  isCompleted: false,
};

export const useExerciseState = () => {
  const [state, setState] = useState<ExerciseState>(INITIAL_STATE);

  // ============================================
  // NAVEGACIÓN ENTRE PANTALLAS
  // ============================================

  const goToScreen = useCallback((screen: ScreenType) => {
    setState((prev) => ({
      ...prev,
      currentScreen: screen,
    }));
  }, []);

  const startTutorial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: "tutorial",
      currentStep: 0,
    }));
  }, []);

  const startPractice = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: "practice",
    }));
  }, []);

  // ============================================
  // NAVEGACIÓN DEL TUTORIAL
  // ============================================

  const nextStep = useCallback(() => {
    setState((prev) => {
      const newStep = prev.currentStep + 1;

      // Si llegamos al final del tutorial, ir al ejemplo
      if (newStep >= TUTORIAL_STEPS.length) {
        return {
          ...prev,
          currentScreen: "example",
        };
      }

      return {
        ...prev,
        currentStep: newStep,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const skipTutorial = useCallback(() => {
    goToScreen("example");
  }, [goToScreen]);

  // ============================================
  // GESTIÓN DE RESPUESTAS
  // ============================================

  const updateAnswer = useCallback(
    (field: keyof ParticipantAnswers, value: string) => {
      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [field]: value,
        },
      }));
    },
    [],
  );

  const clearAnswers = useCallback(() => {
    setState((prev) => ({
      ...prev,
      answers: {},
    }));
  }, []);

  // ============================================
  // RESET
  // ============================================

  const resetExercise = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // ============================================
  // FINALIZACIÓN
  // ============================================

  // Actualizar timeSpent en el estado solo al completar
  const completeExercise = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: "completed",
      isCompleted: true,
    }));
  }, []);

  // ============================================
  // HELPERS
  // ============================================

  const isAnswerComplete = useCallback(
    (answers: Partial<ParticipantAnswers>): answers is ParticipantAnswers => {
      return Boolean(
        answers.rol &&
        answers.objetivo &&
        answers.escena &&
        answers.emocion &&
        answers.estilo &&
        answers.salida,
      );
    },
    [],
  );

  const generatePrompt = useCallback((answers: ParticipantAnswers): string => {
    return `Genérame y optimízame un prompt de alto impacto con estas especificaciones:\nActúa como ${answers.rol}.\nObjetivo: ${answers.objetivo}.\nEscena/Contexto: ${answers.escena} que transmite ${answers.emocion}.\nEstilo visual: ${answers.estilo}.\nFormato de salida: ${answers.salida}.`;
  }, []);

  return {
    // Estado
    state,

    // Navegación
    goToScreen,
    startTutorial,
    startPractice,
    nextStep,
    prevStep,
    skipTutorial,

    // Respuestas
    updateAnswer,
    clearAnswers,

    // Finalización
    completeExercise,
    resetExercise,

    // Helpers
    isAnswerComplete,
    generatePrompt,
  };
};
