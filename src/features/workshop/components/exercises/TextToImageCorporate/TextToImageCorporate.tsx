/**
 * @file TextToImageCorporate.tsx
 * @description Ejercicio Text-to-Image: Fotografía Corporativa
 * Self-contained component - Corporate/Executive theme (Blue/Emerald)
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
  Building2,
  User,
  Target,
  Palette,
  Box,
  Briefcase,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

export const TextToImageCorporate: React.FC = () => {
  const [mode, setMode] = useState("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const { copied, copy } = useCopyToClipboard();

  // DATOS: Tema Corporate (Slate/Blue/Emerald)
  const tutorialSteps = [
    {
      num: 1,
      subtitle: "ROL",
      title: "Paso 1: El Profesional",
      icon: <Camera className="w-6 h-6" />,
      question: "¿Quién eres?",
      explanation:
        'Para fotos corporativas, necesitas un "Fotógrafo de Negocios" o "Corporate Photographer".',
      example:
        "Actúa como un fotógrafo corporativo especializado en retratos ejecutivos para Fortune 500.",
      color: "blue",
      tip: "Esto asegura profesionalismo y credibilidad visual.",
    },
    {
      num: 2,
      subtitle: "OBJETIVO",
      title: "Paso 2: El Canal",
      icon: <Target className="w-6 h-6" />,
      question: "¿Dónde se usará?",
      explanation:
        "El contexto corporativo define la composición. LinkedIn requiere formato diferente a un banner web.",
      example:
        "Imagen de perfil profesional para LinkedIn y página web corporativa, sección liderazgo.",
      color: "emerald",
      tip: 'Mencionar "LinkedIn" ajusta automáticamente el encuadre y formato.',
    },
    {
      num: 3,
      subtitle: "ESCENA + EMOCIÓN",
      title: "Paso 3: El Entorno",
      icon: <Briefcase className="w-6 h-6" />,
      question: "¿Qué ambiente profesional?",
      explanation:
        "Describe la oficina moderna y la emoción de liderazgo + confianza que debe proyectar.",
      example:
        "Ejecutiva joven liderando reunión estratégica en sala de juntas moderna con ventanales. Emoción: Liderazgo + Confianza.",
      color: "blue",
      tip: "Detalla el fondo (ventanales, ciudad) para dar autoridad visual.",
    },
    {
      num: 4,
      subtitle: "ESTILO",
      title: "Paso 4: La Técnica",
      icon: <Palette className="w-6 h-6" />,
      question: "¿Cómo debe verse técnicamente?",
      explanation:
        "Define iluminación profesional, profundidad de campo y calidad premium tipo revista.",
      example:
        "Fotografía stock premium, iluminación natural suave, profundidad de campo selectiva, composición balanceada.",
      color: "emerald",
      tip: 'Pide "Shallow depth of field" para desenfoque profesional del fondo.',
    },
    {
      num: 5,
      subtitle: "SALIDA",
      title: "Paso 5: Los Specs",
      icon: <Box className="w-6 h-6" />,
      question: "¿Qué formato necesitas?",
      explanation:
        "Especifica formato cuadrado 1:1 para LinkedIn, colores neutros corporativos, alta resolución.",
      example:
        "Prompt en inglés optimizado para Midjourney v6, formato 1:1 LinkedIn, paleta neutra profesional.",
      color: "blue",
      tip: "El inglés técnico maximiza la calidad en todas las IAs.",
    },
  ];

  const completeExample = {
    userPrompt: `ChatGPT, actúa como un fotógrafo corporativo de lujo especializado en retratos ejecutivos (ROL).

Necesito una imagen para la página web corporativa de una consultora, sección liderazgo (OBJETIVO).

Escena: Ejecutiva joven liderando reunión estratégica en sala de juntas moderna con ventanales panorámicos. Colegas al fondo escuchando atentos.
Emoción: Confianza absoluta, liderazgo natural, credibilidad empresarial (ESCENA + EMOCIÓN).

Estilo: Fotografía stock premium con iluminación profesional suave, profundidad de campo selectiva (sujeto nítido), composición equilibrada, colores neutros corporativos (ESTILO).

Salida: Prompt técnico en inglés para Midjourney v6, formato cuadrado 1:1 para LinkedIn (SALIDA).`,

    aiPrompt: `Confident young female executive leading strategic meeting in modern glass conference room, professional business attire navy blue, natural window light from floor-to-ceiling glass walls, soft professional lighting setup, shallow depth of field with subject in sharp focus, blurred colleagues in background listening attentively, contemporary corporate office setting, neutral color palette slate and blue, executive presence and leadership, business authority concept, premium stock photography style, clean composition with negative space, professional credibility, 1:1 square aspect ratio for LinkedIn, photorealistic corporate branding --ar 1:1 --v 6 --style raw --q 2`,

    finalCommand: `Create an image: Confident young female executive leading strategic meeting...`,
  };

  // --- SCREENS ---

  const IntroScreen = () => (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-blue-300 text-sm font-semibold tracking-wide">
          <Building2 className="w-4 h-4" />
          🏢 TEXT TO IMAGE: CORPORATE
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Fotografía <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Profesional
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Crea imágenes corporativas que transmitan liderazgo y confianza
          absoluta.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tutorialSteps.map((s, i) => (
          <div
            key={i}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex flex-col items-center text-center gap-2"
          >
            <div className="text-blue-400">{s.icon}</div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              {s.subtitle}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <button
          onClick={() => setMode("tutorial")}
          className="group bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg border border-slate-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <div className="text-left">
              <div className="text-sm font-normal text-slate-400">Aprender</div>
              Ver los 5 Pasos
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setMode("practice")}
          className="group bg-blue-600 hover:bg-blue-500 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="text-sm font-normal text-blue-200">Practicar</div>
              Crear mi Prompt
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
      blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
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
                className={`h-1.5 w-8 rounded-full transition-all ${idx === currentStep ? "bg-blue-500" : "bg-gray-700"}`}
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

            <div className="bg-black/30 rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-bold uppercase">
                  💡 Ejemplo Corporate:
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
              {isLast ? "Ver Resultado" : "Siguiente"}
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
          Estructura <span className="text-blue-500">Completa</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Tu Petición (5 Partes)
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {completeExample.userPrompt}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Resultado IA
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {completeExample.aiPrompt}
            </p>
            <button
              onClick={() => copy(completeExample.finalCommand)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
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
            ¡Quiero intentarlo!
          </button>
        </div>
      </div>
    </div>
  );

  const PracticeScreen = React.memo(() => {
    const fields = [
      {
        label: "1. ROL",
        placeholder: "Ej: Fotógrafo corporativo Fortune 500...",
        color: "blue",
      },
      {
        label: "2. OBJETIVO",
        placeholder: "Ej: LinkedIn, web corporativa...",
        color: "emerald",
      },
      {
        label: "3. ESCENA + EMOCIÓN",
        placeholder: "Ej: Oficina moderna, liderazgo...",
        color: "blue",
      },
      {
        label: "4. ESTILO",
        placeholder: "Ej: Stock premium, bokeh...",
        color: "emerald",
      },
      {
        label: "5. SALIDA",
        placeholder: "Ej: Prompt inglés, 1:1...",
        color: "blue",
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
            Diseña tu Imagen Corporativa
          </h2>
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
                className="w-full bg-black/30 border border-gray-800 rounded-xl p-3 text-white placeholder:text-gray-700 focus:border-blue-500 outline-none resize-none"
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg">
            Generar Prompt Corporativo
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950 text-white p-4 md:p-8">
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
