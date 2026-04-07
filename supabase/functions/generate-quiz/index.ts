/**
 * @file Supabase Edge Function: generate-quiz
 * @description Generates quiz questions from PDF text using Groq (Llama 3.3 70B).
 *
 * Economy: Only text is sent (not images). Groq free tier: 14,400 req/day.
 * Text is capped at 10,000 chars to keep token costs minimal.
 * response_format: json_object guarantees valid JSON output (no parsing hacks needed).
 *
 * Deployment:
 *   npx supabase functions deploy generate-quiz
 *
 * Required secret (Supabase Dashboard → Edge Functions → Secrets):
 *   GROQ_API_KEY
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const MAX_TEXT_LENGTH = 10_000; // ~2,000 words — enough for 10 solid questions
const NUM_QUESTIONS = 10;
const GROQ_MODEL = "llama-3.3-70b-versatile";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller has a valid Supabase session (prevents anonymous API abuse)
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { error } = await client.auth.getUser();
      if (error) {
        return new Response(JSON.stringify({ error: "Sesión inválida" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Se requiere al menos 50 caracteres de texto" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY no configurada en los secretos de Supabase" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const truncatedText = text.slice(0, MAX_TEXT_LENGTH);

    const prompt = `Eres un generador de quizzes educativos. Analiza el siguiente texto de una presentación y genera exactamente ${NUM_QUESTIONS} preguntas de opción múltiple.

Reglas estrictas:
- Cada pregunta tiene exactamente 4 opciones (array "options" con 4 strings)
- "correctAnswer" es el índice 0-based de la respuesta correcta (0, 1, 2 o 3)
- "explanation" es una explicación breve y clara (máx 150 chars)
- Mezcla de dificultades: 3 fáciles (easy=100pts), 4 medias (medium=150pts), 3 difíciles (hard=200pts)
- "category" siempre es "General"
- Las preguntas deben cubrir conceptos clave distintos del texto

Devuelve un objeto JSON con esta estructura exacta:
{"questions":[{"id":1,"question":"...","options":["...","...","...","..."],"correctAnswer":0,"explanation":"...","category":"General","difficulty":"easy","points":100}]}

Texto a analizar:
${truncatedText}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.4,
        response_format: { type: "json_object" }, // Guarantees valid JSON — no regex fallback needed
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[generate-quiz] Groq API error:", errText);
      return new Response(
        JSON.stringify({ error: "Error al llamar a Groq API" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const groqResult = await groqRes.json();
    const rawContent: string = groqResult.choices?.[0]?.message?.content ?? "{}";

    const parsed = JSON.parse(rawContent);
    // Support both { questions: [...] } and direct array
    const rawQuestions = Array.isArray(parsed) ? parsed : (parsed.questions ?? []);

    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      throw new Error("El quiz generado está vacío");
    }

    // Normalize: guarantee all required fields
    const normalized = rawQuestions.map((q: Record<string, unknown>, i: number) => ({
      id: i + 1,
      question: String(q.question ?? ""),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctAnswer: Number(q.correctAnswer ?? 0),
      explanation: String(q.explanation ?? ""),
      category: "General",
      difficulty: ["easy", "medium", "hard"].includes(String(q.difficulty))
        ? q.difficulty
        : "medium",
      points: Number(q.points ?? 150),
    }));

    console.log(
      `[generate-quiz] ${normalized.length} questions generated via Groq (${truncatedText.length} chars input)`,
    );

    return new Response(JSON.stringify({ questions: normalized }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[generate-quiz] Unexpected error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Error interno del servidor",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
