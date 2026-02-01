/**
 * @file ExampleScreen.tsx
 * @description Pantalla que muestra el ejemplo completo de Bali
 */

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import type { ExampleScreenProps } from '../types';
import { BALI_EXAMPLE, UI_TEXTS, COLOR_STYLES } from '../constants';

export const ExampleScreen: React.FC<ExampleScreenProps> = ({ onContinue }) => {
  const { example } = UI_TEXTS;

  const elements = [
    { key: 'rol', label: 'ROL', icon: '👤', color: 'blue', value: BALI_EXAMPLE.rol },
    { key: 'objetivo', label: 'OBJETIVO', icon: '🎯', color: 'emerald', value: BALI_EXAMPLE.objetivo },
    { key: 'escena', label: 'ESCENA', icon: '🌅', color: 'amber', value: BALI_EXAMPLE.escena },
    { key: 'emocion', label: 'EMOCIÓN', icon: '💫', color: 'amber', value: BALI_EXAMPLE.emocion },
    { key: 'estilo', label: 'ESTILO', icon: '🎨', color: 'purple', value: BALI_EXAMPLE.estilo },
    { key: 'salida', label: 'SALIDA', icon: '📝', color: 'pink', value: BALI_EXAMPLE.salida },
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <span className="text-5xl">✨</span>
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4">
          {example.title}
        </h1>
        
        <p className="text-xl text-gray-300 mb-2">
          {example.subtitle}
        </p>
        
        {BALI_EXAMPLE.description && (
          <p className="text-base text-emerald-400 font-medium">
            {BALI_EXAMPLE.description}
          </p>
        )}
      </div>

      {/* Grid de elementos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {elements.map((element) => {
          const colorStyle = COLOR_STYLES[element.color];
          
          return (
            <div
              key={element.key}
              className={`bg-white/5 backdrop-blur-xl border ${colorStyle.border} rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-[1.02] group`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 ${colorStyle.bg} border ${colorStyle.border} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {element.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 ${colorStyle.bg} border ${colorStyle.border} rounded-full mb-2`}>
                    <span className={`text-xs font-bold ${colorStyle.text} uppercase tracking-wide`}>
                      {element.label}
                    </span>
                  </div>
                  
                  <p className="text-white text-base leading-relaxed">
                    {element.value}
                  </p>
                </div>

                {/* Check icon */}
                <CheckCircle className={`flex-shrink-0 w-5 h-5 ${colorStyle.text} opacity-50`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Prompt final generado */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-wide">
            {example.promptLabel}
          </h3>
        </div>
        
        <div className="bg-black/30 rounded-xl p-6 border border-white/10">
          <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-mono">
            {BALI_EXAMPLE.prompt}
          </p>
        </div>

        {/* Info adicional */}
        <div className="mt-6 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-sm font-semibold text-blue-400 mb-1">
              ¿Por qué funciona este prompt?
            </p>
            <p className="text-sm text-gray-300">
              Combina los 5 elementos de forma específica y detallada. La IA recibe toda la información necesaria para generar un contenido preciso y profesional.
            </p>
          </div>
        </div>
      </div>

      {/* Botón de continuar */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onContinue}
          className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
        >
          <span>{example.continueButton}</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-sm text-gray-500">
          💪 Ahora es tu turno de crear uno propio
        </p>
      </div>

      {/* Decoración */}
      <div className="mt-12 flex items-center justify-center gap-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-emerald-500/30 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};
