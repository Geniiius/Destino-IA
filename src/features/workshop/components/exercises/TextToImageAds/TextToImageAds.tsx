/**
 * @file TextToImageAds.tsx
 * @description Ejercicio Text-to-Image: Publicidad Nocturna
 * Self-contained component - Nightlife/Urban Ads theme (Indigo/Fuchsia/Violet)
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
  Moon,
  User,
  Target,
  Palette,
  Box,
  Terminal,
  FileText
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// --- DATOS GLOBALES ---

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  rol: User,
  objetivo: Target,
  escena: Moon,
  estilo: Palette,
  salida: FileText,
};

const COLOR_STYLES: Record<string, any> = {
  indigo: {
    bg: "bg-indigo-500/20",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
  },
  fuchsia: {
    bg: "bg-fuchsia-500/20",
    border: "border-fuchsia-500/30",
    text: "text-fuchsia-400",
  },
  violet: {
    bg: "bg-violet-500/20",
    border: "border-violet-500/30",
    text: "text-violet-400",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
  },
  pink: {
    bg: "bg-pink-500/20",
    border: "border-pink-500/30",
    text: "text-pink-400",
  },
};

const FIELDS = [
  {
    key: "rol",
    label: "1. ROL",
    placeholder: "Ej: Director Creativo Agencia Digital...",
    color: "indigo",
  },
  {
    key: "objetivo",
    label: "2. OBJETIVO",
    placeholder: "Ej: Stories, paquete fiesta...",
    color: "fuchsia",
  },
  {
    key: "escena",
    label: "3. ESCENA + EMOCIÓN",
    placeholder: "Ej: Luces Tokio, FOMO...",
    color: "violet",
  },
  {
    key: "estilo",
    label: "4. ESTILO",
    placeholder: "Ej: Vertical, bokeh, espacio arriba...",
    color: "cyan",
  },
  {
    key: "salida",
    label: "5. SALIDA",
    placeholder: "Ej: Prompt inglés, 9:16...",
    color: "pink",
  },
];

interface PracticeScreenProps {
  answers: { rol: string; objetivo: string; escena: string; estilo: string; salida: string };
  handleAnswerChange: (key: string, value: string) => void;
  handleSubmit: () => void;
  showResult: boolean;
  setMode: (mode: string) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ answers, handleAnswerChange, handleSubmit, showResult, setMode }) => {
    
    const isComplete = Object.values(answers).every(v => v.trim().length > 0);
    const completedCount = Object.values(answers).filter(v => v.trim().length > 0).length;
    
    const generatedPrompt = `Actúa como ${answers.rol}. ${answers.objetivo}. ${answers.escena}. Usa un estilo ${answers.estilo}. ${answers.salida}.`;

    if (showResult) {
      return (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>

            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              ¡Ejercicio Completado!
            </h1>

            <p className="text-2xl text-gray-300 mb-8">
              Has creado tu prompt de anuncio
            </p>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
              <p className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wide">
                Tu Prompt Final:
              </p>
              <p className="text-gray-200 leading-relaxed">
                {generatedPrompt}
              </p>
            </div>

            {/* Instrucciones para usar el prompt */}
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 text-left">
              <p className="text-indigo-400 font-bold mb-4 flex items-center gap-2 text-lg">
                <span className="text-2xl">💡</span> ¿Qué hacer ahora?
              </p>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Ya has generado la idea de tu prompt.
                </p>
                <p className="leading-relaxed">
                  Ahora puedes ir a <span className="text-fuchsia-400 font-semibold">ChatGPT</span> y decirle:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-white font-medium italic">
                    "Genérame un prompt para crear esto:"
                  </p>
                </div>
                <p className="leading-relaxed">
                  (pega tu prompt de arriba y envíalo)
                </p>
                <div className="mt-6 pt-6 border-t border-indigo-500/20">
                  <p className="leading-relaxed mb-3">
                    Una vez que ChatGPT te haya generado el prompt final, puedes ir a la herramienta de generación de imágenes y decir:
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3">
                    <p className="text-white font-medium italic">
                      "Créame una imagen"
                    </p>
                  </div>
                  <p className="leading-relaxed">
                    y luego pegar el prompt que ChatGPT generó.
                  </p>
                </div>
              </div>
            </div>
            
             <div className="mt-8 flex justify-center gap-4">
                 <button
                    onClick={() => setMode("practice")}
                    className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors text-white"
                 >
                     Editar Prompt
                 </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-center animate-fade-in">
        <div className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-md">
          <button
            onClick={() => setMode("intro")}
            className="text-gray-500 hover:text-white text-sm"
          >
             <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Diseña tu Anuncio Nocturno
              <span className="text-sm font-normal text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                {completedCount}/{FIELDS.length}
              </span>
            </h1>
          </div>

          <div className="flex gap-1">
            {FIELDS.map((f, index) => (
              <div
                key={index}
                className={`w-6 h-2 rounded-full transition-all ${
                  index < completedCount ? "bg-" + f.color + "-500 shadow-[0_0_10px_rgba(100,200,250,0.5)]" : "bg-white/10"
                }`}
                style={{ backgroundColor: index < completedCount ? "" : undefined }}
              >
                   {index < completedCount && <div className={`w-full h-full rounded-full bg-${f.color}-500`}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {FIELDS.map((f, i) => {
            const value = answers[f.key as keyof typeof answers];
            const isFilled = value.trim().length > 0;
            
            const colorStyle = COLOR_STYLES[f.color] || COLOR_STYLES.indigo;
             const Icon = ICON_MAP[f.key] || Sparkles;

            return (
              <div
                key={i}
                className={`
                  relative group transition-all duration-300
                  bg-black/20 backdrop-blur-sm border rounded-xl p-4
                  ${isFilled ? colorStyle.border : "border-white/5 hover:border-white/20"}
                  ${isFilled ? colorStyle.bg.replace('/20', '/10') : ""}
                `}
              >
               <div className="flex gap-3">
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                      ${isFilled ? colorStyle.bg : "bg-white/5 group-hover:bg-white/10"}
                      ${isFilled ? colorStyle.text : "text-gray-500 group-hover:text-gray-300"}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <label
                      className={`
                        block text-xs font-bold uppercase tracking-wider mb-1.5
                        ${colorStyle.text}
                      `}
                    >
                      {f.label}
                    </label>
                    <textarea
                      rows={2}
                      value={answers[f.key as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(f.key, e.target.value)}
                      className={`
                        w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white 
                        placeholder-gray-600 focus:outline-none focus:ring-1 focus:bg-black/60 transition-all resize-none
                        ${isFilled ? "border-white/20" : ""}
                        focus:ring-${f.color}-500
                      `}
                      placeholder={f.placeholder}
                    />
                  </div>
               </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-end items-center mt-auto">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              group flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-white transition-all
              ${isComplete 
                ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-105 shadow-lg shadow-indigo-900/20" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed"}
            `}
          >
            <span>Generar Prompt</span>
            <Zap className={`w-5 h-5 ${isComplete ? "group-hover:translate-x-1" : ""} transition-transform`} />
          </button>
        </div>
      </div>
    );
};

export const TextToImageAds: React.FC = () => {
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
      setAnswers(prev => ({ ...prev, [key]: value }));
    }, []);
  
    const handleSubmit = useCallback(() => {
      const isComplete = Object.values(answers).every(v => v.trim().length > 0);
      if (isComplete) {
        setShowResult(true);
      }
    }, [answers]);
  
    // DATOS: Tema Ads (Neon/Nightlife)
    const tutorialSteps = [
      {
        num: 1,
        subtitle: "ROL",
        title: "Paso 1: El Experto",
        icon: <Camera className="w-6 h-6" />,
        question: "¿Quién maneja la campaña?",
        explanation:
          "Define quién eres para ajustar el tono. 'Influencer de moda' vs 'Director de Arte' da resultados distintos.",
        example:
          "Actúa como un director creativo de una agencia de publicidad digital especializada en Instagram.",
        color: "indigo",
        tip: "Súmale adjetivos como 'Experto' o 'Viral'.",
      },
      {
        num: 2,
        subtitle: "OBJETIVO",
        title: "Paso 2: El Propósito",
        icon: <Target className="w-6 h-6" />,
        question: "¿Qué quieres vender o lograr?",
        explanation:
          "¿Es para stories? ¿Un post cuadrado? El formato es clave. Y, ¿quieres likes o ventas?",
        example:
          "Crear una imagen vertical atractiva (Instagram Story) para promocionar una 'Noche Neon' en un club exclusivo.",
        color: "fuchsia",
        tip: "Usa 'Stop-scrolling' como modificador para pedir impacto visual.",
      },
      {
        num: 3,
        subtitle: "ESCENA + EMOCIÓN",
        title: "Paso 3: El Ambiente",
        icon: <Moon className="w-6 h-6" />,
        question: "¿Qué pasa en la imagen?",
        explanation:
          "Describe el centro de atención. En publicidad nocturna, la iluminación es clave.",
        example:
          "Primer plano de un cóctel humeante, luces de neón rosa y azul desenfocadas al fondo. Gente guapa bailando silueteada. Emoción: FOMO (Fear Of Missing Out) y diversión.",
        color: "violet",
        tip: "Palabras potentes: 'Vibrant nightlife', 'Neon glow', 'Cyberpunk vibes'.",
      },
      {
        num: 4,
        subtitle: "ESTILO",
        title: "Paso 4: La Estética",
        icon: <Palette className="w-6 h-6" />,
        question: "¿Cuál es el look?",
        explanation:
          "La estética define la 'tribu' a la que te diriges. Cyberpunk, Vaporwave, elegante...",
        example:
          "Estilo Cyberpunk chic, alto contraste, saturación alta, luces volumétricas, fotografía de producto de alta gama.",
        color: "cyan",
        tip: "Para anuncios, deja 'Espacio Negativo' arriba para poner texto.",
      },
      {
        num: 5,
        subtitle: "SALIDA",
        title: "Paso 5: El Formato",
        icon: <Box className="w-6 h-6" />,
        question: "¿Qué necesito?",
        explanation:
          "El prompt técnico final. Pide formato vertical para móviles (9:16).",
        example:
          "Genera el prompt en inglés para Midjourney v6 en formato vertical --ar 9:16.",
        color: "pink",
        tip: "Midjourney v6 entiende muy bien la iluminación de estudio con --style raw.",
      },
    ];
  
    const completeExample = {
      userPrompt: `ChatGPT, actúa como un experto en marketing digital (ROL).
  
  Necesito una imagen para una historia de Instagram promocionando zapatillas urbanas (OBJETIVO).
  
  Escena: Calle de Tokio de noche y lloviendo. Reflejos de neón en el suelo mojado. Primer plano de las zapatillas pisando un charco colorido.
  Emoción: Urbano, cool, moderno (ESCENA + EMOCIÓN).
  
  Estilo: Fotografía callejera nocturna, estilo cyberpunk, colores neón, alta nitidez en el producto (ESTILO).
  
  Salida: Prompt en inglés para Midjourney v6 --ar 9:16 (SALIDA).`,
  
      aiPrompt: `Close-up low angle shot of stylish urban sneakers stepping into a rain puddle acting as a mirror for neon signs, Tokyo street at night, raining, vibrant cyberpunk color palette (pink and cyan), moody atmosphere, high fashion street photography, sharp focus on shoes, bokeh background, cinematic lighting --ar 9:16 --v 6 --style raw`,
  
      finalCommand: `Imagine prompt: Close-up low angle shot...`,
    };
  
    // --- SCREENS ---
  
    const IntroScreen = () => (
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-500 text-indigo-300 text-sm font-semibold tracking-wide shadow-sm shadow-indigo-500/20">
            <Terminal className="w-4 h-4" />
            BASICS: ADS & SOCIAL
          </div>
  
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Crea Anuncios <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">
              Virales con IA
            </span>
          </h1>
  
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Aprende a generar visuales impactantes para Instagram, TikTok y campañas publicitarias
            que detengan el scroll.
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
                  Aprender
                </div>
                Ver los 5 Pasos
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
  
          <button
            onClick={() => setMode("practice")}
            className="group bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white p-6 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm font-normal text-fuchsia-200">Practicar</div>
                Crear Anuncio
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

      if (!step) return null;
  
      const colors: { [key: string]: string } = {
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        fuchsia: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
        violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      } as const;
      const defaultTheme = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      const currentTheme: string = colors[step.color] ?? defaultTheme;
  
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
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
              ¡Quiero intentarlo!
            </button>
          </div>
        </div>
      </div>
    );
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-4 md:p-8">
        {mode === "intro" && <IntroScreen />}
        {mode === "tutorial" && <TutorialScreen />}
        {mode === "example" && <ExampleScreen />}
        {mode === "practice" && <PracticeScreen answers={answers} handleAnswerChange={handleAnswerChange} handleSubmit={handleSubmit} showResult={showResult} setMode={setMode} />}
  
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
