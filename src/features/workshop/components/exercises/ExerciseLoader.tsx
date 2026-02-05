/**
 * @file ExerciseLoader.tsx
 * @description Componente de carga dinámica de ejercicios con ErrorBoundary
 *
 * CARACTERÍSTICAS:
 * - Carga lazy de ejercicios desde el registry
 * - ErrorBoundary integrado para errores de carga
 * - Muestra herramientas requeridas (badges)
 * - Sugerencias de ejercicios similares si no se encuentra
 */

import {
  Suspense,
  Component,
  type ReactNode,
  type ErrorInfo,
  memo,
} from 'react';
import { ExerciseFallback } from './ExerciseFallback';
import {
  getExercise,
  getSimilarExercises,
  TOOL_COLORS,
  TOOL_NAMES,
  DIFFICULTY_COLORS,
  DIFFICULTY_NAMES,
  type ExerciseConfig,
  type ExerciseResult,
  type AITool,
} from './exerciseRegistry';

// ============================================
// TYPES
// ============================================

export interface ExerciseLoaderProps {
  /** ID del ejercicio a cargar */
  exerciseId: string;
  /** Callback cuando el ejercicio se completa */
  onComplete?: (result: ExerciseResult) => void;
  /** Callback para reportar progreso */
  onProgress?: (progress: number) => void;
  /** Callback en caso de error */
  onError?: (error: Error) => void;
  /** Mostrar header con info del ejercicio */
  showHeader?: boolean;
}

// ============================================
// ERROR BOUNDARY
// ============================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  exerciseId: string;
  onError?: (error: Error) => void;
  fallback?: ReactNode;
}

class ExerciseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ExerciseLoader] Error loading exercise:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ExerciseLoadError
            exerciseId={this.props.exerciseId}
            error={this.state.error}
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
        )
      );
    }

    return this.props.children;
  }
}

// ============================================
// ERROR COMPONENT
// ============================================

interface ExerciseLoadErrorProps {
  exerciseId: string;
  error: Error | null;
  onRetry?: () => void;
}

const ExerciseLoadError = memo(function ExerciseLoadError({
  exerciseId,
  error,
  onRetry,
}: ExerciseLoadErrorProps) {
  const similarExercises = getSimilarExercises(exerciseId, 3);

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-lg w-full mx-4">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Error al cargar el ejercicio
          </h3>
          <p className="text-zinc-400 text-sm mb-2">
            No se pudo cargar el ejercicio <code className="text-red-400">{exerciseId}</code>
          </p>
          {error && (
            <p className="text-zinc-500 text-xs font-mono bg-zinc-800/50 rounded px-2 py-1 inline-block">
              {error.message}
            </p>
          )}
        </div>

        {/* Retry Button */}
        {onRetry && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Similar Exercises */}
        {similarExercises.length > 0 && (
          <div className="border-t border-zinc-700/50 pt-6">
            <p className="text-zinc-400 text-sm mb-3">Ejercicios similares:</p>
            <div className="space-y-2">
              {similarExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{ex.name}</p>
                    <p className="text-zinc-500 text-xs">{ex.description}</p>
                  </div>
                  <div className="flex gap-1">
                    {ex.tools.slice(0, 2).map((tool) => (
                      <ToolBadge key={tool} tool={tool} size="sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================
// NOT FOUND COMPONENT
// ============================================

interface ExerciseNotFoundProps {
  exerciseId: string;
}

const ExerciseNotFound = memo(function ExerciseNotFound({
  exerciseId,
}: ExerciseNotFoundProps) {
  const similarExercises = getSimilarExercises(exerciseId, 3);

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8 max-w-lg w-full mx-4">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Ejercicio no encontrado
          </h3>
          <p className="text-zinc-400 text-sm">
            El ejercicio <code className="text-yellow-400">{exerciseId}</code> no existe en
            el registro.
          </p>
        </div>

        {/* Similar Exercises */}
        {similarExercises.length > 0 && (
          <div className="border-t border-zinc-700/50 pt-6">
            <p className="text-zinc-400 text-sm mb-3">
              Quizás buscabas uno de estos:
            </p>
            <div className="space-y-2">
              {similarExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{ex.name}</p>
                    <p className="text-zinc-500 text-xs">{ex.description}</p>
                  </div>
                  <div className="flex gap-1">
                    {ex.tools.slice(0, 2).map((tool) => (
                      <ToolBadge key={tool} tool={tool} size="sm" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================
// TOOL BADGE
// ============================================

interface ToolBadgeProps {
  tool: AITool;
  size?: 'sm' | 'md';
}

const ToolBadge = memo(function ToolBadge({ tool, size = 'md' }: ToolBadgeProps) {
  const colors = TOOL_COLORS[tool];
  const name = TOOL_NAMES[tool];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`${colors.bg} ${colors.text} border ${colors.border} rounded-full font-medium ${sizeClasses}`}
    >
      {name}
    </span>
  );
});

// ============================================
// EXERCISE HEADER
// ============================================

interface ExerciseHeaderProps {
  config: ExerciseConfig;
}

const ExerciseHeader = memo(function ExerciseHeader({ config }: ExerciseHeaderProps) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-700/50 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1">{config.name}</h2>
          <p className="text-zinc-400 text-sm mb-3">{config.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-500">
              ⏱️ {config.duration} min
            </span>
            <span className={DIFFICULTY_COLORS[config.difficulty]}>
              {DIFFICULTY_NAMES[config.difficulty]}
            </span>
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 justify-end">
          {config.tools.map((tool) => (
            <ToolBadge key={tool} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
});

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Carga dinámicamente un ejercicio por su ID
 *
 * @example
 * ```tsx
 * <ExerciseLoader
 *   exerciseId="agencia-viajes"
 *   onComplete={(result) => console.log('Completado!', result)}
 *   showHeader
 * />
 * ```
 */
export const ExerciseLoader = memo(function ExerciseLoader({
  exerciseId,
  onComplete,
  onProgress,
  onError,
  showHeader = false,
}: ExerciseLoaderProps) {
  // Obtener configuración del ejercicio
  const config = getExercise(exerciseId);

  // Ejercicio no encontrado
  if (!config) {
    return <ExerciseNotFound exerciseId={exerciseId} />;
  }

  const ExerciseComponent = config.component;

  return (
    <div className="w-full">
      {/* Header opcional */}
      {showHeader && <ExerciseHeader config={config} />}

      {/* Ejercicio con ErrorBoundary y Suspense */}
      <ExerciseErrorBoundary exerciseId={exerciseId} onError={onError}>
        <Suspense fallback={<ExerciseFallback exerciseName={config.name} />}>
          <ExerciseComponent onComplete={onComplete} onProgress={onProgress} />
        </Suspense>
      </ExerciseErrorBoundary>
    </div>
  );
});
