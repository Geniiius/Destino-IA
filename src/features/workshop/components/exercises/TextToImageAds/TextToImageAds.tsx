/**
 * @file TextToImageAds.tsx
 * @description Ejercicio Text-to-Image: Publicidad & Ads
 * Self-contained component - Advertising theme (Indigo/Fuchsia/Violet)
 */

import React, { useState, useCallback } from "react";
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  Zap,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  ChevronLeft,
  Camera,
  Moon,
  User,
  Target,
  Palette,
  Box,
  Terminal,
  FileText,
  Eye,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// ============================================
// EJEMPLOS PRE-CONSTRUIDOS - TEMA PUBLICIDAD
// ============================================
const PRESET_EXAMPLES = [
  {
    id: "zapatillas",
    emoji: "\ud83d\udc5f",
    title: "Zapatillas Sport",
    image: "/assets/examples/ads/zapatillas.webp",
    border: "border-fuchsia-300",
    bg: "bg-fuchsia-50",
    answers: {
      rol: "Director creativo de agencia de publicidad para marcas deportivas",
      objetivo: "Crear visual impactante para lanzamiento de nueva l\u00ednea de zapatillas running",
      escena: "Zapatilla flotando con explosi\u00f3n de part\u00edculas de color ne\u00f3n, fondo oscuro dram\u00e1tico, gotas de agua congeladas. Emoci\u00f3n: Energ\u00eda y velocidad",
      estilo: "Product shot cin\u00e9tico, iluminaci\u00f3n ne\u00f3n, colores vibrantes sobre fondo oscuro, ultra detallado",
      salida: "Prompt en ingl\u00e9s para Midjourney v6 --ar 4:5",
    },
  },
  {
    id: "cafe",
    emoji: "\u2615",
    title: "Caf\u00e9 Premium",
    image: "/assets/examples/ads/cafe.webp",
    border: "border-amber-300",
    bg: "bg-amber-50",
    answers: {
      rol: "Fot\u00f3grafo gastron\u00f3mico especializado en bebidas premium",
      objetivo: "Anuncio para redes sociales de marca de caf\u00e9 de especialidad artesanal",
      escena: "Taza de caf\u00e9 latte art con vapor visible, granos tostados alrededor, luz de ma\u00f1ana entrando por ventana. Emoci\u00f3n: Calidez y ritual matutino",
      estilo: "Fotograf\u00eda gastron\u00f3mica premium, tonos c\u00e1lidos marr\u00f3n y dorado, profundidad de campo corta",
      salida: "Prompt en ingl\u00e9s para Ideogram, formato cuadrado 1:1",
    },
  },
  {
    id: "cosmetica",
    emoji: "\ud83d\udc84",
    title: "Cosm\u00e9tica",
    image: "/assets/examples/ads/cosmetica.webp",
    border: "border-rose-300",
    bg: "bg-rose-50",
    answers: {
      rol: "Director de arte de campa\u00f1as de belleza para marcas de lujo",
      objetivo: "Visual para campa\u00f1a digital de nueva l\u00ednea de skincare org\u00e1nica",
      escena: "Productos de skincare entre flores frescas y gotas de roc\u00edo, texturas cremosas visibles, fondo m\u00e1rmol rosa. Emoci\u00f3n: Pureza y lujo natural",
      estilo: "Editorial beauty, colores pastel rosa y dorado, iluminaci\u00f3n suave difusa, est\u00e9tica clean beauty",
      salida: "Prompt en ingl\u00e9s para Midjourney v6 --ar 4:5",
    },
  },
  {
    id: "tech",
    emoji: "\ud83d\udcf1",
    title: "Tech Launch",
    image: "/assets/examples/ads/tech.webp",
    border: "border-indigo-300",
    bg: "bg-indigo-50",
    answers: {
      rol: "Director creativo de Apple-style product launches",
      objetivo: "Imagen hero para p\u00e1gina de producto de smartphone flagship",
      escena: "Smartphone flotando en \u00e1ngulo din\u00e1mico con interfaz brillante, reflejos de luz esc\u00e9nica, part\u00edculas luminosas. Emoci\u00f3n: Innovaci\u00f3n y deseo",
      estilo: "Minimalista tech, fondo gradiente oscuro, iluminaci\u00f3n de estudio precisa, ultra n\u00edtido 8k",
      salida: "Prompt en ingl\u00e9s para Midjourney v6 --ar 16:9",
    },
  },
  {
    id: "food",
    emoji: "\ud83c\udf54",
    title: "Fast Food",
    image: "/assets/examples/ads/food.webp",
    border: "border-orange-300",
    bg: "bg-orange-50",
    answers: {
      rol: "Fot\u00f3grafo publicitario de food styling para cadenas de restaurantes",
      objetivo: "Imagen apetitosa para cartelera digital de nueva hamburguesa gourmet",
      escena: "Hamburguesa gourmet con ingredientes volando en c\u00e1mara lenta, queso derritido, fondo de llamas suaves. Emoci\u00f3n: Antojo irresistible",
      estilo: "Food photography din\u00e1mica, colores saturados, fondo oscuro con splash de salsa, macro detalle",
      salida: "Prompt en ingl\u00e9s para Ideogram, formato vertical 3:4",
    },
  },
  {
    id: "viajes",
    emoji: "\u2708\ufe0f",
    title: "Viajes - Safari",
    image: "/assets/examples/ads/viajes.webp",
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    answers: {
      rol: "Gu\u00eda de safari y fot\u00f3grafo de naturaleza salvaje para agencia de viajes premium",
      objetivo: "Vertical travel advertising poster for Facebook Ads. Atraer aventureros a un safari de 5 d\u00edas en Kenia con un anuncio visual cinematogr\u00e1fico",
      escena: "African savannah in Kenya at sunset, herd of elephants walking toward the horizon, dramatic golden sky, Mount Kilimanjaro in the background, acacia trees silhouette, warm dusty atmosphere, cinematic wildlife documentary photography, ultra realistic, National Geographic style, intense earthy colors, golden hour lighting, high detail, depth of field, epic composition, sense of awe, freedom and connection with wild nature",
      estilo: "Professional commercial layout with strong typography hierarchy. Top headline bold uppercase: \"EXPLORA EL CORAZ\u00d3N DE \u00c1FRICA\". Secondary headline: \"SAFARI DE 5 D\u00cdAS EN KENIA\". Italic script: \"\u00a1Vive la aventura de tu vida!\". Price banner: \"5 D\u00cdAS / TODO INCLUIDO - DESDE $1,490 USD\". Green CTA button: \"RESERVA AHORA\". Clean advertising poster layout, high contrast readable text, premium typography, cinematic color grading",
      salida: "Prompt en ingl\u00e9s para Midjourney/Ideogram, formato vertical 4:5, professional marketing campaign design",
    },
  },
];

