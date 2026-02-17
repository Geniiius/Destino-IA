/**
 * @file TextToImageIntro.tsx
 * @description Ejercicio Text-to-Image: Trabajadores Remotos en Playa
 * Self-contained component - Beach/Remote Worker theme
 */

import React, { useState, useCallback } from "react";
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
  FileText,
  Eye,
  Send,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// --- DATOS GLOBALES ---

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  rol: User,
  objetivo: Target,
  escena: Sun,
  estilo: Palette,
  salida: FileText,
};

const FIELDS = [
  {
    key: "rol",
    label: "1. ROL",
    placeholder: "Ej: Fotógrafo de National Geographic...",
    color: "purple",
  },
  {
    key: "objetivo",
    label: "2. OBJETIVO",
    placeholder: "Ej: Campaña Instagram...",
    color: "pink",
  },
  {
    key: "escena",
    label: "3. ESCENA + EMOCIÓN",
    placeholder: "Ej: Playa Tailandia, libertad...",
    color: "purple",
  },
  {
    key: "estilo",
    label: "4. ESTILO",
    placeholder: "Ej: Golden hour, vibrante...",
    color: "pink",
  },
  {
    key: "salida",
    label: "5. SALIDA",
    placeholder: "Ej: Prompt en inglés...",
    color: "purple",
  },
];

interface PracticeScreenProps {
  answers: {
    rol: string;
    objetivo: string;
    escena: string;
    estilo: string;
    salida: string;
  };
  handleAnswerChange: (key: string, value: string) => void;
  handleSubmit: () => void;
  showResult: boolean;
  setMode: (mode: string) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({
  answers,
  handleAnswerChange,
  handleSubmit,
  showResult,
  setMode,
}) => {
  const isComplete = Object.values(answers).every((v) => v.trim().length > 0);
  const completedCount = Object.values(answers).filter(
    (v) => v.trim().length > 0,
  ).length;

  const { copied, copy } = useCopyToClipboard();
  const generatedPrompt = `Genérame y optimízame un prompt de alto impacto con estas especificaciones:\nActúa como ${answers.rol}.\nObjetivo: ${answers.objetivo}.\nEscena/Contexto: ${answers.escena}.\nEstilo visual: ${answers.estilo}.\nFormato de salida: ${answers.salida}.`;

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in lg:h-[calc(100vh-4rem)] lg:flex lg:items-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-8 shadow-2xl w-full lg:overflow-hidden">
          {/* Header */}
          <div className="text-center mb-4 lg:mb-3">
            <div className="text-4xl lg:text-3xl mb-2 lg:mb-1">🎉</div>
            <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ¡Ejercicio Completado!
            </h1>
            <p className="text-sm lg:text-xs text-gray-400">
              Tu prompt está listo. Solo falta copiarlo y pegarlo.
            </p>
          </div>

          {/* Prompt Block */}
          <div className="bg-black/30 rounded-2xl border border-purple-500/30 mb-4 lg:mb-3 overflow-hidden">
            <div className="bg-purple-500/10 px-4 py-2 border-b border-purple-500/20 flex items-center justify-between">
              <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">Tu Prompt Completo</span>
              <span className="text-purple-400/60 text-[10px]">Listo para copiar</span>
            </div>
            <div className="p-4 lg:p-3 lg:max-h-[18vh] lg:overflow-y-auto">
              <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm lg:text-[13px]">{generatedPrompt}</p>
            </div>
          </div>

          {/* CTA Copy Button */}
          <button
            onClick={() => copy(generatedPrompt)}
            className={`w-full py-3 lg:py-2.5 rounded-xl font-bold text-base lg:text-sm flex items-center justify-center gap-3 transition-all duration-300 mb-4 lg:mb-3 ${
              copied
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {copied ? "✅  ¡Copiado al portapapeles!" : "📋  Copiar Prompt Completo"}
          </button>

          {/* Steps Guide */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 lg:p-3">
            <p className="text-white font-bold mb-3 lg:mb-2 text-center text-base lg:text-sm">📌 Sigue estos 3 pasos:</p>
            <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
              {/* Step 1 */}
              <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 lg:p-3 lg:text-center">
                <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-purple-500/40">
                  1
                </div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="text-purple-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">📋 Copia tu prompt</p>
                  <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Haz clic en el botón morado. Se copia <span className="text-purple-300 font-medium">todo el bloque</span>, incluyendo la instrucción para ChatGPT.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 lg:p-3 lg:text-center">
                <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-emerald-500/40">
                  2
                </div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="text-emerald-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🤖 Pégalo en ChatGPT</p>
                  <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Abre <span className="text-emerald-300 font-medium">ChatGPT</span>, pega y envía. Te generará un <span className="text-emerald-300 font-medium">prompt profesional</span>.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 lg:p-3 lg:text-center">
                <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-pink-500/40">
                  3
                </div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="text-pink-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🎨 Genera tu imagen</p>
                  <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Escribe: <span className="text-pink-300 font-semibold">"Créame esta imagen:"</span> y pega el prompt de ChatGPT.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit button */}
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
  }

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
      iconBg: "bg-purple-500",
      labelColor: "text-purple-700",
      cardBg: "bg-purple-50",
      filledBg: "bg-purple-100",
      cardBorder: "border-purple-200",
      focusRing: "focus:ring-purple-400",
    },
    objetivo: {
      iconBg: "bg-pink-500",
      labelColor: "text-pink-700",
      cardBg: "bg-pink-50",
      filledBg: "bg-pink-100",
      cardBorder: "border-pink-200",
      focusRing: "focus:ring-pink-400",
    },
    escena: {
      iconBg: "bg-amber-500",
      labelColor: "text-amber-700",
      cardBg: "bg-amber-50",
      filledBg: "bg-amber-100",
      cardBorder: "border-amber-200",
      focusRing: "focus:ring-amber-400",
    },
    estilo: {
      iconBg: "bg-rose-500",
      labelColor: "text-rose-700",
      cardBg: "bg-rose-50",
      filledBg: "bg-rose-100",
      cardBorder: "border-rose-200",
      focusRing: "focus:ring-rose-400",
    },
    salida: {
      iconBg: "bg-indigo-500",
      labelColor: "text-indigo-700",
      cardBg: "bg-indigo-50",
      filledBg: "bg-indigo-100",
      cardBorder: "border-indigo-200",
      focusRing: "focus:ring-indigo-400",
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 animate-fade-in">
      {/* Main light card */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(245,240,255,0.95) 50%, rgba(255,240,248,0.95) 100%)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400" />

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
                  <span className="text-3xl">🏖️</span>
                  Diseña tu Escena de Playa
                  <span className="text-sm font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {completedCount}/{FIELDS.length}
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex gap-1.5">
              {FIELDS.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-2.5 rounded-full transition-all duration-300 ${
                    index < completedCount
                      ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Field grid */}
        <div className="px-8 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map((f) => {
            const value = answers[f.key as keyof typeof answers];
            const isFilled = value.trim().length > 0;
            const s = fieldStyles[f.key] ?? fieldStyles.rol;
            if (!s) return null;
            const Icon = ICON_MAP[f.key] || Sparkles;

            return (
              <div
                key={f.key}
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
                    {f.label}
                  </span>
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleAnswerChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${s.focusRing} focus:border-transparent transition-all duration-200 shadow-sm`}
                />
              </div>
            );
          })}
        </div>

        {/* Vista Previa */}
        <div className="px-8 pb-6">
          <div className="flex items-start gap-4 rounded-2xl p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-md flex-shrink-0">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-extrabold text-purple-700 uppercase tracking-widest mb-1">
                Vista Previa
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed truncate">
                {isComplete
                  ? `Actúa como ${answers.rol}. ${answers.objetivo}. ${answers.escena}. Estilo: ${answers.estilo}. ${answers.salida}.`
                  : "Actúa como... La escena es..."}
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="px-8 pb-7 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`group flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white text-base transition-all duration-300 ${
              isComplete
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 hover:scale-[1.03] hover:shadow-xl shadow-lg shadow-purple-500/25"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Generar Prompt</span>
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
};

