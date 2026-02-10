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
  participantId: _participantId,
  participantName: _participantName,
  sessionId: _sessionId,
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
    console.log("🔍 handleSubmit called");
    console.log("📋 Current answers:", state.answers);
    console.log("✅ Is complete?", isAnswerComplete(state.answers));

    if (isAnswerComplete(state.answers)) {
      const prompt = generatePrompt(state.answers);
      completeExercise();

      // Callback para enviar datos al padre
      if (onComplete) {
        onComplete(state.answers, 0);
      }

      console.log("✅ Ejercicio completado");
      console.log("📝 Prompt generado:", prompt);
    } else {
      console.warn("⚠️ Formulario incompleto");
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

              <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wide">
                  Tu Prompt Final:
                </p>
                <p className="text-gray-200 leading-relaxed">
                  {isAnswerComplete(state.answers) &&
                    generatePrompt(state.answers)}
                </p>
              </div>

              {/* Instrucciones para usar el prompt */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 text-left">
                <p className="text-blue-400 font-bold mb-4 flex items-center gap-2 text-lg">
                  <span className="text-2xl">💡</span> ¿Qué hacer ahora?
                </p>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Ya has generado la idea de tu prompt.
                  </p>
                  <p className="leading-relaxed">
                    Ahora puedes ir a{" "}
                    <span className="text-emerald-400 font-semibold">
                      ChatGPT
                    </span>{" "}
                    y decirle:
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white font-medium italic">
                      "Genérame un prompt para crear esto:"
                    </p>
                  </div>
                  <p className="leading-relaxed">
                    (pega tu prompt de arriba y envíalo)
                  </p>
                  <div className="mt-6 pt-6 border-t border-blue-500/20">
                    <p className="leading-relaxed mb-3">
                      Una vez que ChatGPT te haya generado el prompt final,
                      puedes ir a la herramienta de generación de imágenes y
                      decir:
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3">
                      <p className="text-white font-medium italic">
                        "Créame una imagen"
                      </p>
                    </div>
                    <p className="leading-relaxed">
                      y luego pegar el prompt que ChatGPT generó.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto"
      style={{
        background:
          "linear-gradient(145deg, #1a0533 0%, #2d1b4e 25%, #4a2c6a 45%, #6b3a7d 60%, #a0527a 75%, #d4886a 90%, #f0b86a 100%)",
      }}
    >
      {/* Background Ambience — soft light blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-400/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-pink-400/5 rounded-full blur-[120px]" />
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-8">
        {renderScreen()}
      </div>
    </div>
  );
};
