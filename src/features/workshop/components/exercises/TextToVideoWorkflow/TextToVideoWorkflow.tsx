import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  Copy,
  Film,
  Video,
  Upload,
  Image as ImageIcon,
  Briefcase,
  Plane,
  MonitorPlay,
  Rocket,
  MessageSquare,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// --- CONFIGURACIÓN DE MISIONES ---
const MISSIONS = {
  travel: {
    id: "travel",
    title: "Viajes / Luxury",
    desc: "Vende la experiencia y el destino.",
    icon: <Plane className="w-8 h-8 text-cyan-400" />,
    color: "cyan",
    placeholders: {
      rol: "Influencer de Viajes o Cineasta.",
      objetivo: "Viralizar un destino en TikTok.",
      escena: "Amanecer en Santorini, pareja brindando, mar en calma.",
      salida: "Reel vertical 9:16 de alta calidad.",
    },
    ejemplo: {
      rol: "Director de fotografía especializado en viajes de lujo y lifestyle para marcas premium",
      objetivo:
        "Crear un reel viral que inspire a viajeros a reservar experiencias de lujo únicas",
      escenaEmocion:
        "Amanecer dorado en Santorini, pareja elegante brindando con champagne en terraza con vista al mar Egeo, sensación de romance, exclusividad y libertad infinita",
      estiloVisual:
        "Cinematográfico premium con tonos cálidos dorados y azules profundos, lens flare natural, movimiento suave de cámara, bokeh en luces del fondo",
      salidaEsperada:
        "Reel vertical 9:16 de 6 segundos, calidad 4K, optimizado para TikTok/Instagram",
    },
  },
  corporate: {
    id: "corporate",
    title: "Corporate / Tech",
    desc: "Transmite confianza, liderazgo y modernidad.",
    icon: <Briefcase className="w-8 h-8 text-indigo-400" />,
    color: "indigo",
    placeholders: {
      rol: "Director de Fotografía Comercial.",
      objetivo: "Fondo de pantalla (Hero) para web de Fintech.",
      escena:
        "Reunión ejecutiva en oficina de cristal, horizonte urbano futurista.",
      salida: "Video horizontal 16:9, bucle perfecto.",
    },
    ejemplo: {
      rol: "Director creativo de agencia de branding corporativo especializado en empresas tecnológicas Fortune 500",
      objetivo:
        "Producir un hero video para landing page que transmita innovación, confianza y liderazgo en el sector fintech",
      escenaEmocion:
        "Reunión ejecutiva en oficina de cristal minimalista, horizonte urbano futurista al atardecer, sensación de poder, innovación y visión de futuro",
      estiloVisual:
        "Estética corporate premium con tonos azules fríos y acentos dorados, iluminación volumétrica, movimientos lentos y elegantes, profundidad de campo cinematográfica",
      salidaEsperada:
        "Video horizontal 16:9 de 8 segundos en bucle perfecto (seamless loop), calidad broadcast",
    },
  },
  ads: {
    id: "ads",
    title: "Publicidad / Producto",
    desc: "Alto impacto visual en pocos segundos.",
    icon: <MonitorPlay className="w-8 h-8 text-fuchsia-400" />,
    color: "fuchsia",
    placeholders: {
      rol: "Director Creativo de Publicidad.",
      objetivo: "Anuncio de 6 segundos para YouTube.",
      escena: "Lata de refresco helada con gotas de condensación, fondo neón.",
      salida: "Formato cuadrado 1:1, alta fidelidad.",
    },
    ejemplo: {
      rol: "Director creativo senior de agencia de publicidad especializado en spots de alto impacto para marcas de consumo masivo",
      objetivo:
        "Crear un bumper ad de 6 segundos irresistible que detenga el scroll y genere deseo inmediato del producto",
      escenaEmocion:
        "Lata de refresco premium helada con gotas de condensación brillantes, fondo degradado neón vibrante, sensación de frescura extrema, deseo y satisfacción instantánea",
      estiloVisual:
        "Publicidad de alto impacto con iluminación de estudio perfecta, macro shots del producto, colores saturados, reflejos especulares en el metal, estética de comercial de TV premium",
      salidaEsperada:
        "Formato cuadrado 1:1 de 6 segundos, ultra alta definición, optimizado para YouTube Bumper Ads",
    },
  },
};

