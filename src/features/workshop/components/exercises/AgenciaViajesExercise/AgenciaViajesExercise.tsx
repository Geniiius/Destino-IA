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
import { useCopyToClipboard } from "../../../../../hooks";

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

  const { copied, copy } = useCopyToClipboard();

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

      case "completed": {
        const promptText = isAnswerComplete(state.answers) ? generatePrompt(state.answers) : "";
        return (
          <div className="w-full max-w-4xl mx-auto lg:h-[calc(100vh-4rem)] lg:flex lg:items-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-8 shadow-2xl w-full lg:overflow-hidden">
              {/* Header */}
              <div className="text-center mb-4 lg:mb-3">
                <div className="text-4xl lg:text-3xl mb-2 lg:mb-1">🎉</div>
                <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-1 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  ¡Ejercicio Completado!
                </h1>
                <p className="text-sm lg:text-xs text-gray-400">
                  Tu prompt está listo. Solo falta copiarlo y pegarlo.
                </p>
              </div>

              {/* Prompt Block */}
              <div className="bg-black/30 rounded-2xl border border-emerald-500/30 mb-4 lg:mb-3 overflow-hidden">
                <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between">
                  <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Tu Prompt Completo</span>
                  <span className="text-emerald-400/60 text-[10px]">Listo para copiar</span>
                </div>
                <div className="p-4 lg:p-3 lg:max-h-[18vh] lg:overflow-y-auto">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm lg:text-[13px]">{promptText}</p>
                </div>
              </div>

              {/* CTA Copy Button */}
              {promptText && (
                <button
                  onClick={() => copy(promptText)}
                  className={`w-full py-3 lg:py-2.5 rounded-xl font-bold text-base lg:text-sm flex items-center justify-center gap-3 transition-all duration-300 mb-4 lg:mb-3 ${
                    copied
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {copied ? "✅  ¡Copiado al portapapeles!" : "📋  Copiar Prompt Completo"}
                </button>
              )}

              {/* Steps Guide */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4 lg:p-3">
                <p className="text-white font-bold mb-3 lg:mb-2 text-center text-base lg:text-sm">📌 Sigue estos 3 pasos:</p>
                <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
                  <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 lg:text-center">
                    <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-emerald-500/40">1</div>
                    <div className="pt-0.5 lg:pt-0">
                      <p className="text-emerald-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">📋 Copia tu prompt</p>
                      <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Haz clic en el botón de arriba. Se copia <span className="text-emerald-300 font-medium">todo el bloque</span>, incluyendo la instrucción para ChatGPT.</p>
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 lg:text-center">
                    <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-blue-500/40">2</div>
                    <div className="pt-0.5 lg:pt-0">
                      <p className="text-blue-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🤖 Pégalo en ChatGPT</p>
                      <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Abre <span className="text-blue-300 font-medium">ChatGPT</span>, pega y envía. Te generará un <span className="text-blue-300 font-medium">prompt profesional</span>.</p>
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 lg:text-center">
                    <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-orange-500/40">3</div>
                    <div className="pt-0.5 lg:pt-0">
                      <p className="text-orange-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🎨 Genera tu imagen</p>
                      <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Escribe: <span className="text-orange-300 font-semibold">"Créame esta imagen:"</span> y pega el prompt de ChatGPT.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <div className="mt-4 lg:mt-2 flex justify-center">
                <button
                  onClick={() => startPractice()}
                  className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-gray-400 hover:text-white text-xs"
                >
                  ← Volver a editar
                </button>
              </div>
            </div>
          </div>
        );
      }

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
