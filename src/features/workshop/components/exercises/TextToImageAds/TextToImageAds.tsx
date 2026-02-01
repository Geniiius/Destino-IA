/**
 * @file TextToImageAds.tsx
 * @description Ejercicio Text-to-Image: Publicidad Nocturna
 * Self-contained component - Nightlife/Urban Ads theme (Indigo/Fuchsia/Violet)
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
  Moon,
  User,
  Target,
  Palette,
  Box,
  Layers,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

export const TextToImageAds: React.FC = () => {
  const [mode, setMode] = useState("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const { copied, copy } = useCopyToClipboard();

  // DATOS: Tema Ads Nocturno (Indigo/Fuchsia/Violet)
  const tutorialSteps = [
    {
      num: 1,
      subtitle: "ROL",
      title: "Paso 1: El Creativo",
      icon: <Camera className="w-6 h-6" />,
      question: "¿Quién eres?",
      explanation:
        'Ya no eres fotógrafo, eres un "Director Creativo Publicitario". Buscas venta, no solo arte.',
      example:
        "Actúa como un director creativo especializado en publicidad digital para experiencias urbanas nocturnas.",
      color: "indigo",
      tip: "Este rol prioriza la composición comercial que convierte.",
    },
    {
      num: 2,
      subtitle: "OBJETIVO",
      title: "Paso 2: El Canal Publicitario",
      icon: <Target className="w-6 h-6" />,
      question: "¿Dónde se publicará el ad?",
      explanation:
        "Es un anuncio (Ads). Necesita detener el scroll y dejar espacio para el texto (Copy).",
      example:
        "Crear anuncio para Instagram Stories promocionando tours nocturnos por la ciudad.",
      color: "fuchsia",
      tip: "Formato vertical Stories vs cuadrado Feed cambia TODO.",
    },
    {
      num: 3,
      subtitle: "ESCENA + EMOCIÓN",
      title: "Paso 3: La Escena Urbana",
      icon: <Moon className="w-6 h-6" />,
      question: "¿Qué ciudad nocturna?",
      explanation:
        "Pinta la ciudad nocturna + la energía vibrante. Neones, luces, movimiento, vida urbana.",
      example:
        "Joven viajero en rooftop con vista ciudad neón → Aventura + Libertad + FOMO.",
      color: "violet",
      tip: 'Detalla: "Neon lights", "Urban energy", "Nightlife vibes".',
    },
    {
      num: 4,
      subtitle: "ESTILO",
      title: "Paso 4: La Estética Publicitaria",
      icon: <Layers className="w-6 h-6" />,
      question: "¿Qué estética publicitaria?",
      explanation:
        '⚠️ CRÍTICO: Pide "Espacio Negativo" (cielo limpio) para poner luego tu texto en Canva.',
      example:
        "Estilo cinematográfico colores neón vibrantes, composición con cielo oscuro espacio para CTA.",
      color: "cyan",
      tip: '¡Vital! Pide "Clean negative space at the top for typography".',
    },
    {
      num: 5,
      subtitle: "SALIDA",
      title: "Paso 5: Los Specs Ads",
      icon: <Box className="w-6 h-6" />,
      question: "¿Qué formato?",
      explanation:
        "Pide la imagen base limpia (sin texto generado por IA) para tener control total en post-producción.",
      example:
        "Prompt inglés optimizado para Midjourney v6, formato vertical 9:16 Stories, espacio negativo superior.",
      color: "pink",
      tip: "Las IAs fallan deletreando. Mejor genera la imagen limpia y añade texto en Canva.",
    },
  ];

  const completeExample = {
    userPrompt: `ChatGPT, actúa como un director creativo especializado en publicidad digital para experiencias urbanas nocturnas (ROL).

Necesito crear anuncio para Instagram Stories promocionando tours nocturnos por la ciudad con espacio superior para texto CTA (OBJETIVO).

Escena: Joven viajero en rooftop bar con ciudad iluminada luces de neón al fondo, tráfico nocturno con estelas de luz, rascacielos brillantes.
Emoción: Energía urbana vibrante, aventura nocturna irresistible, dinamismo puro, diversión y sofisticación moderna, FOMO (fear of missing out) (ESCENA + EMOCIÓN).

Estilo: Estilo cinematográfico publicitario con colores saturados vibrantes neón, iluminación dramática tipo cyberpunk, composición dinámica vertical con cielo oscuro superior para overlay de texto (ESTILO).

Salida: Prompt técnico inglés Midjourney v6, formato vertical 9:16 Stories, paleta neón alta saturación, espacio negativo superior (SALIDA).`,

    aiPrompt: `Young traveler on rooftop bar overlooking neon-lit city skyline at night, vibrant urban nightlife energy, dramatic neon lighting purple and pink tones, light trails from traffic below, skyscrapers with glowing windows, cinematic advertising photography style, high color saturation cyberpunk-inspired atmosphere, dynamic vertical composition with dark sky top third for text overlay, bokeh effect with blurred city lights, modern sophisticated vibe, adventure and excitement emotion, energetic urban lifestyle concept, FOMO-inducing visual, 9:16 vertical format for Instagram Stories --ar 9:16 --v 6 --style raw --q 2 --s 750`,

    finalCommand: `Create an image: Young traveler on rooftop bar overlooking neon-lit city skyline...`,
  };

  // --- SCREENS ---

  const IntroScreen = () => (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-500 text-indigo-300 text-sm font-semibold tracking-wide shadow-sm shadow-indigo-500/20">
          <Moon className="w-4 h-4" />
          🌃 TEXT TO IMAGE: ADS
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Domina la Publicidad <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
            Visual Nocturna
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Aprende a generar la "Imagen Base" perfecta para tus anuncios urbanos
          nocturnos.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tutorialSteps.map((s, i) => (
          <div
            key={i}
            className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2"
          >
            <div className="text-indigo-400">{s.icon}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {s.subtitle}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <button
          onClick={() => setMode("tutorial")}
          className="group bg-indigo-900/40 hover:bg-indigo-900/60 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg border border-indigo-500/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-fuchsia-400" />
            <div className="text-left">
              <div className="text-sm font-normal text-indigo-300">
                Estrategia
              </div>
              Ver los 5 Pasos
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setMode("practice")}
          className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-purple-900/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="text-sm font-normal text-purple-200">
                Workshop
              </div>
              Crear mi Anuncio
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
      indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
      violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
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
                className={`h-1.5 w-8 rounded-full transition-all ${idx === currentStep ? "bg-fuchsia-500" : "bg-gray-800"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div
            className={`p-8 border-b ${currentTheme.split(" ")[1]} ${currentTheme.split(" ")[2]}`}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border ${currentTheme}`}
            >
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

            <div className="bg-black/40 rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-bold uppercase">
                  💡 Ejemplo Nocturno:
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

            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-950/50 p-3 rounded-lg">
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
              {isLast ? "Ver Prompt Final" : "Siguiente"}
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
          Estructura del{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">
            Anuncio
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Tu Petición (Estrategia)
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {completeExample.userPrompt}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Prompt Generado (Imagen Base)
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {completeExample.aiPrompt}
            </p>
            <button
              onClick={() => copy(completeExample.finalCommand)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
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
            ¡Crear mi propio anuncio!
          </button>
        </div>
      </div>
    </div>
  );

  const PracticeScreen = React.memo(() => {
    const fields = [
      {
        label: "1. ROL",
        placeholder: "Ej: Director Creativo Agencia Digital...",
        color: "indigo",
      },
      {
        label: "2. OBJETIVO",
        placeholder: "Ej: Stories, paquete fiesta...",
        color: "fuchsia",
      },
      {
        label: "3. ESCENA + EMOCIÓN",
        placeholder: "Ej: Luces Tokio, FOMO...",
        color: "violet",
      },
      {
        label: "4. ESTILO",
        placeholder: "Ej: Vertical, bokeh, espacio arriba...",
        color: "cyan",
      },
      {
        label: "5. SALIDA",
        placeholder: "Ej: Prompt inglés, 9:16...",
        color: "pink",
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
          <h2 className="text-3xl font-bold text-white">
            Workshop: Anuncio Nocturno
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Recuerda: Estás creando la imagen de fondo para un anuncio con
            texto.
          </p>
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
                className="w-full bg-black/30 border border-gray-800 rounded-xl p-3 text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none resize-none"
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20">
            Generar Prompt de Anuncio
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-fuchsia-900 to-violet-950 text-white p-4 md:p-8">
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
