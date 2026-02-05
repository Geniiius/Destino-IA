/**
 * @file ExerciseFallback.tsx
 * @description Componente de carga para ejercicios lazy-loaded
 *
 * Design System Destino IA:
 * - Glassmorphism (bg-zinc-900/50 backdrop-blur-xl)
 * - Accent emerald
 * - Animaciones suaves
 */

import { memo } from 'react';

// ============================================
// TYPES
// ============================================

interface ExerciseFallbackProps {
  /** Nombre del ejercicio (si disponible) */
  exerciseName?: string;
  /** Mensaje personalizado */
  message?: string;
}

// ============================================
// COMPONENT
// ============================================

/**
 * Fallback mostrado mientras se carga un ejercicio
 */
export const ExerciseFallback = memo(function ExerciseFallback({
  exerciseName,
  message = 'Cargando ejercicio...',
}: ExerciseFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full animate-fade-in">
      <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6">
          {/* Spinner */}
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 rounded-full border-4 border-zinc-700/50" />

            {/* Spinning arc */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />

            {/* Inner pulse */}
            <div className="absolute inset-3 rounded-full bg-emerald-500/20 animate-pulse" />
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            {exerciseName && (
              <h3 className="text-lg font-semibold text-white">{exerciseName}</h3>
            )}
            <p className="text-zinc-400 text-sm">{message}</p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================
// COMPACT VARIANT
// ============================================

/**
 * Versión compacta del fallback para espacios reducidos
 */
export const ExerciseFallbackCompact = memo(function ExerciseFallbackCompact() {
  return (
    <div className="flex items-center justify-center gap-3 p-4">
      <div className="w-5 h-5 rounded-full border-2 border-zinc-600 border-t-emerald-500 animate-spin" />
      <span className="text-zinc-400 text-sm">Cargando...</span>
    </div>
  );
});

// ============================================
// STYLES (para tailwind.config.js si no existen)
// ============================================

// Agregar en tailwind.config.js si no existe:
// animation: {
//   'fade-in': 'fadeIn 0.3s ease-out',
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0', transform: 'translateY(10px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// },
