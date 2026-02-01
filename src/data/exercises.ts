/**
 * @file data/exercises.ts
 * @description Définition des exercices disponibles dans la plateforme
 */

export type ExerciseType =
  | "text-to-image"
  | "image-to-video"
  | "text-to-video"
  | "flyer-to-video";

export type ExerciseId =
  | "agencia"
  | "intro"
  | "corporate"
  | "ads"
  | "logo"
  | "imageToVideo"
  | "textToVideo"
  | "flyerToVideo";

export interface Exercise {
  id: ExerciseId;
  name: string;
  type: ExerciseType;
  description: string;
  duration?: number;
  category: "beginner" | "intermediate" | "advanced";
}

/**
 * Liste des exercices disponibles
 */
export const exercises: Exercise[] = [
  {
    id: "agencia",
    name: "Agencia de Viajes",
    type: "text-to-image",
    description: "Créer des visuels pour une agence de voyage",
    duration: 15,
    category: "intermediate",
  },
  {
    id: "intro",
    name: "Text to Image - Intro",
    type: "text-to-image",
    description: "Introduction au text-to-image avec plage paradisiaque",
    duration: 10,
    category: "beginner",
  },
  {
    id: "corporate",
    name: "Text to Image - Corporate",
    type: "text-to-image",
    description: "Générer des images corporate professionnelles",
    duration: 12,
    category: "intermediate",
  },
  {
    id: "ads",
    name: "Text to Image - Ads",
    type: "text-to-image",
    description: "Créer des visuels publicitaires",
    duration: 12,
    category: "intermediate",
  },
  {
    id: "logo",
    name: "Text to Image - Logo",
    type: "text-to-image",
    description: "Générer des concepts de logos",
    duration: 15,
    category: "advanced",
  },
  {
    id: "imageToVideo",
    name: "Image to Video Workflow",
    type: "image-to-video",
    description: "Transformer des images en vidéos animées",
    duration: 15,
    category: "intermediate",
  },
  {
    id: "textToVideo",
    name: "Text to Video from Scratch",
    type: "text-to-video",
    description: "Créer des vidéos à partir de prompts textuels",
    duration: 15,
    category: "advanced",
  },
  {
    id: "flyerToVideo",
    name: "Flyer to Video - 4 Escenas",
    type: "flyer-to-video",
    description: "Transformer un flyer en spot TV avec 4 scènes",
    duration: 20,
    category: "advanced",
  },
];

/**
 * Utilitaire pour trouver un exercice par ID
 */
export function getExerciseById(id: ExerciseId): Exercise | undefined {
  return exercises.find((ex) => ex.id === id);
}

/**
 * Utilitaire pour filtrer par type
 */
export function getExercisesByType(type: ExerciseType): Exercise[] {
  return exercises.filter((ex) => ex.type === type);
}

/**
 * Utilitaire pour filtrer par catégorie
 */
export function getExercisesByCategory(
  category: Exercise["category"],
): Exercise[] {
  return exercises.filter((ex) => ex.category === category);
}
