/**
 * @file features/admin/data/mockData.ts
 * @description Datos de prueba para desarrollo
 *
 * TODO: Eliminar en producción y usar datos reales de Supabase
 */

import type { Slide, Participant, SessionState } from "@/types";

export const mockSlides: Slide[] = [
  {
    id: "s1",
    type: "intro",
    order_index: 0,
    title: "Bienvenido a Destino IA",
    subtitle: "Taller Colaborativo",
    content:
      "Prepárate para sumergirte en el universo de la IA Generativa. Hoy vas a crear, probar y dominar las herramientas del mañana.",
    is_active: true,
  },
  {
    id: "s2",
    type: "theory",
    order_index: 1,
    title: "El Nuevo Paradigma",
    subtitle: "Teoría de la IA",
    content:
      "Entiende por qué la IA generativa no es una simple búsqueda en Google, sino una colaboración creativa con una mente sintética.",
    is_active: false,
  },
  {
    id: "s3",
    type: "theory",
    order_index: 2,
    title: "El Arte del Prompt: RCTF",
    subtitle: "Metodología",
    content:
      "Rol, Contexto, Tarea, Formato. Los 4 pilares indispensables para pilotar cualquier LLM o generador de imágenes.",
    is_active: false,
  },
  {
    id: "s4",
    type: "exercise",
    order_index: 3,
    title: "Ejercicio: Visión Creativa",
    subtitle: "Práctica Grok/Flux",
    content:
      "Usa tus primeros prompts estructurados para generar una imagen hiperrealista que desafíe las leyes de la física.",
    is_active: false,
  },
  {
    id: "s5",
    type: "theory",
    order_index: 4,
    title: "Optimización Multimodal",
    subtitle: "Técnicas Avanzadas",
    content:
      "Aprende a iterar sobre un resultado para alcanzar la perfección: in-painting, upscaling y variaciones de estilo.",
    is_active: false,
  },
  {
    id: "s6",
    type: "exercise",
    order_index: 5,
    title: "Ejercicio: Redacción IA",
    subtitle: "Práctica LLM",
    content:
      "Redacta un artículo de blog completo sobre un tema complejo usando una cadena de prompts iterativa.",
    is_active: false,
  },
  {
    id: "s7",
    type: "challenge",
    order_index: 6,
    title: "El Desafío Destino",
    subtitle: "Reto Final",
    content:
      "Tienes 20 minutos para crear una campaña de marketing completa (imagen + texto) para un producto imaginario.",
    is_active: false,
  },
  {
    id: "s8",
    type: "intro",
    order_index: 7,
    title: "Conclusión & Feedback",
    subtitle: "Cierre",
    content:
      "¡Gracias por participar! Tus recursos están disponibles en el espacio de descarga.",
    is_active: false,
  },
];

export const mockParticipants: Participant[] = [
  {
    id: "p1",
    name: "Alejandro Ruiz",
    status: "online",
    joined_at: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Carla Méndez",
    status: "online",
    joined_at: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Roberto Gómez",
    status: "offline",
    joined_at: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Sofía Castro",
    status: "online",
    joined_at: new Date().toISOString(),
  },
  {
    id: "p5",
    name: "Diego Torres",
    status: "online",
    joined_at: new Date().toISOString(),
  },
];

export const initialSessionState: SessionState = {
  current_slide_id: "s1",
  is_exercise_active: false,
  active_tab: "slides",
  is_quiz_active: false,
};
