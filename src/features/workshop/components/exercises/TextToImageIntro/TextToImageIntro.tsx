/**
 * @file TextToImageIntro.tsx
 * @description Ejercicio Text-to-Image: Trabajadores Remotos en Playa
 * Self-contained component - Beach/Remote Worker theme
 */

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  Zap,
  BookOpen,
  Check,
  Copy,
  ChevronLeft,
  Camera,
  Sun,
  User,
  Target,
  Palette,
  Box,
  Terminal,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

export const TextToImageIntro: React.FC = () => {
  const [mode, setMode] = useState("intro"); // intro, tutorial, example, practice
  const [currentStep, setCurrentStep] = useState(0);
  const { copied, copy } = useCopyToClipboard();

  // DATOS: Tema Beach/Remote Worker (Purple/Pink)
  const tutorialSteps = [
    {
      num: 1,
      subtitle: "ROL",
      title: "Paso 1: El Experto",
      icon: <Camera className="w-6 h-6" />,
      question: "¿Quién eres?",
      explanation:
        'Para lifestyle de playa, necesitas un experto en "Fotografía de Viajes" o "Travel Lifestyle Photographer".',
      example:
        "Actúa como un fotógrafo profesional especializado en lifestyle de teletrabajo y destinos tropicales.",
      color: "purple",
      tip: "Esto asegura composiciones aspiracionales y colores vibrantes.",
    },
    {
      num: 2,
      subtitle: "OBJETIVO",
      title: "Paso 2: El Uso",
      icon: <Target className="w-6 h-6" />,
      question: "¿Para qué usarás la imagen?",
      explanation:
        "¿Es para Instagram, un blog de nómadas digitales, o una campaña de trabajo remoto?",
      example:
        "Imagen para campaña de marketing digital vendiendo paquetes de trabajo remoto en playas.",
      color: "pink",
      tip: 'Mencionar "Digital Nomad Lifestyle" potencia la estética moderna.',
    },
    {
      num: 3,
      subtitle: "ESCENA + EMOCIÓN",
      title: "Paso 3: La Escena",
      icon: <Sun className="w-6 h-6" />,
      question: "¿Qué debe verse y sentirse?",
      explanation:
        "Describe la playa, el momento del día, y la sensación de libertad + productividad.",
      example:
        "Persona trabajando con laptop en terraza de villa con vista al océano tropical, atardecer. Emoción: Libertad, equilibrio, éxito.",
      color: "purple",
      tip: 'La "Hora Dorada" (Golden Hour) hace las mejores fotos de playa.',
    },
    {
      num: 4,
      subtitle: "ESTILO",
      title: "Paso 4: La Técnica",
      icon: <Palette className="w-6 h-6" />,
      question: "¿Cómo debe verse técnicamente?",
      explanation:
        'Define iluminación, colores, formato y calidad técnica para lograr el "look profesional".',
      example:
        "Fotografía realista premium, luz cálida natural, colores vibrantes, alta resolución, formato horizontal 16:9.",
      color: "pink",
      tip: 'Pide "Natural lighting" y "Warm tones" para el vibe de playa perfecto.',
    },
    {
      num: 5,
      subtitle: "SALIDA",
      title: "Paso 5: El Output",
      icon: <Box className="w-6 h-6" />,
      question: "¿Qué debe entregarte ChatGPT?",
      explanation:
        "Pedimos el prompt técnico en inglés para maximizar la calidad de la IA.",
      example:
        "Entrégame únicamente el prompt final en inglés, optimizado para Midjourney v6.",
      color: "purple",
      tip: "Los prompts en inglés generan mejores resultados en todas las IAs.",
    },
  ];

  // EJEMPLO COMPLETO
  const completeExample = {
    userPrompt: `ChatGPT, actúa como un fotógrafo experto en lifestyle de trabajo remoto (ROL).

Necesito una imagen para una campaña de marketing digital promocionando paquetes de trabajo remoto en playas tropicales (OBJETIVO).

Escena: Un profesional digital trabajando en una laptop sobre una mesa de madera en la terraza de una villa con vista al océano tropical. Atardecer con luz dorada. Palmeras y océano en el fondo.
Emoción: Libertad absoluta, equilibrio trabajo-vida, éxito y paz (ESCENA + EMOCIÓN).

Estilo: Fotografía realista premium con iluminación natural cálida, colores vibrantes tropical, alta resolución, formato horizontal 16:9 para web (ESTILO).

Salida: Solo el prompt en inglés, listo para Midjourney v6 (SALIDA).`,

    aiPrompt: `Professional digital nomad working on laptop at wooden table on tropical beach villa terrace, ocean view background, golden hour natural lighting, palm trees swaying, turquoise water, warm sunset glow, lifestyle photography, vibrant tropical colors, relaxed yet productive atmosphere, luxury remote work concept, high-resolution photorealistic style, 16:9 horizontal format, shallow depth of field, premium travel photography aesthetic --ar 16:9 --v 6 --style raw --q 2`,

    finalCommand: `Create an image: Professional digital nomad working on laptop at wooden table...`,
  };

  // --- SCREENS ---

  const IntroScreen = () => (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500 text-purple-300 text-sm font-semibold tracking-wide">
          <Sun className="w-4 h-4" />
          🏖️ TEXT TO IMAGE: BEACH
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Aprende los <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Fundamentos
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Domina la metodología de 5 elementos para crear imágenes de
          trabajadores remotos en playas.
        </p>
      </div>

      {/* Los 5 Pilares */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tutorialSteps.map((s, i) => (
          <div
            key={i}
            className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2"
          >
            <div className="text-purple-400">{s.icon}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {s.subtitle}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <button
          onClick={() => setMode("tutorial")}
          className="group bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg border border-gray-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <div className="text-left">
              <div className="text-sm font-normal text-gray-400">Aprender</div>
              Ver Tutorial
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setMode("practice")}
          className="group bg-purple-600 hover:bg-purple-500 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="text-sm font-normal text-purple-200">
                Practicar
              </div>
              Crear Mi Prompt
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const TutorialScreen = () => {
    const step = tutorialSteps[currentStep];
    const isLast = currentStep === tutorialSteps.length - 1;

    const colors: Record<string, string> = {
      purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    };
    const currentTheme = colors[step.color];

    return (
      <div className="max-w-3xl mx-auto animate-fade-in h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMode("intro")}
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex gap-1">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-8 rounded-full transition-all ${idx === currentStep ? "bg-purple-500" : "bg-gray-700"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div
            className={`p-8 border-b ${currentTheme.split(" ")[1]} ${currentTheme.split(" ")[2]}`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border ${currentTheme}">
              {step.icon} {step.subtitle}
            </div>
            <h2 className="text-4xl font-black text-white">{step.title}</h2>
          </div>

          <div className="p-8 space-y-8 flex-1">
            <div>
              <h3 className="text-xl text-white font-semibold mb-2">
                {step.question}
              </h3>
              <p className="text-gray-400 text-lg">{step.explanation}</p>
            </div>

            <div className="bg-black/30 rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-bold uppercase">
                  💡 Ejemplo:
                </span>
              </div>
              <div className="p-5">
                <p
                  className={`font-medium text-lg ${currentTheme.split(" ")[0]}`}
                >
                  "{step.example}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Lightbulb className="w-4 h-4" />
              {step.tip}
            </div>
          </div>

          <div className="p-6 bg-gray-950/50 border-t border-gray-800 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30 px-4 py-2"
            >
              Anterior
            </button>
            <button
              onClick={() => {
                if (isLast) setMode("example");
                else setCurrentStep(currentStep + 1);
              }}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              {isLast ? "Ver Ejemplo" : "Siguiente"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ExampleScreen = () => (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-10">
        <button
          onClick={() => setMode("tutorial")}
          className="text-gray-500 hover:text-white text-sm mb-4"
        >
          ← Volver
        </button>
        <h2 className="text-3xl font-black text-white">
          Ejemplo <span className="text-purple-400">Completo</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Tu Petición (Español)
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {completeExample.userPrompt}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Prompt Generado (Inglés)
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {completeExample.aiPrompt}
            </p>
            <button
              onClick={() => copy(completeExample.finalCommand)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copiar Prompt
            </button>
          </div>

          <button
            onClick={() => setMode("practice")}
            className="w-full py-4 border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl"
          >
            ¡Intentarlo yo!
          </button>
        </div>
      </div>
    </div>
  );

  const PracticeScreen = React.memo(() => {
    const fields = [
      {
        label: "1. ROL",
        placeholder: "Ej: Fotógrafo de National Geographic...",
        color: "purple",
      },
      {
        label: "2. OBJETIVO",
        placeholder: "Ej: Campaña Instagram...",
        color: "pink",
      },
      {
        label: "3. ESCENA + EMOCIÓN",
        placeholder: "Ej: Playa Tailandia, libertad...",
        color: "purple",
      },
      {
        label: "4. ESTILO",
        placeholder: "Ej: Golden hour, vibrante...",
        color: "pink",
      },
      {
        label: "5. SALIDA",
        placeholder: "Ej: Prompt en inglés...",
        color: "purple",
      },
    ];

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMode("intro")}
            className="text-gray-500 hover:text-white text-sm"
          >
            Cancelar
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Tu Turno</h2>
          <p className="text-gray-400 text-sm mt-2">Completa los 5 elementos</p>
        </div>

        <div className="space-y-6">
          {fields.map((f, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
            >
              <label
                className={`text-${f.color}-400 text-sm font-bold mb-2 block`}
              >
                {f.label}
              </label>
              <textarea
                rows={2}
                className="w-full bg-black/30 border border-gray-800 rounded-xl p-3 text-white placeholder:text-gray-700 focus:border-purple-500 outline-none resize-none"
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg">
            Generar Prompt
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-900 to-purple-900 text-white p-4 md:p-8">
      {mode === "intro" && <IntroScreen />}
      {mode === "tutorial" && <TutorialScreen />}
      {mode === "example" && <ExampleScreen />}
      {mode === "practice" && <PracticeScreen />}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};
