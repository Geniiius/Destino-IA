import React, { useState } from "react";
import {
  Lightbulb,
  Zap,
  Check,
  Copy,
  Rocket,
  Clapperboard,
  Wand2,
  Plane,
  Users,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// --- CONFIGURACIÓN DE MISIONES (CON LOS 5 PILARES) ---
const MISSIONS = {
  travel: {
    id: "travel",
    title: "Agencia de Viajes",
    desc: "Vende destinos y experiencias inolvidables.",
    icon: <Plane className="w-8 h-8 text-cyan-400" />,
    color: "cyan",
    placeholders: {
      rol: "Cineasta de Viajes de Lujo y Operador de Dron.",
      objetivo: "Promocionar un retiro exclusivo en Bali para Instagram Reels.",
      escena:
        "Amanecer en terraza de arrozales, niebla mística, paz y conexión natural.",
      estilo:
        "Cinematográfico, slow motion suave, vuelo de dron bajo (FPV), colores vibrantes.",
      salida: "Prompt de vídeo para Grok, formato vertical 9:16, duración 6 segundos.",
    },
  },
  recruitment: {
    id: "recruitment",
    title: "Reclutamiento",
    desc: "Atrae talento para tu agencia.",
    icon: <Users className="w-8 h-8 text-emerald-400" />,
    color: "emerald",
    placeholders: {
      rol: "Director de Cultura Corporativa y Video Marketing.",
      objetivo: "Atraer agentes jóvenes y dinámicos.",
      escena:
        'Oficina moderna "open space", equipo diverso celebrando, energía colaborativa.',
      estilo:
        "Estilo documental moderno, cámara en mano (handheld) ligera, luz natural.",
      salida: "Video corto de 5s para LinkedIn, formato horizontal.",
    },
  },
  corporate: {
    id: "corporate",
    title: "Corporativo",
    desc: "Imagen de marca y profesionalismo B2B.",
    icon: <Briefcase className="w-8 h-8 text-indigo-400" />,
    color: "indigo",
    placeholders: {
      rol: "Director de Publicidad Corporativa.",
      objetivo: "Transmitir solidez para una presentación de inversores.",
      escena:
        "Apretón de manos en sala de cristal con rascacielos de fondo, confianza y éxito.",
      estilo:
        "Clean corporate, cámara lenta épica, profundidad de campo (bokeh), tonos azules.",
      salida: "Clip de stock premium en 4K, formato 16:9.",
    },
  },
  promo: {
    id: "promo",
    title: "Publicidad Promocional",
    desc: "Ofertas flash, descuentos y ventas agresivas.",
    icon: <Megaphone className="w-8 h-8 text-fuchsia-400" />,
    color: "fuchsia",
    placeholders: {
      rol: "Director de Arte para Publicidad Digital.",
      objetivo: 'Anuncio de oferta "Black Friday" de alto impacto.',
      escena:
        "Maleta amarilla explotando con confeti y billetes de avión, emoción de urgencia.",
      estilo:
        "Product showcase, fondo neón abstracto, zoom in explosivo y rápido.",
      salida: "Video cuadrado 1:1 para Facebook Ads.",
    },
  },
};

export const TextToVideoFromScratch: React.FC = () => {
  // ESTADOS
  const [step, setStep] = useState("intro"); // intro, strategy, final_prompt
  const [mission, setMission] = useState<
    (typeof MISSIONS)[keyof typeof MISSIONS] | null
  >(null);

  // Inputs unificados (5 Pilares)
  const [inputs, setInputs] = useState({
    rol: "",
    objetivo: "",
    escena: "",
    estilo: "",
    salida: "",
  });

  const { copied, copy } = useCopyToClipboard();

  // UTILS
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const selectMission = (missionKey: keyof typeof MISSIONS) => {
    setMission(MISSIONS[missionKey]);
    setStep("strategy");
    // Reset
    setInputs({ rol: "", objetivo: "", escena: "", estilo: "", salida: "" });
  };

  // Helper para breadcrumbs
  const Breadcrumbs = ({ activeStep }: { activeStep: number }) => (
    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
      <span
        className={
          activeStep === 1
            ? "text-white bg-indigo-900/50 border border-indigo-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        1. DEFINIR ESTRATEGIA
      </span>
      <span>→</span>
      <span
        className={
          activeStep === 2
            ? "text-white bg-emerald-900/50 border border-emerald-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        2. GENERAR VIDEO
      </span>
    </div>
  );

  // --- VISTAS ---

  // 1. INTRO
  if (step === "intro") {
    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans flex flex-col items-center justify-center animate-fade-in">
        <div className="max-w-5xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 text-xs font-bold tracking-wider uppercase">
            <Wand2 className="w-3 h-3" /> Text to Video: From Scratch
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              Crea Video <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
                Desde Cero
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Define los <strong>5 Pilares Fundamentales</strong> para generar
              vídeos profesionales directamente desde texto, sin imagen de
              referencia.
            </p>
          </div>

          <div className="bg-[#0f0f12] border border-gray-800 rounded-3xl p-8 md:p-12">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Elige tu Misión
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(MISSIONS).map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMission(m.id as keyof typeof MISSIONS)}
                  className="group relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-cyan-500/50 transition-all duration-300 text-left flex flex-col h-full"
                >
                  <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 w-fit group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {m.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. FASE ESTRATEGIA (LOS 5 PILARES)
  if (step === "strategy") {
    return (
      <div className="min-h-full bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-3xl mx-auto">
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
            <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Clapperboard className="w-8 h-8 text-indigo-500" />
              Define los 5 Pilares
            </h2>
            <p className="text-gray-400">
              Estás creando para:{" "}
              <span className="text-cyan-400 font-bold">{mission?.title}</span>.
            </p>
          </div>

          <div className="bg-[#0f0f12] border border-indigo-900/30 rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

            {/* 1. ROL */}
            <div className="space-y-2">
              <label className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="bg-indigo-500/20 px-1.5 py-0.5 rounded">
                  1
                </span>{" "}
                Rol (Experto)
              </label>
              <input
                name="rol"
                value={inputs.rol}
                onChange={handleInputChange}
                placeholder={mission?.placeholders.rol}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* 2. OBJETIVO */}
            <div className="space-y-2">
              <label className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  2
                </span>{" "}
                Objetivo (Meta)
              </label>
              <input
                name="objetivo"
                value={inputs.objetivo}
                onChange={handleInputChange}
                placeholder={mission?.placeholders.objetivo}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* 3. ESCENA + EMOCIÓN */}
            <div className="space-y-2">
              <label className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="bg-amber-500/20 px-1.5 py-0.5 rounded">3</span>{" "}
                Escena + Emoción
              </label>
              <textarea
                name="escena"
                value={inputs.escena}
                onChange={handleInputChange}
                rows={3}
                placeholder={mission?.placeholders.escena}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-amber-500 outline-none transition-all placeholder:text-gray-600 resize-none"
              />
            </div>

            {/* 4. ESTILO VISUAL */}
            <div className="space-y-2">
              <label className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="bg-purple-500/20 px-1.5 py-0.5 rounded">
                  4
                </span>{" "}
                Estilo Visual (Cámara y Look)
              </label>
              <textarea
                name="estilo"
                value={inputs.estilo}
                onChange={handleInputChange}
                rows={2}
                placeholder={mission?.placeholders.estilo}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600 resize-none"
              />
            </div>

            {/* 5. SALIDA ESPERADA */}
            <div className="space-y-2">
              <label className="text-pink-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="bg-pink-500/20 px-1.5 py-0.5 rounded">5</span>{" "}
                Salida Esperada (Formato)
              </label>
              <input
                name="salida"
                value={inputs.salida}
                onChange={handleInputChange}
                placeholder={mission?.placeholders.salida}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-pink-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep("final_prompt")}
                disabled={!inputs.rol || !inputs.escena || !inputs.estilo}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              >
                Generar Prompt de Video <Rocket className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. FASE FINAL: EL PROMPT
  if (step === "final_prompt") {
    const naturalPrompt = `Create a high-quality video acting as a ${inputs.rol}. 
Goal: ${inputs.objetivo}.
Scene: ${inputs.escena}.
Visual Style & Camera: ${inputs.estilo}.
Format requirements: ${inputs.salida}. Cinematic lighting, photorealistic render.`;

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

          <div className="bg-[#0f0f12] border border-emerald-900/30 rounded-3xl overflow-hidden">
            <div className="bg-emerald-900/10 p-8 border-b border-emerald-900/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <Rocket className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Tu Prompt de Video
                  </h2>
                  <p className="text-emerald-200/70 mt-1">
                    Listo para Grok.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {/* Prompt Block */}
              <div className="bg-black/30 rounded-2xl border border-emerald-500/30 overflow-hidden">
                <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between">
                  <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Tu Prompt Completo</span>
                  <span className="text-emerald-400/60 text-[10px]">Listo para copiar</span>
                </div>
                <div className="p-4 md:p-5 lg:max-h-[22vh] lg:overflow-y-auto">
                  <p className="text-emerald-400 font-semibold text-sm mb-2">Optimízame el prompt para:</p>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{naturalPrompt}</p>
                </div>
              </div>

              {/* CTA Copy Button */}
              <button
                onClick={() => copy(`Optimízame el prompt para:\n\n${naturalPrompt}`)}
                className={`w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                  copied
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {copied ? (
                  <><Check className="w-5 h-5" /> ¡Copiado al portapapeles!</>
                ) : (
                  <><Copy className="w-5 h-5" /> Copiar Prompt Completo</>
                )}
              </button>

              {/* Steps Guide */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                <p className="text-white font-bold mb-3 text-center text-base">📌 Sigue estos 3 pasos:</p>
                <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
                  {/* Step 1 */}
                  <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 lg:text-center">
                    <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-emerald-500/40">1</div>
                    <div className="pt-0.5 lg:pt-0">
                      <p className="text-emerald-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">📋 Copia tu prompt</p>
                      <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Haz clic en el botón verde de arriba. Se copia <span className="text-emerald-300 font-medium">todo el bloque</span>, incluyendo la instrucción "Optimízame el prompt para:".</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 lg:text-center">
                    <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-blue-500/40">2</div>
                    <div className="pt-0.5 lg:pt-0">
                      <p className="text-blue-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🤖 Pégalo en ChatGPT</p>
                      <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Abre <span className="text-blue-300 font-medium">ChatGPT</span>, pega el texto y envía. Él te devolverá un <span className="text-blue-300 font-medium">prompt optimizado y profesional</span> para tu video.</p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex lg:flex-col gap-3 lg:gap-2 items-start lg:items-center bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 lg:text-center">
                    <div className="flex-shrink-0 w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm lg:text-xs shadow-lg shadow-purple-500/40">3</div>
                    <div className="pt-0.5 lg:pt-0">
                      <p className="text-purple-200 font-semibold mb-1 flex items-center lg:justify-center gap-2 text-sm lg:text-xs">🎬 Genera tu video en Grok</p>
                      <p className="text-gray-200/80 text-[13px] lg:text-[11px] leading-relaxed">Copia el prompt que ChatGPT te dio, ve a <span className="text-purple-300 font-medium">Grok</span>, elige la opción <span className="text-purple-300 font-semibold">"Video"</span>, selecciona el formato que prefieras y <span className="text-purple-300 font-medium">pega el prompt</span> para generar tu video.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    setStep("intro");
                    setMission(null);
                  }}
                  className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-gray-400 hover:text-white text-xs"
                >
                  Crear otro video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