// --- DATOS GLOBALES ---

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  rol: User,
  objetivo: Target,
  escena: Moon,
  estilo: Palette,
  salida: FileText,
};

const FIELDS = [
  {
    key: "rol",
    label: "ROL",
    desc: "Define la perspectiva creativa para el anuncio",
    placeholder: "Ej: Director Creativo de Agencia Digital especializado en campañas de producto",
    example: "Fotógrafo publicitario de marcas de moda y lifestyle",
    color: "indigo",
  },
  {
    key: "objetivo",
    label: "OBJETIVO",
    desc: "Describe qué quieres lograr con el anuncio",
    placeholder: "Ej: Stories para promocionar lanzamiento de nueva colección de zapatillas",
    example: "Banner publicitario para campaña de Black Friday de una tienda online",
    color: "fuchsia",
  },
  {
    key: "escena",
    label: "ESCENA + EMOCIÓN",
    desc: "Describe el escenario y la emoción que transmite el anuncio",
    placeholder: "Ej: Producto sobre fondo minimalista con iluminación dramática, sensación de deseo",
    example: "Modelo usando el producto en un entorno urbano moderno, confianza y estilo",
    color: "violet",
  },
  {
    key: "estilo",
    label: "ESTILO VISUAL",
    desc: "Define el estilo visual del anuncio",
    placeholder: "Ej: Vertical, colores vibrantes, espacio arriba para texto publicitario",
    example: "Minimalista con alto contraste, paleta monocromática y tipografía bold",
    color: "cyan",
  },
  {
    key: "salida",
    label: "SALIDA ESPERADA",
    desc: "Describe el formato y uso final del anuncio",
    placeholder: "Ej: Prompt en inglés para imagen 9:16 para Stories/Reels",
    example: "Prompt para carrusel publicitario, 5 imágenes cuadradas para Instagram",
    color: "pink",
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
  const [showExamples, setShowExamples] = useState(true);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [hoveredExample, setHoveredExample] = useState<string | null>(null);

  const handleSelectExample = (example: typeof PRESET_EXAMPLES[0]) => {
    setSelectedExample(example.id);
    Object.entries(example.answers).forEach(([key, value]) => {
      handleAnswerChange(key, value);
    });
    setShowExamples(false);
  };

  const { copied, copy } = useCopyToClipboard();
  const generatedPrompt = `Genérame y optimízame un prompt de alto impacto con estas especificaciones:\nActúa como ${answers.rol}.\nObjetivo: ${answers.objetivo}.\nEscena/Contexto: ${answers.escena}.\nEstilo visual: ${answers.estilo}.\nFormato de salida: ${answers.salida}.`;

  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in lg:h-[calc(100vh-4rem)] lg:flex lg:items-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 lg:p-8 shadow-2xl w-full lg:overflow-hidden">
          {/* Header */}
          <div className="text-center mb-4 lg:mb-3">
            <div className="text-4xl lg:text-3xl mb-2 lg:mb-1">🎉</div>
            <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-white mb-1 bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              ¡Ejercicio Completado!
            </h1>
            <p className="text-sm lg:text-xs text-gray-400">
              Tu prompt de anuncio está listo. Solo falta copiarlo y pegarlo.
            </p>
          </div>

          {/* Prompt Block */}
          <div className="bg-black/30 rounded-2xl border border-indigo-500/30 mb-4 lg:mb-3 overflow-hidden">
            <div className="bg-indigo-500/10 px-4 py-2 border-b border-indigo-500/20 flex items-center justify-between">
              <span className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Tu Prompt Completo</span>
              <span className="text-indigo-400/60 text-[10px]">Listo para copiar</span>
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
                : "bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {copied ? "✅  ¡Copiado al portapapeles!" : "📋  Copiar Prompt Completo"}
          </button>

          {/* Steps Guide */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 lg:p-3">
            <p className="text-white font-bold mb-3 lg:mb-2 text-center text-base lg:text-sm">📌 Sigue estos 3 pasos:</p>
            <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
              <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 lg:text-center">
                <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-indigo-500/40">1</div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="text-indigo-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">📋 Copia tu prompt</p>
                  <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Haz clic en el botón de arriba. Se copia <span className="text-indigo-300 font-medium">todo el bloque</span>, incluyendo la instrucción para ChatGPT.</p>
                </div>
              </div>
              <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 lg:text-center">
                <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-emerald-500/40">2</div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="text-emerald-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🤖 Pégalo en ChatGPT</p>
                  <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Abre <span className="text-emerald-300 font-medium">ChatGPT</span>, pega y envía. Te generará un <span className="text-emerald-300 font-medium">prompt profesional</span>.</p>
                </div>
              </div>
              <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-3 lg:text-center">
                <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-fuchsia-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-fuchsia-500/40">3</div>
                <div className="pt-0.5 lg:pt-0">
                  <p className="text-fuchsia-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🎨 Genera tu imagen</p>
                  <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Escribe: <span className="text-fuchsia-300 font-semibold">"Créame esta imagen:"</span> y pega el prompt de ChatGPT.</p>
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
      iconBg: "bg-indigo-500",
      labelColor: "text-indigo-700",
      cardBg: "bg-indigo-50",
      filledBg: "bg-indigo-100",
      cardBorder: "border-indigo-200",
      focusRing: "focus:ring-indigo-400",
    },
    objetivo: {
      iconBg: "bg-fuchsia-500",
      labelColor: "text-fuchsia-700",
      cardBg: "bg-fuchsia-50",
      filledBg: "bg-fuchsia-100",
      cardBorder: "border-fuchsia-200",
      focusRing: "focus:ring-fuchsia-400",
    },
    escena: {
      iconBg: "bg-violet-500",
      labelColor: "text-violet-700",
      cardBg: "bg-violet-50",
      filledBg: "bg-violet-100",
      cardBorder: "border-violet-200",
      focusRing: "focus:ring-violet-400",
    },
    estilo: {
      iconBg: "bg-cyan-500",
      labelColor: "text-cyan-700",
      cardBg: "bg-cyan-50",
      filledBg: "bg-cyan-100",
      cardBorder: "border-cyan-200",
      focusRing: "focus:ring-cyan-400",
    },
    salida: {
      iconBg: "bg-pink-500",
      labelColor: "text-pink-700",
      cardBg: "bg-pink-50",
      filledBg: "bg-pink-100",
      cardBorder: "border-pink-200",
      focusRing: "focus:ring-pink-400",
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 animate-fade-in">
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(245,240,255,0.95) 50%, rgba(255,240,252,0.95) 100%)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-400" />

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
                  <span className="text-3xl">🌃</span>
                  Diseña tu Anuncio
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
                      ? "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selector de Ejemplos */}
        <div className="px-8 pb-3">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm font-bold text-fuchsia-600 hover:text-fuchsia-800 transition-colors mb-2"
          >
            <Sparkles className="w-4 h-4" />
            {showExamples ? "Ocultar ejemplos" : "\ud83d\udca1 \u00bfNecesitas inspiraci\u00f3n? Elige un ejemplo"}
            {showExamples ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showExamples && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {PRESET_EXAMPLES.map((example) => (
                <div key={example.id} className="relative">
                  <button
                    onClick={() => handleSelectExample(example)}
                    onMouseEnter={() => setHoveredExample(example.id)}
                    onMouseLeave={() => setHoveredExample(null)}
                    className={`
                      relative w-full p-3 rounded-xl border-2 transition-all duration-200
                      hover:scale-[1.03] hover:shadow-md text-center
                      ${selectedExample === example.id
                        ? `${example.bg} ${example.border} shadow-md`
                        : "bg-white border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    <span className="text-2xl block mb-1">{example.emoji}</span>
                    <span className={`text-xs font-bold block ${
                      selectedExample === example.id ? "text-gray-800" : "text-gray-600"
                    }`}>
                      {example.title}
                    </span>
                  </button>
                  {hoveredExample === example.id && example.image && (
                    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 pointer-events-none">
                      <div className="w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 mx-auto -mb-1.5" />
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-2 w-64">
                        <img
                          src={example.image}
                          alt={example.title}
                          className="w-full max-h-64 object-contain rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <p className="text-xs text-center text-gray-500 mt-1.5 font-medium">
                          Vista previa del resultado
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIELDS.map((f) => {
            const value = answers[f.key as keyof typeof answers];
            const isFilled = value.trim().length > 0;
            const s = fieldStyles[f.key] ?? fieldStyles.rol;
            if (!s) return null;
            const Icon = ICON_MAP[f.key] || Sparkles;

            return (
              <div
                key={f.key}
                className={`relative rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                  isFilled
                    ? `${s.filledBg} ${s.cardBorder}`
                    : `${s.cardBg} border-transparent`
                }`}
              >
                {isFilled && (
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${s.iconBg} flex items-center justify-center shadow-sm`}>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-1.5">
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
                {f.desc && (
                  <p className="text-xs text-gray-500 mb-3 ml-[46px]">{f.desc}</p>
                )}
                <textarea
                  value={value}
                  onChange={(e) => handleAnswerChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={2}
                  className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${s.focusRing} focus:border-transparent transition-all duration-200 shadow-sm resize-none leading-relaxed`}
                />
                {f.example && !isFilled && (
                  <p className={`text-xs mt-2 ${s.labelColor} opacity-70`}>
                    <span className="font-semibold">Ejemplo:</span> {f.example}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-8 pb-6">
          <div className="flex items-start gap-4 rounded-2xl p-5 bg-gradient-to-r from-indigo-50 to-fuchsia-50 border border-indigo-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest mb-1">
                Vista Previa
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isComplete
                  ? <>
                      Como <strong>{answers.rol}</strong>. {answers.objetivo}. La escena es <strong>{answers.escena}</strong>. El <strong>estilo</strong> visual es {answers.estilo}. Formato: {answers.salida}.
                    </>
                  : "Completa todos los campos para ver tu prompt generado aquí..."}
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-7 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`group flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-white text-base transition-all duration-300 ${
              isComplete
                ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 hover:scale-[1.03] hover:shadow-xl shadow-lg shadow-indigo-500/25"
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

  // DATOS: Tema Ads (Publicidad)
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
        "Actúa como un director creativo de una agencia de publicidad digital especializada en campañas de producto.",
      color: "indigo",
      tip: "Súmale adjetivos como 'Experto', 'Viral' o 'Premium'.",
    },
    {
      num: 2,
      subtitle: "OBJETIVO",
      title: "Paso 2: El Propósito",
      icon: <Target className="w-6 h-6" />,
      question: "¿Qué quieres vender o lograr?",
      explanation:
        "¿Es para stories? ¿Un post cuadrado? ¿Un banner web? El formato es clave. Y, ¿quieres likes o ventas?",
      example:
        "Crear una imagen vertical impactante (Instagram Story) para promocionar el lanzamiento de unas zapatillas deportivas.",
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
        "Describe el centro de atención. En publicidad, la composición y la iluminación son clave para captar miradas.",
      example:
        "Primer plano del producto sobre un fondo degradado vibrante, iluminación de estudio perfecta. Emoción: Deseo, exclusividad y urgencia de compra.",
      color: "violet",
      tip: "Palabras potentes: 'Hero shot', 'Product photography', 'Eye-catching composition'.",
    },
    {
      num: 4,
      subtitle: "ESTILO",
      title: "Paso 4: La Estética",
      icon: <Palette className="w-6 h-6" />,
      question: "¿Cuál es el look?",
      explanation:
        "La estética define a quién te diriges. Minimalista, colorido, elegante, urbano...",
      example:
        "Estilo publicitario premium, alto contraste, colores vibrantes, fotografía de producto de alta gama con espacio para texto.",
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
        "El prompt técnico final. Pide formato vertical para móviles (9:16) o cuadrado para feed (1:1).",
      example:
        "Genera el prompt en inglés para Midjourney v6 en formato vertical --ar 9:16.",
      color: "pink",
      tip: "Midjourney v6 entiende muy bien la iluminación de estudio con --style raw.",
    },
  ];

  const completeExample = {
    userPrompt: `ChatGPT, actúa como un director creativo de una agencia de publicidad digital (ROL).
  
  Necesito una imagen para una historia de Instagram promocionando unas zapatillas deportivas premium (OBJETIVO).
  
  Escena: Primer plano de las zapatillas sobre un podio minimalista con iluminación de estudio dramática. Colores vibrantes del producto contrastan con fondo oscuro degradado.
  Emoción: Deseo, exclusividad y urgencia (ESCENA + EMOCIÓN).
  
  Estilo: Fotografía de producto publicitaria, alto contraste, colores saturados, nitidez perfecta en el producto, espacio negativo arriba para texto (ESTILO).
  
  Salida: Prompt en inglés para Midjourney v6 --ar 9:16 (SALIDA).`,

    aiPrompt: `Premium sports sneakers on a minimalist pedestal with dramatic studio lighting, vibrant product colors contrasting against a dark gradient background, high-end advertising product photography, high contrast, saturated colors, razor sharp focus on shoes, negative space at top for text overlay, professional commercial aesthetic, 8k resolution --ar 9:16 --v 6 --style raw`,

    finalCommand: `Imagine prompt: Premium sports sneakers on a minimalist pedestal...`,
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
          Aprende a generar visuales impactantes para Instagram, TikTok y
          campañas publicitarias que detengan el scroll.
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
              <div className="text-sm font-normal text-fuchsia-200">
                Practicar
              </div>
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
    const defaultTheme =
      "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
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
    <div className="min-h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white p-4 md:p-8">
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
