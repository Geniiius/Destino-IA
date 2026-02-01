import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
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
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// --- DATOS ESTÁTICOS ---

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
  const currentTheme = colors[step.color];

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

interface PracticeScreenProps {
  setMode: (mode: string) => void;
  onGenerate: (inputs: Record<string, string>) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = React.memo(
  ({ setMode, onGenerate }) => {
    // Estado local para los inputs del usuario
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

    // Definición de campos para el formulario de práctica (6 PILARES)
    const fields = [
      {
        id: "rol",
        label: "1. ROL / PERSPECTIVA",
        desc: "¿Quién cuenta la historia?",
        ex: "Ej: Fotógrafo de Producto...",
        color: "indigo",
      },
      {
        id: "obj",
        label: "2. OBJETIVO",
        desc: "¿Qué buscas lograr?",
        ex: "Ej: Campaña de Instagram...",
        color: "emerald",
      },
      {
        id: "esc",
        label: "3. ESCENA + ENTORNO",
        desc: "¿Dónde está el objeto?",
        ex: "Ej: Mesa de madera, luz de mañana...",
        color: "amber",
      },
      {
        id: "int",
        label: "4. DETALLES DE INTEGRACIÓN",
        desc: "¿Dónde y cómo va el logo?",
        ex: "Ej: En la etiqueta, bordado, relieve...",
        color: "rose",
      },
      {
        id: "est",
        label: "5. ESTILO VISUAL",
        desc: "Look & Feel",
        ex: "Ej: Minimalista, macro, bokeh...",
        color: "purple",
      },
      {
        id: "sal",
        label: "6. SALIDA / FORMATO",
        desc: "Resolución y uso",
        ex: "Ej: Vertical para Stories, 4k...",
        color: "cyan",
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

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            Define tu Integración
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Rellena los 6 pilares para crear un branding perfecto.
          </p>
        </div>

        <div className="space-y-6">
          {fields.map((f, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`bg-${f.color}-500/20 text-${f.color}-400 text-xs font-black px-2 py-1 rounded`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-${f.color}-400 font-bold text-sm tracking-wider`}
                  >
                    {f.label}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{f.desc}</span>
              </div>

              <textarea
                rows={1}
                value={inputs[f.id as keyof typeof inputs]}
                onChange={(e) => handleChange(f.id, e.target.value)}
                className="w-full bg-black/30 border border-gray-800 rounded-xl p-3 text-white placeholder:text-gray-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all resize-none"
                placeholder="..."
              />

              <div className="mt-3 flex items-center gap-2 bg-gray-950/50 p-2 rounded-lg border border-gray-800/50">
                <Sparkles className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500 font-mono">{f.ex}</span>
              </div>
            </div>
          ))}

          <button
            onClick={() => onGenerate(inputs)}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-900/20 transition-all mt-4 hover:scale-[1.02] active:scale-95"
          >
            Generar Prompt de Branding
          </button>
        </div>
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
    <div className="max-w-3xl mx-auto animate-fade-in py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-4 border border-green-500/50">
          <Rocket className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-4xl font-black text-white">
          ¡Tu Prompt está Listo!
        </h2>
        <p className="text-gray-400 mt-2">
          Copia el resultado y llévalo a tu herramienta de IA favorita.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500"></div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Prompt Generado
              </label>
              <button
                onClick={() => copy(completeExample.aiPrompt)}
                className="flex items-center gap-2 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copiado" : "Copiar Texto"}
              </button>
            </div>
            <div className="bg-black/50 border border-gray-800 rounded-xl p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {generatedPrompt}
            </div>
          </div>

          <div className="bg-rose-900/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-full">
              <Upload className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-sm text-gray-300">
              <strong className="text-white">Recordatorio:</strong> No olvides
              subir tu archivo de logo (PNG) junto con este prompt.
            </div>
          </div>

          <button
            onClick={() => setMode("intro")}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            Crear otro mockup
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export const TextToImageLogo: React.FC = () => {
  const [mode, setMode] = useState("intro"); // intro, tutorial, example, practice, result
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Función para construir el prompt final desde los inputs del usuario
  const handleGeneratePrompt = (inputs: Record<string, string>) => {
    const prompt = `Actúa como un ${inputs.rol}.
Objetivo: ${inputs.obj}
Escena: ${inputs.esc}
Integración del Logo: ${inputs.int}
Estilo Visual: ${inputs.est}
Formato de Salida: ${inputs.sal}

Genera una imagen fotorrealista de alta calidad siguiendo estos parámetros.`;

    setGeneratedPrompt(prompt);
    setMode("result");
  };

  return (
    <div className="min-h-screen bg-[#0a0505] text-gray-100 p-4 md:p-8 font-sans">
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
        <PracticeScreen setMode={setMode} onGenerate={handleGeneratePrompt} />
      )}
      {mode === "result" && (
        <ResultScreen generatedPrompt={generatedPrompt} setMode={setMode} />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </div>
  );
};