interface TextToVideoWorkflowProps {
  onClose?: () => void;
}

const TextToVideoWorkflow: React.FC<TextToVideoWorkflowProps> = ({
  onClose,
}) => {
  // ESTADOS
  const [step, setStep] = useState("intro"); // intro, strategy, image, prompt_gen, video, finished
  const [mission, setMission] = useState<
    (typeof MISSIONS)[keyof typeof MISSIONS] | null
  >(null);
  const [inputs, setInputs] = useState({
    rol: "",
    objetivo: "",
    escena: "",
    salida: "",
  });

  // Use copy hook
  const { copied, copy } = useCopyToClipboard();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const selectMission = (missionKey: keyof typeof MISSIONS) => {
    setMission(MISSIONS[missionKey]);
    setStep("strategy");
    setInputs({
      rol: "",
      objetivo: "",
      escena: "",
      salida: "",
    });
  };

  // Helper para breadcrumbs
  const Breadcrumbs = ({ activeStep }: { activeStep: number }) => (
    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
      <span
        className={
          activeStep === 1 ? "text-white bg-gray-800 px-2 py-1 rounded" : ""
        }
      >
        1. ESTRATEGIA
      </span>
      <span>→</span>
      <span
        className={
          activeStep === 2
            ? "text-white bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        2. IMAGEN
      </span>
      <span>→</span>
      <span
        className={
          activeStep === 3
            ? "text-white bg-amber-900/50 border border-amber-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        3. PROMPT VIDEO
      </span>
      <span>→</span>
      <span
        className={
          activeStep === 4
            ? "text-white bg-fuchsia-900/50 border border-fuchsia-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        4. ANIMACIÓN
      </span>
    </div>
  );

  // --- VISTAS ---

  // 1. INTRO
  if (step === "intro") {
    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans flex flex-col items-center justify-center animate-fade-in">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 text-xs font-bold tracking-wider uppercase">
            <Film className="w-3 h-3" /> Image to Video
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              Domina la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400">
                Narrativa Visual
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              El secreto profesional:{" "}
              <strong>Imagen Base + Prompt Técnico = Video Perfecto</strong>.
              Sigue el flujo paso a paso.
            </p>
          </div>

          <div className="bg-[#0f0f12] border border-gray-800 rounded-3xl p-8 md:p-12">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Elige tu Misión
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.values(MISSIONS).map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMission(m.id as keyof typeof MISSIONS)}
                  className="group relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-cyan-500/50 transition-all duration-300 text-left flex flex-col h-full"
                >
                  <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 w-fit group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {m.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors text-sm mt-4"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. ESTRATEGIA (SOLO IMAGEN BASE)
  if (step === "strategy") {
    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setStep("intro")}
              className="hover:text-white transition-colors text-gray-500 text-sm"
            >
              Cancelar
            </button>
            <Breadcrumbs activeStep={1} />
          </div>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-2">Define la Imagen Base</h2>
            <p className="text-gray-400">
              Crea la mejor escena posible para:{" "}
              <span className="text-cyan-400 font-bold">{mission?.title}</span>
            </p>
          </div>

          {/* EJEMPLO ESTRUCTURADO VISIBLE */}
          {mission?.ejemplo && (
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">
                  Ejemplo de Prompt Estructurado: {mission.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">
                      ROL
                    </span>
                    <span className="text-gray-400 text-xs">¿Quién eres?</span>
                  </div>
                  <p className="text-sm text-gray-200">{mission.ejemplo.rol}</p>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">
                      OBJETIVO
                    </span>
                    <span className="text-gray-400 text-xs">
                      ¿Qué quieres hacer?
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">
                    {mission.ejemplo.objetivo}
                  </p>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-bold">
                      ESCENA + EMOCIÓN
                    </span>
                    <span className="text-gray-400 text-xs">
                      ¿Dónde y qué sentimiento?
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">
                    {mission.ejemplo.escenaEmocion}
                  </p>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-pink-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded text-xs font-bold">
                      ESTILO VISUAL
                    </span>
                    <span className="text-gray-400 text-xs">
                      ¿Cómo debe verse?
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">
                    {mission.ejemplo.estiloVisual}
                  </p>
                </div>

                <div className="md:col-span-2 bg-black/30 rounded-xl p-4 border border-fuchsia-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded text-xs font-bold">
                      SALIDA ESPERADA
                    </span>
                    <span className="text-gray-400 text-xs">¿Qué formato?</span>
                  </div>
                  <p className="text-sm text-gray-200">
                    {mission.ejemplo.salidaEsperada}
                  </p>
                </div>
              </div>

              {/* Botón para cargar ejemplo */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() =>
                    setInputs({
                      rol: mission.ejemplo.rol,
                      objetivo: mission.ejemplo.objetivo,
                      escena: mission.ejemplo.escenaEmocion,
                      salida: mission.ejemplo.salidaEsperada,
                    })
                  }
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Usar este ejemplo como base
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#0f0f12] border border-gray-800 rounded-3xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                  1. Rol (Experto)
                </label>
                <input
                  name="rol"
                  value={inputs.rol}
                  onChange={handleInputChange}
                  placeholder={mission?.placeholders.rol}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  2. Objetivo (Meta)
                </label>
                <input
                  name="objetivo"
                  value={inputs.objetivo}
                  onChange={handleInputChange}
                  placeholder={mission?.placeholders.objetivo}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                3. Escena + Emoción (Descripción Visual)
              </label>
              <textarea
                name="escena"
                value={inputs.escena}
                onChange={handleInputChange}
                rows={3}
                placeholder={mission?.placeholders.escena}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-600 resize-none"
              />
              <p className="text-xs text-gray-500 text-right">
                Esto servirá para generar la IMAGEN.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-pink-400 text-xs font-bold uppercase tracking-wider">
                4. Formato (Salida Esperada)
              </label>
              <input
                name="salida"
                value={inputs.salida}
                onChange={handleInputChange}
                placeholder={mission?.placeholders.salida}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-pink-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep("image")}
                disabled={!inputs.rol || !inputs.escena || !inputs.objetivo}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Confirmar Estrategia Visual <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. GENERAR IMAGEN BASE
  if (step === "image") {
    const imagePrompt = `Actúa como ${inputs.rol || "[ROL]"}.\nGenera una imagen fotorrealista para: ${inputs.objetivo || "[OBJETIVO]"}.\n\nESCENA: ${inputs.escena || "[ESCENA]"}\nFORMATO: ${inputs.salida || "[FORMATO]"}\n\nAsegura alta resolución, iluminación cinematográfica y composición profesional.`;

    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setStep("strategy")}
              className="hover:text-white transition-colors flex items-center gap-1 text-gray-500 text-sm"
            >
              ← Volver
            </button>
            <Breadcrumbs activeStep={2} />
          </div>

          <div className="bg-[#0f0f12] border border-blue-900/30 rounded-3xl overflow-hidden">
            <div className="bg-blue-900/10 p-8 border-b border-blue-900/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    1. Generar la Imagen Base
                  </h2>
                  <p className="text-blue-200/70 mt-1">
                    Usa tus datos para pedirle la imagen a ChatGPT/DALL-E.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="relative group">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => copy(`Optimízame el prompt para crear la imagen:\n\n${imagePrompt}`)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-xl p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  <span className="text-blue-400 font-semibold">
                    Optimízame el prompt para crear la imagen:
                  </span>
                  <br />
                  <br />
                  {imagePrompt}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("prompt_gen")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105"
                >
                  Ya tengo la imagen <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. GENERAR PROMPT DE ANIMACIÓN
  if (step === "prompt_gen") {
    const metaPrompt = `Actúa como un director creativo cinematográfico y experto en prompting para generación de video IA (Grok).

Contexto del proyecto:
- Industria: ${mission?.title || "[INDUSTRIA]"}
- Objetivo estratégico: ${inputs.objetivo || "[OBJETIVO]"}
- Público objetivo: [demografía y psicografía]

Descripción de la imagen base:
${inputs.escena || "[DESCRIBE DETALLADAMENTE QUÉ SE VE EN LA IMAGEN]"}

Intención creativa:
- Emoción principal que debe transmitir: [ejemplo: "asombro", "calma", "urgencia"]
- Momento narrativo: [inicio de historia / clímax / cierre]
- Acción deseada del espectador: [inspirar a viajar / generar confianza / crear deseo]

Especificaciones técnicas:
- Formato: ${inputs.salida || "[FORMATO]"}
- Duración objetivo: 6s
- Estilo visual: [cinematográfico / documental / comercial / artístico]
- Referencias visuales: [opcional: "como anuncios de Apple" / "estilo Wes Anderson"]

Elementos de movimiento prioritarios:
1. Cámara: [Ejemplo: dolly zoom suave hacia el sujeto]
2. Ambiente: [Ejemplo: luz natural cambiante (golden hour → blue hour)]
3. Sujeto: [Ejemplo: sonrisa genuina emergiendo lentamente]

Entrega:
- Prompt optimizado en inglés
- Formato: Grok
- Incluye: movimiento de cámara + atmósfera + tempo + detalles técnicos`;

    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setStep("image")}
              className="hover:text-white transition-colors flex items-center gap-1 text-gray-500 text-sm"
            >
              ← Volver
            </button>
            <Breadcrumbs activeStep={3} />
          </div>

          <div className="bg-[#0f0f12] border border-amber-900/30 rounded-3xl overflow-hidden">
            <div className="bg-amber-900/10 p-8 border-b border-amber-900/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    2. Obtener Prompt de Video
                  </h2>
                  <p className="text-amber-200/70 mt-1">
                    Sube tu imagen a ChatGPT y pide las instrucciones de
                    movimiento.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3">
                <Upload className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-100 font-medium">
                  <strong>Acción requerida:</strong> Sube la imagen que acabas
                  de generar a ChatGPT y pega la siguiente plantilla maestra.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => copy(metaPrompt)}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-xl p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  <span className="text-gray-600 select-none">
                    {"// Plantilla Maestra para ChatGPT (con imagen adjunta):"}
                  </span>
                  <br />
                  <br />
                  {metaPrompt}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep("video")}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:scale-105"
                >
                  Ya tengo el prompt técnico <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. ANIMAR VIDEO
  if (step === "video") {
    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setStep("prompt_gen")}
              className="hover:text-white transition-colors flex items-center gap-1 text-gray-500 text-sm"
            >
              ← Volver
            </button>
            <Breadcrumbs activeStep={4} />
          </div>

          <div className="bg-[#0f0f12] border border-fuchsia-900/30 rounded-3xl overflow-hidden">
            <div className="bg-fuchsia-900/10 p-8 border-b border-fuchsia-900/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-fuchsia-500/20 rounded-xl text-fuchsia-400">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    3. Animar en Grok
                  </h2>
                  <p className="text-fuchsia-200/70 mt-1">
                    El paso final: junta la imagen y el prompt técnico.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid gap-4">
                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <p className="text-gray-300">
                    Sube tu <strong className="text-white">Imagen Base</strong>{" "}
                    a Grok.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <p className="text-gray-300">
                    Pega el{" "}
                    <strong className="text-white">
                      Prompt Técnico en Inglés
                    </strong>{" "}
                    que te generó ChatGPT.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="text-gray-300">¡Generar Animación!</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setStep("intro")}
                  className="text-gray-500 hover:text-white text-sm"
                >
                  Reiniciar Todo
                </button>
                <button
                  onClick={() => setStep("finished")}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Check className="w-5 h-5" /> ¡Video Generado!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. FINISHED
  if (step === "finished") {
    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
            <Rocket className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-4xl font-bold text-white">¡Misión Cumplida!</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Has completado el flujo profesional completo. Ahora tienes una
            imagen coherente y un video animado con intención precisa.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setStep("intro");
                setMission(null);
              }}
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold mt-8"
            >
              Hacer otra misión
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-3 rounded-xl font-bold mt-8"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TextToVideoWorkflow;
