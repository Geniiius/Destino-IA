/**
 * @file TutorialScreen.tsx
 * @description Tutorial paso a paso del ejercicio
 */

import React from 'react';
import { ChevronLeft, ChevronRight, X, Lightbulb } from 'lucide-react';
import type { TutorialScreenProps } from '../types';
import { TUTORIAL_STEPS, UI_TEXTS, COLOR_STYLES } from '../constants';

export const TutorialScreen: React.FC<TutorialScreenProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}) => {
  const step = TUTORIAL_STEPS[currentStep];
  const colorStyle = COLOR_STYLES[step.color];
  const { tutorial } = UI_TEXTS;

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto">
      
      {/* Header con progreso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{tutorial.title}</h2>
            <p className="text-gray-400">{tutorial.subtitle}</p>
          </div>
          
          <button
            onClick={onSkip}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
            <span className="text-sm">{tutorial.skipButton}</span>
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorStyle.bg.replace('/20', '')} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <span className={`text-sm font-medium ${colorStyle.text}`}>
            {Math.round(progress)}% completado
          </span>
        </div>
      </div>

      {/* Card principal del paso */}
      <div className={`bg-white/5 backdrop-blur-xl border ${colorStyle.border} rounded-3xl p-12 shadow-2xl transition-all`}>
        
        {/* Badge del número */}
        <div className={`inline-flex items-center justify-center w-16 h-16 ${colorStyle.bg} border ${colorStyle.border} rounded-2xl mb-6 ${colorStyle.glow}`}>
          <span className={`text-3xl font-bold ${colorStyle.text}`}>
            {step.num}
          </span>
        </div>

        {/* Título del paso */}
        <div className="mb-8">
          <div className={`inline-block px-4 py-1 ${colorStyle.bg} border ${colorStyle.border} rounded-full mb-4`}>
            <span className={`text-sm font-bold ${colorStyle.text} uppercase tracking-wide`}>
              {step.subtitle}
            </span>
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-4">
            {step.title}
          </h3>
          
          {step.description && (
            <p className="text-lg text-gray-300 leading-relaxed">
              {step.description}
            </p>
          )}
        </div>

        {/* Ejemplos */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className={`w-5 h-5 ${colorStyle.text}`} />
            <span className={`text-sm font-semibold ${colorStyle.text} uppercase tracking-wide`}>
              Ejemplos:
            </span>
          </div>
          
          {step.examples.map((example, index) => (
            <div
              key={index}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:scale-[1.02] hover:border-white/20"
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 ${colorStyle.bg} border ${colorStyle.border} rounded-lg flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${colorStyle.text}`}>
                    {index + 1}
                  </span>
                </div>
                <p className="text-white text-base leading-relaxed pt-1">
                  "{example}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tip adicional */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-amber-400 mb-1">
                Consejo Pro:
              </p>
              <p className="text-sm text-gray-300">
                {step.num === 1 && "Sé específico con tu rol. Cuanto más detallado, mejor será el resultado."}
                {step.num === 2 && "Define un objetivo claro y medible. Evita generalidades."}
                {step.num === 3 && "Los detalles sensoriales hacen que la escena cobre vida."}
                {step.num === 4 && "Menciona referencias conocidas (marcas, artistas, estilos)."}
                {step.num === 5 && "Especifica longitud, formato y canal de distribución."}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{tutorial.prevButton}</span>
          </button>

          <div className="flex gap-2">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? `w-8 ${colorStyle.bg.replace('/20', '')}`
                    : index < currentStep
                      ? 'w-2 bg-emerald-500/50'
                      : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl text-white font-bold transition-all hover:scale-105 ${colorStyle.glow}`}
          >
            <span>
              {currentStep === totalSteps - 1 ? tutorial.exampleButton : tutorial.nextButton}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Presiona <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd> para continuar
        </p>
      </div>
    </div>
  );
};