export const TextToImageIntro: React.FC = () => {
  const [mode, setMode] = useState("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState({
    rol: "",
    objetivo: "",
    escena: "",
    estilo: "",
    salida: "",
  });
  const { copied, copy } = useCopyToClipboard();

  const handleAnswerChange = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const isComplete = Object.values(answers).every((v) => v.trim().length > 0);
    if (isComplete) {
      setShowResult(true);
    }
  }, [answers]);

  const handleSetMode = useCallback((newMode: string) => {
    if (newMode === "practice") {
      setShowResult(false);
    }
    setMode(newMode);
  }, []);

  // DATOS: Tema Workers (Purple/Pink)
  const tutorialSteps = [
    {
      num: 1,
      subtitle: "ROL",
      title: "Paso 1: El Experto",
      icon: <Camera className="w-6 h-6" />,
      question: "¿Quién toma la foto?",
      explanation:
        "No es lo mismo un 'Turista con iPhone' que un 'Fotógrafo de National Geographic'. El rol define la calidad.",
      example:
        "Actúa como un fotógrafo profesional de viajes de National Geographic.",
      color: "purple",
      tip: "Define la autoridad y el 'ojo' artístico. IAs como Midjourney lo aman.",
    },
    {
      num: 2,
      subtitle: "OBJETIVO",
      title: "Paso 2: El Propósito",
      icon: <Target className="w-6 h-6" />,
      question: "¿Para qué es la imagen?",
      explanation:
        "Define si es para vender, inspirar o informar. Esto ajusta la composición.",
      example:
        "Crear una imagen aspiracional para una campaña de Instagram sobre nómadas digitales.",
      color: "pink",
      tip: "Mencionar 'Instagram' suele generar formatos más atractivos y saturados.",
    },
    {
      num: 3,
      subtitle: "ESCENA + EMOCIÓN",
      title: "Paso 3: El Ambiente",
      icon: <Sun className="w-6 h-6" />,
      question: "¿Qué lugar y qué feeling?",
      explanation:
        "Describe el entorno físico y la emoción abstracta que debe transmitir.",
      example:
        "Playa paradisíaca en Tailandia al atardecer, persona trabajando con laptop en hamaca. Emoción: Libertad y paz financiera.",
      color: "purple",
      tip: "Sé específico con el lugar (Tailandia vs Playa) para mejores detalles.",
    },
    {
      num: 4,
      subtitle: "ESTILO",
      title: "Paso 4: La Estética",
      icon: <Palette className="w-6 h-6" />,
      question: "¿Cómo se ve visualmente?",
      explanation:
        "Iluminación, colores y estilo artístico. ¿Es realista? ¿Es ilustración 3D?",
      example:
        "Fotografía golden hour (hora dorada), colores cálidos y vibrantes, alta definición 8k, estilo travel blogger.",
      color: "pink",
      tip: "Palabras clave: 'Golden hour', 'Vibrant', 'Photo-realistic'.",
    },
    {
      num: 5,
      subtitle: "SALIDA",
      title: "Paso 5: El Formato",
      icon: <Box className="w-6 h-6" />,
      question: "¿Qué me entregas?",
      explanation:
        "Pide el prompt técnico en inglés. Las mejores IAs de imagen funcionan mejor en inglés.",
      example:
        "Dame solo el prompt en inglés optimizado para Midjourney v6. Sin explicaciones extra.",
      color: "purple",
      tip: "El inglés es el idioma nativo de la generación de imágenes.",
    },
  ];

  const completeExample = {
    userPrompt: `ChatGPT, actúa como un fotógrafo profesional de National Geographic (ROL).

Obtén una imagen aspiracional para una campaña de Instagram sobre trabajadores remotos (OBJETIVO).

Escena: Playa paradisíaca de arena blanca en Tailandia, hora dorada. Un joven profesional trabaja relajado en una hamaca con su laptop, cóctel al lado.
Emoción: Libertad absoluta, paz, éxito sin estrés (ESCENA + EMOCIÓN).

Estilo: Fotografía de viaje premiada, iluminación cálida de atardecer, colores turquesa y naranja vibrantes, enfoque nítido en el sujeto, fondo bokeh suave (ESTILO).

Salida: Prompt técnico detallado en inglés para Midjourney v6 (SALIDA).`,

    aiPrompt: `Young digital nomad working on laptop in a hammock between palm trees on a pristine white sand beach in Thailand during golden hour, turquoise ocean in background, tropical cocktail on side table, warm sunset lighting, relaxed and successful atmosphere, award-winning travel photography style, vibrant orange and teal color grading, sharp focus on subject, soft bokeh background, high resolution, 8k, inspirational Instagram aesthetic --ar 4:5 --v 6 --style raw`,

    finalCommand: `Imagine prompt: Young digital nomad working on laptop...`,
  };

  // --- SCREENS ---

  const IntroScreen = () => (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500 text-purple-300 text-sm font-semibold tracking-wide shadow-sm shadow-purple-500/20">
          <Terminal className="w-4 h-4" />
          BASICS: TEXT TO IMAGE
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Crea Imágenes <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
            Increíbles con IA
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Aprende la estructura de 5 pasos para pedirle a ChatGPT los mejores
          prompts para Midjourney, Dall-E 3 o Ideogram.
        </p>
      </div>

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
          className="group bg-purple-900/40 hover:bg-purple-900/60 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg border border-purple-500/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-pink-400" />
            <div className="text-left">
              <div className="text-sm font-normal text-purple-300">
                Aprender
              </div>
              Ver los 5 Pasos
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setMode("practice")}
          className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-purple-900/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <div className="text-left">
              <div className="text-sm font-normal text-pink-200">Practicar</div>
              Crear mi Primer Prompt
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const TutorialScreen = () => {
    const step = tutorialSteps[currentStep];
    if (!step) return null;
    const isLast = currentStep === tutorialSteps.length - 1;

    const colors: Record<string, string> = {
      purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    };
    const currentTheme =
      colors[step.color] ??
      "text-purple-400 bg-purple-500/10 border-purple-500/20";

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
                className={`h-1.5 w-8 rounded-full transition-all ${idx === currentStep ? "bg-pink-500" : "bg-gray-800"}`}
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
              {step.icon} PASO {step.num}: {step.subtitle}
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Prompt Perfecto
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Tu Petición a ChatGPT
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {completeExample.userPrompt}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Lo que ChatGPT te da
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
            ¡Quiero intentarlo!
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950 text-white p-4 md:p-8">
      {mode === "intro" && <IntroScreen />}
      {mode === "tutorial" && <TutorialScreen />}
      {mode === "example" && <ExampleScreen />}
      {mode === "practice" && (
        <PracticeScreen
          answers={answers}
          handleAnswerChange={handleAnswerChange}
          handleSubmit={handleSubmit}
          showResult={showResult}
          setMode={handleSetMode}
        />
      )}

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
