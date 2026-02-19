/**
 * @file exerciseData.ts
 * @description Datos de configuración de ejercicios
 */

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
  emoji: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  gradient: string;
  badge: {
    bg: string;
    text: string;
    label: string;
  };
}

export const EXERCISES: Exercise[] = [
  {
    id: "agencia",
    emoji: "🌴",
    title: "Agencia de Viajes",
    description:
      "Crea prompts estructurados para marketing de destinos turísticos.",
    category: "Principiante",
    duration: "10-15 min",
    gradient:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500",
    badge: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      label: "Principiante",
    },
  },
  {
    id: "intro",
    emoji: "🏖️",
    title: "Text to Image: Beach",
    description:
      "Genera imágenes de trabajadores remotos en playas paradisíacas.",
    category: "Imagen",
    duration: "8-10 min",
    gradient:
      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400",
    badge: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      label: "Imagen",
    },
  },
  {
    id: "corporate",
    emoji: "🏢",
    title: "Text to Image: Corporate",
    description: "Crea imágenes profesionales para contextos empresariales.",
    category: "Imagen",
    duration: "8-10 min",
    gradient:
      "bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400",
    badge: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      label: "Imagen",
    },
  },
  {
    id: "ads",
    emoji: "🌃",
    title: "Text to Image: Ads",
    description:
      "Genera anuncios visuales impactantes para publicidad.",
    category: "Imagen",
    duration: "8-10 min",
    gradient:
      "bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 hover:from-indigo-400 hover:via-fuchsia-400 hover:to-pink-400",
    badge: {
      bg: "bg-fuchsia-500/20",
      text: "text-fuchsia-400",
      label: "Imagen",
    },
  },
  {
    id: "logo",
    emoji: "🏷️",
    title: "Logo to Image",
    description:
      "Integra logos en objetos reales respetando física, luz y textura para branding profesional.",
    category: "Branding",
    duration: "8-10 min",
    gradient:
      "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400",
    badge: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      label: "Branding",
    },
  },
  {
    id: "imageToVideo",
    emoji: "🎬",
    title: "Image to Video",
    description:
      "Transforma imágenes en videos animados con IA siguiendo un flujo profesional.",
    category: "Workflow",
    duration: "15-20 min",
    gradient:
      "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400",
    badge: {
      bg: "bg-indigo-500/20",
      text: "text-indigo-400",
      label: "Workflow",
    },
  },
  {
    id: "textToVideo",
    emoji: "🎥",
    title: "Text to Video",
    description:
      "Genera videos profesionales directamente desde texto con los 5 pilares.",
    category: "Rápido",
    duration: "10-12 min",
    gradient:
      "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400",
    badge: {
      bg: "bg-rose-500/20",
      text: "text-rose-400",
      label: "Rápido",
    },
  },
  {
    id: "flyerToVideo",
    emoji: "📢",
    title: "Flyer to Video 4 Escenas",
    description:
      "Transforma un flyer en un spot de TV profesional de 4 escenas.",
    category: "Completo",
    duration: "15-20 min",
    gradient:
      "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400",
    badge: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      label: "Completo",
    },
  },
];
