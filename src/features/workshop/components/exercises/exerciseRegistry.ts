/**
 * @file exerciseRegistry.ts
 * @description Registry de ejercicios con lazy loading
 *
 * CARACTERÍSTICAS:
 * - Cada ejercicio se carga bajo demanda con React.lazy
 * - Metadatos accesibles sin cargar el componente
 * - Helpers para filtrar por herramienta, categoría, dificultad
 */

import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

// ============================================
// TYPES
// ============================================

export type AITool = 'ideogram' | 'grok' | 'gemini' | 'chatgpt';

export type ExerciseCategory =
  | 'image-generation'
  | 'video-generation'
  | 'prompt-engineering'
  | 'workflow';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseProps {
  /** Callback cuando el ejercicio se completa */
  onComplete?: (result: ExerciseResult) => void;
  /** Callback para reportar progreso (0-100) */
  onProgress?: (progress: number) => void;
}

export interface ExerciseResult {
  exerciseId: string;
  completedAt: Date;
  score?: number;
  data?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyExerciseComponent = LazyExoticComponent<ComponentType<any>>;

export interface ExerciseConfig {
  /** ID único del ejercicio */
  id: string;
  /** Nombre para mostrar */
  name: string;
  /** Descripción breve */
  description: string;
  /** Duración estimada en minutos */
  duration: number;
  /** Nivel de dificultad */
  difficulty: ExerciseDifficulty;
  /** Categoría del ejercicio */
  category: ExerciseCategory;
  /** Herramientas IA utilizadas */
  tools: AITool[];
  /** Componente lazy-loaded (acepta diferentes interfaces de props) */
  component: AnyExerciseComponent;
  /** Icono opcional (nombre de Lucide icon) */
  icon?: string;
  /** Tags para búsqueda */
  tags?: string[];
}

// ============================================
// REGISTRY
// ============================================

export const exerciseRegistry: Record<string, ExerciseConfig> = {
  // ========================================
  // PROMPT ENGINEERING - INTRODUCCIÓN
  // ========================================
  'text-to-image-intro': {
    id: 'text-to-image-intro',
    name: 'Introducción a Text-to-Image',
    description: 'Primeros pasos con la generación de imágenes: estructura básica del prompt',
    duration: 10,
    difficulty: 'beginner',
    category: 'prompt-engineering',
    tools: ['ideogram', 'chatgpt'],
    icon: 'Sparkles',
    tags: ['intro', 'básico', 'prompt'],
    component: lazy(() =>
      import('./TextToImageIntro').then((m) => ({ default: m.TextToImageIntro }))
    ),
  },

  // ========================================
  // GENERACIÓN DE IMÁGENES - IDEOGRAM
  // ========================================
  'agencia-viajes': {
    id: 'agencia-viajes',
    name: 'Campaña Agencia de Viajes',
    description: 'Crear visuales promocionales para una agencia de viajes con Ideogram',
    duration: 25,
    difficulty: 'intermediate',
    category: 'image-generation',
    tools: ['ideogram'],
    icon: 'Plane',
    tags: ['viajes', 'turismo', 'póster', 'campaña'],
    component: lazy(() =>
      import('./AgenciaViajesExercise').then((m) => ({ default: m.AgenciaViajesExercise }))
    ),
  },

  'text-to-image-ads': {
    id: 'text-to-image-ads',
    name: 'Publicidad Visual',
    description: 'Generar imágenes para anuncios publicitarios',
    duration: 20,
    difficulty: 'intermediate',
    category: 'image-generation',
    tools: ['ideogram', 'chatgpt'],
    icon: 'Megaphone',
    tags: ['ads', 'publicidad', 'marketing'],
    component: lazy(() =>
      import('./TextToImageAds').then((m) => ({ default: m.TextToImageAds }))
    ),
  },

  'text-to-image-corporate': {
    id: 'text-to-image-corporate',
    name: 'Imagen Corporativa',
    description: 'Crear visuales profesionales para entorno corporativo',
    duration: 20,
    difficulty: 'intermediate',
    category: 'image-generation',
    tools: ['ideogram', 'gemini'],
    icon: 'Building2',
    tags: ['corporativo', 'profesional', 'empresa'],
    component: lazy(() =>
      import('./TextToImageCorporate').then((m) => ({ default: m.TextToImageCorporate }))
    ),
  },

  'text-to-image-logo': {
    id: 'text-to-image-logo',
    name: 'Diseño de Logotipos',
    description: 'Generar conceptos de logotipos con IA',
    duration: 25,
    difficulty: 'advanced',
    category: 'image-generation',
    tools: ['ideogram', 'chatgpt'],
    icon: 'Palette',
    tags: ['logo', 'branding', 'identidad'],
    component: lazy(() =>
      import('./TextToImageLogo').then((m) => ({ default: m.TextToImageLogo }))
    ),
  },

  // ========================================
  // GENERACIÓN DE VIDEO - GROK
  // ========================================
  'text-to-video-workflow': {
    id: 'text-to-video-workflow',
    name: 'Imagen a Video',
    description: 'Transformar una imagen estática en video animado con Grok',
    duration: 20,
    difficulty: 'intermediate',
    category: 'video-generation',
    tools: ['grok'],
    icon: 'Video',
    tags: ['video', 'animación', 'movimiento'],
    component: lazy(() =>
      import('./TextToVideoWorkflow').then((m) => ({ default: m.TextToVideoWorkflow }))
    ),
  },

  'text-to-video-scratch': {
    id: 'text-to-video-scratch',
    name: 'Video desde Cero',
    description: 'Crear un video completamente generado por IA',
    duration: 30,
    difficulty: 'advanced',
    category: 'video-generation',
    tools: ['grok'],
    icon: 'Clapperboard',
    tags: ['video', 'creación', 'avanzado'],
    component: lazy(() =>
      import('./TextToVideoFromScratch').then((m) => ({ default: m.TextToVideoFromScratch }))
    ),
  },

  // ========================================
  // WORKFLOW COMPLETO
  // ========================================
  'flyer-to-video': {
    id: 'flyer-to-video',
    name: 'Del Flyer al Video',
    description: 'Workflow completo: crear un flyer y animarlo en video',
    duration: 45,
    difficulty: 'advanced',
    category: 'workflow',
    tools: ['ideogram', 'grok'],
    icon: 'Workflow',
    tags: ['workflow', 'flyer', 'video', 'campaña'],
    component: lazy(() =>
      import('./FlyerToVideoWorkflow').then((m) => ({ default: m.FlyerToVideoWorkflow }))
    ),
  },
};

// ============================================
// HELPERS
// ============================================

/**
 * Obtener un ejercicio por ID
 */
export function getExercise(id: string): ExerciseConfig | undefined {
  return exerciseRegistry[id];
}

/**
 * Obtener todos los ejercicios
 */
export function getAllExercises(): ExerciseConfig[] {
  return Object.values(exerciseRegistry);
}

/**
 * Filtrar ejercicios por herramienta IA
 */
export function getExercisesByTool(tool: AITool): ExerciseConfig[] {
  return Object.values(exerciseRegistry).filter((ex) => ex.tools.includes(tool));
}

/**
 * Filtrar ejercicios por categoría
 */
export function getExercisesByCategory(category: ExerciseCategory): ExerciseConfig[] {
  return Object.values(exerciseRegistry).filter((ex) => ex.category === category);
}

/**
 * Filtrar ejercicios por dificultad
 */
export function getExercisesByDifficulty(difficulty: ExerciseDifficulty): ExerciseConfig[] {
  return Object.values(exerciseRegistry).filter((ex) => ex.difficulty === difficulty);
}

/**
 * Buscar ejercicios por texto (nombre, descripción, tags)
 */
export function searchExercises(query: string): ExerciseConfig[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return getAllExercises();
  }

