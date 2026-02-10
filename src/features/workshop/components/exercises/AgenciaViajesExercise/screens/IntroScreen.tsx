/**
 * @file IntroScreen.tsx
 * @description Pantalla de introducción del ejercicio Agencia de Viajes
 */

import React from 'react';
import { Play, BookOpen, Sparkles } from 'lucide-react';
import type { IntroScreenProps } from '../types';
import { UI_TEXTS } from '../constants';

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartTutorial,
  onStartPractice,
}) => {
  const { intro } = UI_TEXTS;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Card principal */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl mb-6 animate-pulse">
            <span className="text-5xl">🌴</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            {intro.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-4">
            {intro.subtitle}
          </p>
          
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            {intro.description}
          </p>
        </div>

        {/* Los 5 elementos */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {intro.elementsList.map((element, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all hover:scale-105 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {element.icon}
              </div>
              <div className="text-sm font-bold text-white mb-2">
                {element.label}
              </div>
              <div className="text-xs text-gray-400">
                {element.description}
              </div>
            </div>
          ))}
        </div>

        {/* Divider decorativo */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#050508] px-4 text-gray-500 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Elige cómo empezar
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* Botón Tutorial */}
          <button
            onClick={onStartTutorial}
            className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-xl text-blue-400 font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>{intro.tutorialButton}</span>
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-xl transition-colors"></div>
          </button>

          {/* Botón Practicar */}
          <button
            onClick={onStartPractice}
            className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <span>{intro.practiceButton}</span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-colors"></div>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-amber-300/90 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 inline-flex items-center gap-2">
            💡 <span className="font-semibold text-amber-200">Consejo:</span> Si es tu primera vez, te recomendamos empezar con el tutorial
          </p>
        </div>

      </div>

      {/* Decoración adicional */}
      <div className="mt-8 flex items-center justify-center gap-2 text-gray-600 text-sm">
        <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-pulse"></div>
        <span>Tiempo estimado: 10-15 minutos</span>
      </div>
    </div>
  );
};
