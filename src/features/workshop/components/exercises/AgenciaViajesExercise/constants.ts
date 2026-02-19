/**
 * @file constants.ts
 * @description Datos y configuración del ejercicio Agencia de Viajes
 */

import type { TutorialStep, ExamplePrompt } from "./types";

// ============================================
// PASOS DEL TUTORIAL
// ============================================

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    num: 1,
    title: "¿Quién eres?",
    subtitle: "ROL",
    color: "blue",
    description:
      "Define tu identidad profesional. Esto le da contexto a la IA sobre desde qué perspectiva debe responder.",
    examples: [
      "Agente de viajes especializado en destinos exóticos",
      "Fotógrafo turístico profesional",
      "Creador de contenido de viajes",
      "Guía turístico con 10 años de experiencia",
    ],
  },
  {
    num: 2,
    title: "¿Qué quieres hacer?",
    subtitle: "OBJETIVO",
    color: "emerald",
    description:
      "Especifica claramente qué deseas lograr. Un objetivo claro genera mejores resultados.",
    examples: [
      "Vender un paquete turístico a París",
      "Crear un anuncio atractivo para redes sociales",
      "Escribir un email promocional convincente",
      "Generar una descripción de destino turístico",
    ],
  },
  {
    num: 3,
    title: "¿Qué lugar y qué sentimiento?",
    subtitle: "ESCENA + EMOCIÓN",
    color: "amber",
    description:
      "Describe el escenario y la emoción que quieres transmitir. Los detalles sensoriales hacen la diferencia.",
    examples: [
      "Playa al atardecer → Tranquilidad y romance",
      "Ciudad vibrante de noche → Aventura y energía",
      "Montañas nevadas al amanecer → Paz y renovación",
      "Mercado tradicional colorido → Autenticidad y cultura",
    ],
  },
  {
    num: 4,
    title: "¿Qué estilo prefieres?",
    subtitle: "ESTILO VISUAL",
    color: "purple",
    description:
      "Define la estética y el tono. Esto guía el lenguaje y la personalidad de la respuesta.",
    examples: [
      "Elegante y de lujo tipo revista Condé Nast",
      "Moderno y casual tipo Instagram stories",
      "Natural y minimalista tipo National Geographic",
      "Vibrante y juvenil tipo TikTok",
    ],
  },
  {
    num: 5,
    title: "¿Qué quieres recibir?",
    subtitle: "SALIDA ESPERADA",
    color: "pink",
    description:
      "Especifica el formato y la longitud deseada. Esto asegura que recibas exactamente lo que necesitas.",
    examples: [
      "Texto para folleto impreso (150 palabras)",
      "Post completo para Instagram con hashtags",
      "Descripción SEO para sitio web (300 palabras)",
      "Script para video de YouTube (1 minuto)",
    ],
  },
];

// ============================================
// EJEMPLO COMPLETO - BALI
// ============================================

export const BALI_EXAMPLE: ExamplePrompt = {
  rol: "agente de viajes profesional especializado en destinos asiáticos",
  objetivo: "vender un paquete turístico de 7 días a Bali",
  escena:
    "playa paradisíaca de Uluwatu al amanecer con templo en el acantilado",
  emocion: "paz, renovación espiritual y conexión con la naturaleza",
  estilo: "fotografía de revista de lujo tipo Condé Nast Traveler",
  salida:
    "descripción promocional para Instagram (200 palabras) con 5 hashtags",
  prompt: `Actúa como un agente de viajes profesional especializado en destinos asiáticos. Crea una descripción promocional para Instagram para vender un paquete turístico de 7 días a Bali. La escena principal es una playa paradisíaca de Uluwatu al amanecer con un templo en el acantilado que transmite paz, renovación espiritual y conexión con la naturaleza. Usa un estilo de fotografía de revista de lujo tipo Condé Nast Traveler. Escribe un texto de 200 palabras listo para publicar en Instagram, incluyendo 5 hashtags relevantes.`,
  description:
    "✨ Este prompt combina los 5 elementos de forma profesional para obtener resultados precisos y de calidad.",
};

// ============================================
// TEXTOS DE LA INTERFAZ
// ============================================

