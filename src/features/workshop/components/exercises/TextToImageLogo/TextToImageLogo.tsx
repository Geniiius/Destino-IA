/**
 * @file TextToImageLogo.tsx
 * @description Ejercicio Text-to-Image: Integración de Logo
 * Self-contained component - Branding theme (Rose/Orange)
 */

import React, { useState, useCallback } from "react";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  Copy,
  ChevronLeft,
  Stamp,
  Upload,
  Layers,
  Box,
  Palette,
  Camera,
  Target,
  Image as ImageIcon,
  ScanFace,
  BookOpen,
  Rocket,
  User,
  Eye,
  Send,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// --- DATOS GLOBALES ---

// Mapeo de iconos para PracticeScreen
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  rol: User,
  obj: Target,
  esc: ImageIcon,
  int: Layers,
  est: Palette,
  sal: Box,
};

const tutorialSteps = [
  {
    num: 1,
    subtitle: "ROL / PERSPECTIVA",
    title: "¿Quién cuenta la historia?",
    icon: <Camera className="w-6 h-6" />,
    question: "Define la autoridad",
    explanation:
      "Define quién interactúa con la escena o desde qué perspectiva experta se crea.",
    example: "Ej: Brand Strategist, Agente de Viajes, Fotógrafo de Producto.",
    color: "indigo",
    tip: "El rol define la calidad y el enfoque de la toma.",
  },
  {
    num: 2,
    subtitle: "OBJETIVO / PROPÓSITO",
    title: "¿Qué buscas lograr?",
    icon: <Target className="w-6 h-6" />,
    question: "La meta de la imagen",
    explanation:
      "Explicar qué se busca lograr con la imagen (venta, viralidad, branding).",
    example: "Ej: Promocionar la marca destacando su logo de forma elegante.",
    color: "emerald",
    tip: "Ayuda a la IA a entender si debe ser sutil o agresiva.",
  },
  {
    num: 3,
    subtitle: "ESCENA + ENTORNO",
    title: "Contexto y Emoción",
    icon: <ImageIcon className="w-6 h-6" />,
    question: "¿Dónde está el objeto?",
    explanation:
      "Incluir contexto, atmósfera y estado de ánimo donde el logo debe aparecer.",
    example:
      "Ej: Oficina moderna con grandes ventanales, luz cálida al atardecer.",
    color: "amber",
    tip: "La iluminación de la escena afectará a cómo se ilumina tu logo.",
  },
  {
    num: 4,
    subtitle: "DETALLES DE INTEGRACIÓN",
    title: "El Logo en el Objeto",
    icon: <Layers className="w-6 h-6" />,
    question: "Ubicación y Realismo",
    explanation:
      "CRUCIAL: Define dónde va el logo y cómo se comporta (material, relieve, impresión).",
    example:
      "Ubicación: Pared de vidrio y taza. Protagonismo: Medio. Respetar colores.",
    color: "rose",
    tip: 'Usa palabras como "Embossed" (relieve), "Printed on" (impreso en), "Stitched" (bordado).',
  },
  {
    num: 5,
    subtitle: "ESTILO VISUAL",
    title: "Estética General",
    icon: <Palette className="w-6 h-6" />,
    question: "Look & Feel",
    explanation: "Define la técnica fotográfica o artística.",
    example: "Premium, cinematográfico, lifestyle corporativo, enfoque nítido.",
    color: "purple",
    tip: "Asegura la coherencia visual de la marca.",
  },
  {
    num: 6,
    subtitle: "SALIDA / FORMATO",
    title: "Especificaciones",
    icon: <Box className="w-6 h-6" />,
    question: "Formato final",
    explanation: "Indicar resolución, orientación y uso final esperado.",
    example: "Imagen horizontal para redes sociales, alta resolución.",
    color: "cyan",
    tip: "Fundamental para que el logo no quede cortado.",
  },
];

