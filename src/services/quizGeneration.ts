/**
 * @file services/quizGeneration.ts
 * @description Quiz auto-generation from PDF text via Claude Haiku (Edge Function).
 *
 * Design principles:
 * - Economy: only extracted text is sent (not images), capped at 10k chars
 * - No new DB tables: quiz JSON stored in Supabase Storage alongside slides
 * - Evolutive: swap model or provider by changing the Edge Function only
 */

/* eslint-disable no-console */

import { getSupabaseClient } from "@/services/supabase/client";
import type { QuizQuestion } from "@/features/quiz";

const QUIZ_FILE = "quiz.json";
const BUCKET = "slides";

// ============================================================
// GENERATION
// ============================================================

/**
 * Calls the generate-quiz Edge Function with extracted PDF text.
 * The Edge Function calls Claude Haiku and returns quiz questions.
 *
 * @param text - Concatenated PDF text (will be truncated server-side at 10k chars)
 */
export async function generateQuizFromText(text: string): Promise<QuizQuestion[]> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase no está configurado");

  // Get auth token so Edge Function can verify the caller
  const { data: { session } } = await supabase.auth.getSession();
  const authToken = session?.access_token;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  if (!supabaseUrl) throw new Error("VITE_SUPABASE_URL no definida");

  const response = await fetch(`${supabaseUrl}/functions/v1/generate-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(err.error ?? `Error ${response.status} al generar el quiz`);
  }

  const { questions } = await response.json();
  return questions as QuizQuestion[];
}

// ============================================================
// STORAGE  (reuses the existing "slides" bucket — no new bucket)
// ============================================================

/**
 * Saves generated quiz questions as JSON in Supabase Storage.
 * Path: {sessionId}/quiz.json (alongside slides-manifest.json)
 */
export async function saveQuizToStorage(
  questions: QuizQuestion[],
  sessionId: string,
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase no está configurado");

  const blob = new Blob([JSON.stringify(questions)], {
    type: "application/json",
  });

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${sessionId}/${QUIZ_FILE}`, blob, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) throw new Error(`Error guardando quiz: ${error.message}`);
}

/**
 * Returns the public URL for the quiz JSON file.
 * Returns null if Supabase is not configured.
 */
export function getQuizStorageUrl(sessionId: string): string | null {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${sessionId}/${QUIZ_FILE}`);

  return data.publicUrl;
}

/**
 * Loads the generated quiz from Supabase Storage.
 * Returns null if no quiz has been generated yet (404) or on error.
 */
export async function loadQuizFromStorage(
  sessionId: string,
): Promise<QuizQuestion[] | null> {
  const url = getQuizStorageUrl(sessionId);
  if (!url) return null;

  try {
    // Cache-bust to always get the latest generated quiz
    const response = await fetch(`${url}?t=${Date.now()}`);
    if (!response.ok) return null;

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? (data as QuizQuestion[]) : null;
  } catch (err) {
    console.warn("[quizGeneration] Could not load quiz from storage:", err);
    return null;
  }
}