export const UI_TEXTS = {
  intro: {
    title: "🌴 Ejercicio: Agencia de Viajes",
    subtitle: "Aprende a crear prompts estructurados en 5 pasos",
    description:
      "Descubre cómo crear descripciones profesionales de destinos turísticos usando una fórmula simple pero poderosa.",
    tutorialButton: "📚 Ver Tutorial",
    practiceButton: "✍️ Practicar Ahora",
    elementsList: [
      { icon: "👤", label: "ROL", description: "¿Quién eres?" },
      { icon: "🎯", label: "OBJETIVO", description: "¿Qué quieres hacer?" },
      {
        icon: "🌅",
        label: "ESCENA + EMOCIÓN",
        description: "¿Dónde y qué sentimiento?",
      },
      { icon: "🎨", label: "ESTILO VISUAL", description: "¿Cómo debe verse?" },
      { icon: "📝", label: "SALIDA ESPERADA", description: "¿Qué formato?" },
    ],
  },
  tutorial: {
    title: "Tutorial Paso a Paso",
    subtitle: "Aprende los 5 elementos del prompt perfecto",
    nextButton: "Siguiente",
    prevButton: "Anterior",
    skipButton: "Saltar Tutorial",
    exampleButton: "Ver Ejemplo Completo",
  },
  example: {
    title: "✨ Ejemplo Completo: Destino Bali",
    subtitle: "Así se ve un prompt profesional estructurado",
    continueButton: "Ir a Practicar",
    promptLabel: "PROMPT GENERADO:",
  },
  practice: {
    title: "✍️ Tu Turno: Crea tu Prompt",
    subtitle:
      "Tienes 6 elementos para construir un prompt profesional. Completa cada bloque con precisión.",
    timerLabel: "Tiempo restante:",
    submitButton: "Generar Prompt Final",
    exitButton: "Salir",
    fields: [
      {
        key: "rol",
        label: "ROL",
        description: "Define desde qué perspectiva se construye el mensaje",
        placeholder: "Ej: Agente de viajes especializado en destinos asiáticos de lujo",
        example: "Consultor fintech especializado en innovación blockchain",
        icon: "👤",
      },
      {
        key: "objetivo",
        label: "OBJETIVO",
        description: "Describe qué quieres lograr con el mensaje",
        placeholder: "Ej: Vender un paquete turístico de 7 días a Bali para parejas",
        example: "Presentar una nueva startup de IA al público",
        icon: "🎯",
      },
      {
        key: "escena",
        label: "ESCENA",
        description: "Describe el escenario donde sitúas la acción",
        placeholder: "Ej: Playa paradisíaca de Uluwatu al amanecer con templo en el acantilado",
        example: "Atardecer en un rascacielos con vista panorámica de la ciudad",
        icon: "🌅",
      },
      {
        key: "emocion",
        label: "EMOCIÓN",
        description: "Define la emoción que quieres transmitir",
        placeholder: "Ej: Paz, renovación espiritual y conexión con la naturaleza",
        example: "Confianza, innovación y visión de futuro",
        icon: "💫",
      },
      {
        key: "estilo",
        label: "ESTILO VISUAL",
        description: "Define el estilo visual que tendrá la imagen",
        placeholder: "Ej: Fotografía de revista de lujo tipo Condé Nast Traveler",
        example: "Minimalista y futurista, colores blanco y azul",
        icon: "🎨",
      },
      {
        key: "salida",
        label: "SALIDA ESPERADA",
        description: "Describe el formato y fin esperado al crear el mensaje",
        placeholder: "Ej: Descripción promocional para Instagram (200 palabras) con 5 hashtags",
        example: "Guión de video corto para TikTok, tono humorístico",
        icon: "📝",
      },
    ],
  },
  completed: {
    title: "🎉 ¡Ejercicio Completado!",
    subtitle: "Has creado tu primer prompt estructurado",
    timeLabel: "Tiempo total:",
    viewResultButton: "Ver Mi Prompt",
    continueButton: "Continuar",
  },
};

// ============================================
// ESTILOS POR COLOR (para usar con Tailwind)
// ============================================

export const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  },
  amber: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
  pink: {
    bg: "bg-pink-500/20",
    border: "border-pink-500/30",
    text: "text-pink-400",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
  },
};