const completeExample = {
  userPrompt: `1️⃣ Rol: Brand strategist creando contenido visual.
2️⃣ Objetivo: Promocionar la marca en un entorno de lujo.
3️⃣ Escena: Oficina moderna, ventanales, atardecer, ambiente sofisticado.
4️⃣ Integración: Logo en pared de vidrio (fondo), en libreta y taza (primer plano) y pantalla de laptop. Protagonismo medio, colores exactos.
5️⃣ Estilo: Premium, cinematográfico, lifestyle corporativo.
6️⃣ Salida: Horizontal, alta resolución.`,

  aiPrompt: `A modern luxury office at sunset with large glass windows, warm natural light illuminating the space, a professional and sophisticated atmosphere conveying success and confidence. Integrate the brand logo realistically on a glass wall behind the desk, on a notebook and a coffee mug on the desk, and subtly on the laptop screen. The logo should be true to its exact colors, typography, shapes, and proportions. Medium prominence, visible but naturally integrated. Cinematic, premium lifestyle photography style, sharp focus, soft natural lighting, highly detailed, professional composition. Horizontal orientation, high-resolution image suitable for social media.`,

  finalCommand: `[SUBIR LOGO.PNG] + Prompt: A modern luxury office at sunset...`,
};

// --- SUB-COMPONENTES ---