  return Object.values(exerciseRegistry).filter((ex) => {
    const searchableText = [
      ex.name,
      ex.description,
      ...(ex.tags || []),
      ...ex.tools,
      ex.category,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/**
 * Obtener ejercicios similares (misma categoría o herramientas)
 */
export function getSimilarExercises(exerciseId: string, limit = 3): ExerciseConfig[] {
  const exercise = getExercise(exerciseId);

  if (!exercise) {
    return [];
  }

  return Object.values(exerciseRegistry)
    .filter((ex) => ex.id !== exerciseId)
    .map((ex) => {
      // Calcular score de similitud
      let score = 0;

      if (ex.category === exercise.category) score += 2;
      if (ex.difficulty === exercise.difficulty) score += 1;

      const sharedTools = ex.tools.filter((t) => exercise.tools.includes(t));
      score += sharedTools.length;

      return { exercise: ex, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.exercise);
}

// ============================================
// CONSTANTES
// ============================================

/** Colores por herramienta para badges */
export const TOOL_COLORS: Record<AITool, { bg: string; text: string; border: string }> = {
  ideogram: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  grok: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
  },
  gemini: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
  },
  chatgpt: {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-500/30',
  },
};

/** Nombres legibles de herramientas */
export const TOOL_NAMES: Record<AITool, string> = {
  ideogram: 'Ideogram',
  grok: 'Grok',
  gemini: 'Gemini',
  chatgpt: 'ChatGPT',
};

/** Nombres legibles de categorías */
export const CATEGORY_NAMES: Record<ExerciseCategory, string> = {
  'image-generation': 'Generación de Imágenes',
  'video-generation': 'Generación de Video',
  'prompt-engineering': 'Prompt Engineering',
  workflow: 'Workflow Completo',
};

/** Nombres legibles de dificultades */
export const DIFFICULTY_NAMES: Record<ExerciseDifficulty, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

/** Colores por dificultad */
export const DIFFICULTY_COLORS: Record<ExerciseDifficulty, string> = {
  beginner: 'text-emerald-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};
