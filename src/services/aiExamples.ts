/**
 * @file services/aiExamples.ts
 * @description Servicio para gestionar ejemplos de IA desde Supabase
 */

import { supabase } from "./supabase";
import { exercises } from "@/data/exercises";
import type { Exercise } from "@/data/exercises";

export interface AIExampleData {
  type: "image" | "video";
  url: string;
  prompt: string;
  description?: string;
}

/**
 * Cargar todos los ejemplos de IA desde Supabase
 */
export async function loadAIExamples(): Promise<Map<string, AIExampleData>> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized");
      return new Map();
    }

    const { data, error } = await supabase
      .from("exercise_ai_examples")
      .select("*");

    if (error) throw error;

    const examplesMap = new Map<string, AIExampleData>();

    data?.forEach((example) => {
      examplesMap.set(example.exercise_id, {
        type: example.type,
        url: example.url,
        prompt: example.prompt,
        description: example.description,
      });
    });

    return examplesMap;
  } catch (error) {
    console.error("Error al cargar ejemplos de IA:", error);
    return new Map();
  }
}

/**
 * Obtener ejercicios con ejemplos de IA desde Supabase
 */
export async function getExercisesWithAIExamples(): Promise<Exercise[]> {
  const aiExamples = await loadAIExamples();

  return exercises.map((exercise) => {
    const aiExample = aiExamples.get(exercise.id);
    // Note: aiExample would need to be added to Exercise interface if used
    return exercise;
  });
}

/**
 * Obtener un ejemplo de IA por exercise_id
 */
export async function getAIExampleByExerciseId(
  exerciseId: string,
): Promise<AIExampleData | null> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized");
      return null;
    }

    const { data, error } = await supabase
      .from("exercise_ai_examples")
      .select("*")
      .eq("exercise_id", exerciseId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (!data) return null;

    return {
      type: data.type,
      url: data.url,
      prompt: data.prompt,
      description: data.description,
    };
  } catch (error) {
    console.error("Error al cargar ejemplo:", error);
    return null;
  }
}

/**
 * Guardar o actualizar un ejemplo de IA
 */
export async function saveAIExample(
  exerciseId: string,
  example: AIExampleData,
): Promise<boolean> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized");
      return false;
    }

    const { error } = await supabase.from("exercise_ai_examples").upsert({
      exercise_id: exerciseId,
      type: example.type,
      url: example.url,
      prompt: example.prompt,
      description: example.description,
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error al guardar ejemplo:", error);
    return false;
  }
}

/**
 * Subir archivo a Supabase Storage
 */
export async function uploadAIExampleFile(
  exerciseId: string,
  file: File,
): Promise<string | null> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized");
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${exerciseId}-${Date.now()}.${fileExt}`;
    const filePath = `ai-examples/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("workshop-content")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("workshop-content")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return null;
  }
}
