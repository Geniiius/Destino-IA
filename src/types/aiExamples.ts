/**
 * @file types/aiExamples.ts
 * @description Tipos para los ejemplos de IA servidos desde assets estáticos
 * 
 * MIGRACIÓN FINOPS:
 * - Assets movidos de Supabase Storage a /public/assets/
 * - Servidos via Vercel CDN (0 egress Supabase)
 */

// ============================================
// ENUMS / LITERALS
// ============================================

export type AITool = 'ideogram' | 'grok' | 'gemini' | 'chatgpt';
export type AIExampleType = 'image' | 'video';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PromptMethod = 'Estructura 5 pasos' | 'RCTF' | 'Chain of Thought' | 'Role Playing' | 'Custom';

// ============================================
// INTERFACES PRINCIPALES
// ============================================

/**
 * Ejemplo de IA (imagen o video generado)
 */
export interface AIExample {
  /** ID único del ejemplo */
  id: string;
  
  /** Herramienta de IA utilizada */
  tool: AITool;
  
  /** Tipo de contenido */
  type: AIExampleType;
  
  /** Título descriptivo */
  title: string;
  
  /** Descripción del ejemplo */
  description: string;
  
  /** Prompt utilizado para generar el contenido */
  prompt: string;
  
  /** Método de prompting utilizado */
  promptMethod?: PromptMethod | string;
  
  /** Ruta del asset (relativa a /public) */
  assetPath: string;
  
  /** Thumbnail para videos (ruta relativa) */
  thumbnail?: string;
  
  /** Tags para filtrado y búsqueda */
  tags: string[];
  
  /** Nivel de dificultad */
  difficulty: DifficultyLevel;
  
  /** Ejercicio asociado (si aplica) */
  exerciseId?: string;
  
  /** Fecha de creación */
  createdAt?: string;
}

/**
 * Estructura del archivo examples.json
 */
export interface AIExamplesData {
  examples: AIExample[];
  _meta: {
    version: string;
    lastUpdated: string;
    totalCount: number;
    tools: AITool[];
  };
}

// ============================================
// OPCIONES Y RETORNOS DE HOOKS
// ============================================

/**
 * Opciones para filtrar ejemplos
 */
export interface UseAIExamplesOptions {
  /** Filtrar por herramienta */
  tool?: AITool | 'all';
  
  /** Filtrar por tipo (imagen/video) */
  type?: AIExampleType | 'all';
  
  /** Filtrar por dificultad */
  difficulty?: DifficultyLevel | 'all';
  
  /** Filtrar por ejercicio */
  exerciseId?: string;
  
  /** Filtrar por tags */
  tags?: string[];
}

/**
 * Resultado del hook useAIExamples
 */
export interface UseAIExamplesResult {
  /** Lista de ejemplos (filtrados según opciones) */
  examples: AIExample[];
  
  /** Todos los ejemplos sin filtrar */
  allExamples: AIExample[];
  
  /** Estado de carga */
  isLoading: boolean;
  
  /** Error si hubo alguno */
  error: Error | null;
  
  // === HELPERS ===
  
  /** Obtener ejemplos por herramienta */
  getByTool: (tool: AITool) => AIExample[];
  
  /** Obtener ejemplos por tipo */
  getByType: (type: AIExampleType) => AIExample[];
  
  /** Obtener ejemplo por ID */
  getById: (id: string) => AIExample | undefined;
  
  /** Obtener ejemplos por ejercicio */
  getByExercise: (exerciseId: string) => AIExample[];
  
  /** Obtener ejemplos por tags */
  getByTags: (tags: string[]) => AIExample[];
  
  /** Metadata del catálogo */
  meta: AIExamplesData['_meta'] | null;
}

// ============================================
// CONSTANTES
// ============================================

export const AI_TOOLS: AITool[] = ['ideogram', 'grok', 'gemini', 'chatgpt'];

export const AI_TOOL_LABELS: Record<AITool, string> = {
  ideogram: 'Ideogram',
  grok: 'Grok (xAI)',
  gemini: 'Gemini (Google)',
  chatgpt: 'ChatGPT (DALL-E)',
};

export const AI_TOOL_COLORS: Record<AITool, string> = {
  ideogram: '#FF6B6B',
  grok: '#10B981',
  gemini: '#4285F4',
  chatgpt: '#74AA9C',
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: '#10B981',
  intermediate: '#F59E0B',
  advanced: '#EF4444',
};