interface IntroScreenProps {
  setMode: (mode: string) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ setMode }) => (
  <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-900/30 border border-rose-500/50 text-rose-300 text-sm font-semibold tracking-wide shadow-sm">
        <Stamp className="w-4 h-4" />
        EJERCICIO: INTEGRACIÓN DE BRANDING
      </div>

      <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
        Tu Logo <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400">
          En El Mundo Real
        </span>
      </h1>

      <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Aprende a integrar logos en objetos (merchandising, carteles, productos)
        respetando la física, la luz y la textura.
      </p>
    </div>

    {/* Concepto Clave Visual */}
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="text-rose-400" /> Física vs. Pegatina
          </h3>
          <div className="space-y-4">
            <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30 opacity-60">
              <div className="text-xs font-bold text-red-400 uppercase mb-1">
                ❌ ERROR COMÚN
              </div>
              <p className="text-gray-400 text-sm">
                "Pon mi logo en una taza." <br />
                (Resultado: Un sticker plano y falso).
              </p>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="text-gray-600 rotate-90 md:rotate-0" />
            </div>
            <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/30">
              <div className="text-xs font-bold text-green-400 uppercase mb-1">
                ✅ ESTRATEGIA PRO
              </div>
              <p className="text-white text-sm font-medium">
                "Integra el logo{" "}
                <span className="text-green-400">impreso en cerámica</span> con{" "}
                <span className="text-green-400">iluminación natural</span>."
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 text-center">
          <div className="bg-black/40 p-6 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-2">📤</div>
            <h4 className="text-white font-bold">Input Vital</h4>
            <p className="text-xs text-gray-400 mt-2">
              Para que sea TU marca,
              <br />
              <span className="text-rose-400 font-bold">
                debes subir el archivo del logo.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4 pt-4">
      <button
        onClick={() => setMode("tutorial")}
        className="group relative bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg border border-gray-700 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-rose-400" />
          <div className="text-left">
            <div className="text-sm font-normal text-gray-400">Aprender</div>
            Ver los 6 Pasos
          </div>
        </div>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <button
        onClick={() => setMode("practice")}
        className="group relative bg-rose-700 hover:bg-rose-600 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-rose-900/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-white" />
          <div className="text-left">
            <div className="text-sm font-normal text-rose-200">Práctica</div>
            Crear mi Mockup
          </div>
        </div>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

interface TutorialScreenProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setMode: (mode: string) => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({
  currentStep,
  setCurrentStep,
  setMode,
}) => {
  const step = tutorialSteps[currentStep];
  if (!step) return null;
  const isLast = currentStep === tutorialSteps.length - 1;

  // Mapa de colores
  const colors: Record<string, string> = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  };
  const currentTheme =
    colors[step.color] ??
    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className="max-w-3xl mx-auto animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMode("intro")}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex gap-1">
          {tutorialSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-6 rounded-full transition-all duration-300 ${idx === currentStep ? "bg-rose-500" : "bg-gray-800"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        <div
          className={`p-8 border-b ${currentTheme.split(" ")[1]} ${currentTheme.split(" ")[2]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 border ${currentTheme}`}
              >
                {step.icon} PASO {step.num}: {step.subtitle}
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                {step.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 flex-1">
          <div>
            <h3 className="text-xl text-white font-semibold mb-2">
              {step.question}
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {step.explanation}
            </p>
          </div>

          {/* TAG EJEMPLO */}
          <div className="bg-black/40 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                💡 Ejemplo Real:
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
            <ScanFace className="w-4 h-4" />
            {step.tip}
          </div>
        </div>

        <div className="p-6 bg-gray-950/50 border-t border-gray-800 flex justify-between items-center">
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
            className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            {isLast ? "Ver Prompt Completo" : "Siguiente"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExampleScreenProps {
  setMode: (mode: string) => void;
}

const ExampleScreen: React.FC<ExampleScreenProps> = ({ setMode }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-10">
        <button
          onClick={() => setMode("tutorial")}
          className="text-gray-500 hover:text-white text-sm mb-4"
        >
          ← Volver al tutorial
        </button>
        <h2 className="text-3xl font-black text-white">
          El Prompt <span className="text-rose-500">Integrado</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
            Tu Petición (Estrategia)
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {completeExample.userPrompt}
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
            Prompt para IA (Midjourney/Ideogram)
          </div>
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Layers className="w-12 h-12 text-rose-500" />
            </div>
            <p className="font-serif text-rose-100 leading-relaxed italic">
              "{completeExample.aiPrompt}"
            </p>

            {/* UPLOAD WARNING */}
            <div className="mt-4 p-4 bg-rose-900/20 border border-rose-500/30 rounded-xl flex gap-3 animate-pulse">
              <div className="shrink-0 pt-1">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
                  <Upload className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div>
                <div className="text-rose-300 font-bold text-xs uppercase tracking-wider mb-1">
                  Paso Crucial
                </div>
                <p className="text-sm text-rose-100/80 leading-snug">
                  Debes{" "}
                  <strong>subir tu archivo de logo (PNG sin fondo)</strong> a la
                  IA junto con este prompt para que sepa qué dibujar.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={() => copy(completeExample.aiPrompt)}
                className="w-full bg-rose-700 hover:bg-rose-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copiar Prompt
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setMode("practice");
            }}
            className="w-full py-4 border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl transition-all"
          >
            ¡Hacer mi propio mockup!
          </button>
        </div>
      </div>
    </div>
  );
};

const FIELDS = [
  {
    id: "rol",
    label: "ROL / PERSPECTIVA",
    desc: "¿Quién cuenta la historia?",
    ex: "Ej: Fotógrafo de Producto...",
    color: "indigo",
  },
  {
    id: "obj",
    label: "OBJETIVO",
    desc: "¿Qué buscas lograr?",
    ex: "Ej: Campaña de Instagram...",
    color: "emerald",
  },
  {
    id: "esc",
    label: "ESCENA + ENTORNO",
    desc: "¿Dónde está el objeto?",
    ex: "Ej: Mesa de madera, luz de mañana...",
    color: "amber",
  },
  {
    id: "int",
    label: "DETALLES DE INTEGRACIÓN",
    desc: "¿Dónde y cómo va el logo?",
    ex: "Ej: En la etiqueta, bordado, relieve...",
    color: "rose",
  },
  {
    id: "est",
    label: "ESTILO VISUAL",
    desc: "Look & Feel",
    ex: "Ej: Minimalista, macro, bokeh...",
    color: "purple",
  },
  {
    id: "sal",
    label: "SALIDA / FORMATO",
    desc: "Resolución y uso",
    ex: "Ej: Vertical para Stories, 4k...",
    color: "cyan",
  },
];

interface PracticeScreenProps {
  setMode: (mode: string) => void;
  onGenerate: (inputs: Record<string, string>) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = React.memo(
  ({ setMode, onGenerate }) => {
    const [inputs, setInputs] = useState({
      rol: "",
      obj: "",
      esc: "",
      int: "",
      est: "",
      sal: "",
    });

    const handleChange = (id: string, value: string) => {
      setInputs((prev) => ({ ...prev, [id]: value }));
    };

    const isComplete = Object.values(inputs).every((v) => v.trim().length > 0);
    const completedCount = Object.values(inputs).filter(
      (v) => v.trim().length > 0,
    ).length;

    // Light-theme per-field config
    const fieldStyles: Record<
      string,
      {
        iconBg: string;
        labelColor: string;
        cardBg: string;
        filledBg: string;
        cardBorder: string;
        focusRing: string;
      }
    > = {
      rol: {
        iconBg: "bg-indigo-500",
        labelColor: "text-indigo-700",
        cardBg: "bg-indigo-50",
        filledBg: "bg-indigo-100",
        cardBorder: "border-indigo-200",
        focusRing: "focus:ring-indigo-400",
      },
      obj: {
        iconBg: "bg-emerald-500",
        labelColor: "text-emerald-700",
        cardBg: "bg-emerald-50",
        filledBg: "bg-emerald-100",
        cardBorder: "border-emerald-200",
        focusRing: "focus:ring-emerald-400",
      },
      esc: {
        iconBg: "bg-amber-500",
        labelColor: "text-amber-700",
        cardBg: "bg-amber-50",
        filledBg: "bg-amber-100",
        cardBorder: "border-amber-200",
        focusRing: "focus:ring-amber-400",
      },
      int: {
        iconBg: "bg-rose-500",
        labelColor: "text-rose-700",
        cardBg: "bg-rose-50",
        filledBg: "bg-rose-100",
        cardBorder: "border-rose-200",
        focusRing: "focus:ring-rose-400",
      },
      est: {
        iconBg: "bg-purple-500",
        labelColor: "text-purple-700",
        cardBg: "bg-purple-50",
        filledBg: "bg-purple-100",
        cardBorder: "border-purple-200",
        focusRing: "focus:ring-purple-400",
      },
      sal: {
        iconBg: "bg-cyan-500",
        labelColor: "text-cyan-700",
        cardBg: "bg-cyan-50",
        filledBg: "bg-cyan-100",
        cardBorder: "border-cyan-200",
        focusRing: "focus:ring-cyan-400",
      },
    };

    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,245,248,0.95) 50%, rgba(255,248,240,0.95) 100%)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400" />

          {/* Header */}
          <div className="px-8 pt-7 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMode("intro")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                    <span className="text-3xl">🎨</span>
                    Define tu Integración
                    <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                      {completedCount}/{FIELDS.length}
                    </span>
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 hidden md:block">
                    Rellena los 6 pilares de branding
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {FIELDS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-5 h-2.5 rounded-full transition-all duration-300 ${
                      index < completedCount
                        ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Field grid */}
          <div className="px-8 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map((field) => {
              const value = inputs[field.id as keyof typeof inputs] || "";
              const isFilled = value.trim().length > 0;
              const s = fieldStyles[field.id] ?? fieldStyles.rol;
              if (!s) return null;
              const Icon = ICON_MAP[field.id] || Sparkles;

              return (
                <div
                  key={field.id}
                  className={`relative rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
                    isFilled
                      ? `${s.filledBg} ${s.cardBorder}`
                      : `${s.cardBg} border-transparent`
                  }`}
                >
                  {isFilled && (
                    <Sparkles
                      className={`absolute top-3 right-3 w-4 h-4 ${s.labelColor} opacity-60`}
                    />
                  )}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span
                      className={`text-xs font-extrabold uppercase tracking-widest ${s.labelColor}`}
                    >
                      {field.label}
                    </span>
                  </div>
                  <input
                    type="text"
                    id={field.id}
                    value={value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.ex}
                    className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${s.focusRing} focus:border-transparent transition-all duration-200 shadow-sm`}
                  />
                </div>
              );
            })}
          </div>

          {/* Vista Previa */}
          <div className="px-8 pb-6">
            <div className="flex items-start gap-4 rounded-2xl p-5 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-rose-700 uppercase tracking-widest mb-1">
                  Vista Previa
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed truncate">
                  {isComplete
                    ? `Rol: ${inputs.rol}. Objetivo: ${inputs.obj}. Escena: ${inputs.esc}. Integración: ${inputs.int}. Estilo: ${inputs.est}. Salida: ${inputs.sal}.`
                    : "Completa los 6 campos para generar el prompt perfecto."}
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="px-8 pb-7 flex justify-end">
            <button
              onClick={() => onGenerate(inputs)}
              disabled={!isComplete}
              className={`group flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white text-base transition-all duration-300 ${
                isComplete
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 hover:scale-[1.03] hover:shadow-xl shadow-lg shadow-rose-500/25"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Generar Prompt de Branding</span>
              <Send
                className={`w-5 h-5 ${isComplete ? "group-hover:translate-x-1" : ""} transition-transform`}
              />
            </button>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => setMode("intro")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors self-start px-2 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </button>
      </div>
    );
  },
);

// --- PANTALLA DE RESULTADO (NUEVA) ---
interface ResultScreenProps {
  generatedPrompt: string;
  setMode: (mode: string) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  generatedPrompt,
  setMode,
}) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in lg:h-[calc(100vh-4rem)] lg:flex lg:items-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-8 shadow-2xl w-full lg:overflow-hidden">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-3">
          <div className="inline-flex items-center justify-center p-3 lg:p-2 bg-green-500/20 rounded-full mb-2 lg:mb-1 border border-green-500/50">
            <Rocket className="w-6 h-6 lg:w-5 lg:h-5 text-green-400" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-2xl font-black text-white">
            ¡Tu Prompt está Listo!
          </h2>
          <p className="text-gray-400 mt-1 text-sm lg:text-xs">
            Solo falta copiarlo y pegarlo en ChatGPT.
          </p>
        </div>

        {/* Prompt Block */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative mb-4 lg:mb-3">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500"></div>
          <div className="bg-rose-500/5 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
            <span className="text-rose-300 text-xs font-semibold uppercase tracking-wider">Tu Prompt Completo</span>
            <span className="text-gray-500 text-[10px]">Listo para copiar</span>
          </div>
          <div className="p-4 lg:p-3 lg:max-h-[18vh] lg:overflow-y-auto">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm lg:text-[13px]">
              {generatedPrompt}
            </p>
          </div>
        </div>

        {/* CTA Copy Button */}
        <button
          onClick={() => copy(generatedPrompt)}
          className={`w-full py-3 lg:py-2.5 rounded-xl font-bold text-base lg:text-sm flex items-center justify-center gap-3 transition-all duration-300 mb-4 lg:mb-3 ${
            copied
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {copied ? (
            <><Check className="w-5 h-5" /> ¡Copiado al portapapeles!</>
          ) : (
            <><Copy className="w-5 h-5" /> Copiar Prompt Completo</>
          )}
        </button>

        {/* Steps Guide */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 lg:p-3">
          <p className="text-white font-bold mb-3 lg:mb-2 text-center text-base lg:text-sm">📌 Sigue estos 3 pasos:</p>
          <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
            <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 lg:text-center">
              <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-rose-500/40">1</div>
              <div className="pt-0.5 lg:pt-0">
                <p className="text-rose-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">📋 Copia tu prompt</p>
                <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Haz clic en el botón de arriba. Se copia <span className="text-rose-300 font-medium">todo el bloque</span>, incluyendo la instrucción para ChatGPT.</p>
              </div>
            </div>
            <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 lg:text-center">
              <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-emerald-500/40">2</div>
              <div className="pt-0.5 lg:pt-0">
                <p className="text-emerald-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🤖 Pégalo en ChatGPT</p>
                <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Abre <span className="text-emerald-300 font-medium">ChatGPT</span>, pega y envía. Te generará un <span className="text-emerald-300 font-medium">prompt profesional</span>.</p>
              </div>
            </div>
            <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 lg:text-center">
              <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-orange-500/40">3</div>
              <div className="pt-0.5 lg:pt-0">
                <p className="text-orange-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🎨 Genera tu imagen</p>
                <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Escribe: <span className="text-orange-300 font-semibold">"Créame esta imagen:"</span> y pega el prompt de ChatGPT.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-2 flex justify-center">
          <button
            onClick={() => setMode("practice")}
            className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-gray-400 hover:text-white text-xs"
          >
            ← Volver a editar
          </button>
        </div>
      </div>
    </div>
  );
};

export const TextToImageLogo: React.FC = () => {
  const [mode, setMode] = useState("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [finalPrompt, setFinalPrompt] = useState("");

  const handleGenerate = useCallback((inputs: Record<string, string>) => {
    // Lógica de construcción del prompt
    const prompt = `Genérame y optimízame un prompt de alto impacto con estas especificaciones:
Role: ${inputs.rol}
Objective: ${inputs.obj}
Scene/Context: ${inputs.esc}
Integration Details: ${inputs.int}
Visual Style: ${inputs.est}
Output Format: ${inputs.sal}`;

    setFinalPrompt(prompt);
    setMode("result");
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-br from-rose-950 via-gray-900 to-purple-950 text-white p-4 md:p-8 font-sans selection:bg-rose-500/30">
      {mode === "intro" && <IntroScreen setMode={setMode} />}
      {mode === "tutorial" && (
        <TutorialScreen
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setMode={setMode}
        />
      )}
      {mode === "example" && <ExampleScreen setMode={setMode} />}
      {mode === "practice" && (
        <PracticeScreen setMode={setMode} onGenerate={handleGenerate} />
      )}
      {mode === "result" && (
        <ResultScreen generatedPrompt={finalPrompt} setMode={setMode} />
      )}
    </div>
  );
};
