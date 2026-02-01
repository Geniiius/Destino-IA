/**
 * @file AgenciaViajesExercise.tsx
 * @description Componente principal del ejercicio Agencia de Viajes
 *
 * Gestiona el flujo completo del ejercicio:
 * - Intro → Tutorial → Example → Practice → Completed
 */

import React from "react";
import type { AgenciaViajesExerciseProps } from "./types";
import { useExerciseState } from "./hooks/useExerciseState";
import { TUTORIAL_STEPS } from "./constants";

// Importaciones de pantallas
import { IntroScreen } from "./screens/IntroScreen";
import { TutorialScreen } from "./screens/TutorialScreen";
import { ExampleScreen } from "./screens/ExampleScreen";
import { PracticeScreen } from "./screens/PracticeScreen";

export const AgenciaViajesExercise: React.FC<AgenciaViajesExerciseProps> = ({
  participantId,
  participantName,
  sessionId,
  onComplete,
  onExit,
}) => {
  const {
    state,
    startTutorial,
    startPractice,
    nextStep,
    prevStep,
    skipTutorial,
    updateAnswer,
    completeExercise,
    isAnswerComplete,
    generatePrompt,
  } = useExerciseState();

  // ============================================
  // HANDLERS
  // ============================================

  const handleStartTutorial = () => {
    startTutorial();
  };

  const handleStartPractice = () => {
    startPractice();
  };

  const handleSubmit = () => {
    if (isAnswerComplete(state.answers)) {
      const prompt = generatePrompt(state.answers);
      completeExercise();

      // Callback para enviar datos al padre
      if (onComplete) {
        onComplete(state.answers, 0);
      }

      console.log("✅ Ejercicio completado");
      console.log("📝 Prompt generado:", prompt);
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
  };

  // ============================================
  // RENDERIZADO POR PANTALLA
  // ============================================

  const renderScreen = () => {
    switch (state.currentScreen) {
      case "intro":
        return (
          <IntroScreen
            onStartTutorial={handleStartTutorial}
            onStartPractice={handleStartPractice}
          />
        );

      case "tutorial":
        return (
          <TutorialScreen
            currentStep={state.currentStep}
            totalSteps={TUTORIAL_STEPS.length}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={skipTutorial}
          />
        );

      case "example":
        return <ExampleScreen onContinue={handleStartPractice} />;

      case "practice":
        return (
          <PracticeScreen
            answers={state.answers}
            onAnswerChange={updateAnswer}
            onSubmit={handleSubmit}
            onExit={handleExit}
          />
        );

      case "completed":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>

              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                ¡Ejercicio Completado!
              </h1>

              <p className="text-2xl text-gray-300 mb-8">
                Has creado tu primer prompt estructurado
              </p>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
                <p className="text-emerald-400 font-bold mb-2">
                  ⏱️ Tiempo total
                </p>
                <p className="text-4xl font-bold text-white">
                  {Math.floor(state.timeSpent / 60)}:
                  {(state.timeSpent % 60).toString().padStart(2, "0")}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wide">
                  Tu Prompt Final:
                </p>
                <p className="text-gray-200 leading-relaxed">
                  {isAnswerComplete(state.answers) &&
                    generatePrompt(state.answers)}
                </p>
              </div>

              <button
                onClick={handleExit}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                Continuar
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050508] overflow-auto">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        {renderScreen()}
      </div>
    </div>
  );
};
