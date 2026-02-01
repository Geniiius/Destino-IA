import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Check,
  Copy,
  Film,
  Video,
  Image as ImageIcon,
  Megaphone,
  Tv,
  PenTool,
  Rocket,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

const FlyerToVideoWorkflow = () => {
  // ESTADOS
  const [step, setStep] = useState("intro"); // intro, flyer_data, prompt_gen, finished
  const [inputs, setInputs] = useState({
    destino: "",
    imagen: "",
    titulo: "",
    duracion: "",
    precio: "",
    beneficios: "",
    color: "",
    ambiente: "",
  });

  // Use copy hook
  const { copied, copy } = useCopyToClipboard();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // Helper para breadcrumbs
  const Breadcrumbs = ({ activeStep }: { activeStep: number }) => (
    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
      <span
        className={
          activeStep === 1
            ? "text-white bg-cyan-900/50 border border-cyan-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        1. DATOS DEL FLYER
      </span>
      <span>→</span>
      <span
        className={
          activeStep === 2
            ? "text-white bg-orange-900/50 border border-orange-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        2. PROMPT DIRECTOR TV
      </span>
      <span>→</span>
      <span
        className={
          activeStep === 3
            ? "text-white bg-green-900/50 border border-green-500/50 px-2 py-1 rounded"
            : ""
        }
      >
        3. PRODUCCIÓN
      </span>
    </div>
  );

  // --- VISTAS ---

  // 1. INTRO
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 font-sans flex flex-col items-center justify-center animate-fade-in">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-900/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold tracking-wider uppercase">
            <Megaphone className="w-3 h-3" /> Flyer to Video
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              Flyer to Video <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-orange-400 to-red-500">
                4 Escenas
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Aprende el flujo de trabajo de una agencia real: Primero diseñas
              la oferta (Flyer) y luego la transformas en un Spot de TV
              emocional usando IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto mt-8">
            <div className="bg-[#0f0f12] border border-gray-800 rounded-2xl p-8 hover:border-cyan-500/30 transition-colors group">
              <div className="p-3 bg-cyan-500/10 rounded-xl w-fit mb-4 group-hover:bg-cyan-500/20">
                <ImageIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fase 1: El Flyer
              </h3>
              <p className="text-sm text-gray-400">
                Define los datos duros: Precio, Destino y Beneficios.
              </p>
            </div>

            <div className="bg-[#0f0f12] border border-gray-800 rounded-2xl p-8 hover:border-orange-500/30 transition-colors group">
              <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-4 group-hover:bg-orange-500/20">
                <Tv className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fase 2: El Spot
              </h3>
              <p className="text-sm text-gray-400">
                Actúa como Director Creativo para generar 4 escenas de video.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep("flyer_data")}
            className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:scale-105 flex items-center gap-2"
          >
            Iniciar Campaña <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. FASE 1: DATOS DEL FLYER
  if (step === "flyer_data") {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 font-sans animate-fade-in">
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
            <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <PenTool className="w-8 h-8 text-cyan-500" />
              Diseña la Oferta
            </h2>
            <p className="text-gray-400">
              Rellena los datos clave de tu Flyer. Esto será la base de todo el
              spot publicitario.
            </p>
          </div>

          <div className="bg-[#0f0f12] border border-cyan-900/30 rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  Destino
                </label>
                <input
                  name="destino"
                  value={inputs.destino}
                  onChange={handleInputChange}
                  placeholder="Ej: Islandia, Bali, Roma..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  Título del Viaje (Hook)
                </label>
                <input
                  name="titulo"
                  value={inputs.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: El Ofertón de Europa..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                Descripción de la Imagen Principal
              </label>
              <textarea
                name="imagen"
                value={inputs.imagen}
                onChange={handleInputChange}
                rows={2}
                placeholder="Ej: Una pareja frente a una cascada enorme, arcoíris visible..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-wider">
                  Duración
                </label>
                <input
                  name="duracion"
                  value={inputs.duracion}
                  onChange={handleInputChange}
                  placeholder="Ej: 8 días"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-wider">
                  Precio desde
                </label>
                <input
                  name="precio"
                  value={inputs.precio}
                  onChange={handleInputChange}
                  placeholder="Ej: $25,000 MXN"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-xs font-bold uppercase tracking-wider">
                  Color de Acento
                </label>
                <input
                  name="color"
                  value={inputs.color}
                  onChange={handleInputChange}
                  placeholder="Ej: Azul Eléctrico"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                3 Beneficios Clave
              </label>
              <input
                name="beneficios"
                value={inputs.beneficios}
                onChange={handleInputChange}
                placeholder="Ej: Vuelos incluidos, Hoteles 5*, Guía en español"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-purple-400 text-xs font-bold uppercase tracking-wider">
                Ambiente / Sentimiento
              </label>
              <input
                name="ambiente"
                value={inputs.ambiente}
                onChange={handleInputChange}
                placeholder="Ej: Aventura, Lujo, Relax, Misterio"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep("prompt_gen")}
                disabled={!inputs.destino || !inputs.titulo || !inputs.precio}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generar Prompt de TV <Tv className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. GENERAR PROMPT DE VIDEO (LA MAGIA)
  if (step === "prompt_gen") {
    // CONSTRUCCIÓN DEL PROMPT EXPERTO
    const expertPrompt = `Actúa como director creativo senior de publicidad turística para televisión mexicana, con experiencia en spots de agencias de viajes emitidos en TV nacional.

AQUÍ ESTÁN LOS DATOS DEL VIAJE (FLYER):
- Destino: ${inputs.destino}
- Imagen Principal (Ref): ${inputs.imagen}
- Título: ${inputs.titulo}
- Duración: ${inputs.duracion}
- Precio: ${inputs.precio}
- Beneficios: ${inputs.beneficios}
- Ambiente: ${inputs.ambiente}

INSTRUCCIONES:
Analiza el contenido y crea 4 escenas de text-to-video cumpliendo estrictamente:

Formato técnico obligatorio:
- 4 escenas de 6 segundos cada una
- Estilo cinematográfico premium
- Calidad publicidad de viajes en TV mexicana
- Fotorealismo, iluminación cuidada, color grading profesional
- Formato vertical 9:16
- Movimiento de cámara suave y elegante

Narrativa publicitaria:
- Todas las escenas incluyen sugerencia de locución publicitaria mexicana real (tono cálido, cercano)
- Lenguaje claro, emocional y comercial

Estructura narrativa:
- Escena 1: Impacto visual inmediato del destino (Hook)
- Escena 2: Experiencia principal del viaje (Valor)
- Escena 3: Momento aspiracional (Sueño)
- Escena 4: CIERRE PROMOCIONAL DE ALTO IMPACTO (Motion Graphics)
  IMPORTANTE: El texto del precio (${inputs.precio}) y la llamada a la acción ("Reserva ahora") NO debe ser simple texto plano.
  Especifica un estilo de "Kinetic Typography" o "3D Camera Tracking Text".
  El texto debe tener una animación de entrada elegante (fade in, slide, o tracking 3D en el entorno), ser sutil, legible, hermoso y con calidad "Broadcast Design". 
  Debe sentirse integrado en la profundidad de la escena, no como una capa pegada encima.
  ❌ REGLA ESTRICTA: NO incluyas ningún logo, escudo o marca gráfica en la descripción visual ni en la transición final. Solo tipografía y paisaje. El logo se añadirá en post-producción.

TRANSICIONES (obligatorias):
Transiciones cinematográficas suaves entre escenas. NO transición a logo.

ENTREGABLE:
Por favor, genera el guion técnico detallado para cada escena (Prompt visual + Locución sugerida).`;

    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setStep("flyer_data")}
              className="hover:text-white transition-colors flex items-center gap-1 text-gray-500 text-sm"
            >
              ← Volver
            </button>
            <Breadcrumbs activeStep={2} />
          </div>

          <div className="bg-[#0f0f12] border border-orange-900/30 rounded-3xl overflow-hidden">
            <div className="bg-orange-900/10 p-8 border-b border-orange-900/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                  <Film className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Tu Director Creativo Virtual
                  </h2>
                  <p className="text-orange-200/70 mt-1">
                    Este prompt transformará tus datos fríos en un spot de TV
                    emocionante.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* BLOQUE DE INSTRUCCIONES VISUAL */}
              <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-orange-400 font-bold border-b border-orange-500/20 pb-2">
                  <Sparkles className="w-5 h-5" />
                  <h4>EL FLUJO DE LA MAGIA</h4>
                </div>
                <div className="grid gap-3 text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500/20 text-orange-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mt-0.5">
                      1
                    </div>
                    <p>
                      <strong className="text-white">COPIA</strong> el prompt
                      que ves abajo (contiene toda tu estrategia).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500/20 text-orange-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mt-0.5">
                      2
                    </div>
                    <p>
                      <strong className="text-white">PÉGALO EN CHATGPT</strong>{" "}
                      para que escriba los 4 guiones de video detallados.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500/20 text-orange-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mt-0.5">
                      3
                    </div>
                    <p>
                      Usa esos guiones en{" "}
                      <strong className="text-white">GROK o RUNWAY</strong> para
                      generar los clips finales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => copy(expertPrompt)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copiado" : "Copiar Prompt"}
                  </button>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-xl p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed h-80 overflow-y-auto custom-scrollbar">
                  <span className="text-gray-500 select-none block mb-4 border-b border-gray-700 pb-2">
                    --- Prompt Maestro para ChatGPT ---
                  </span>
                  {expertPrompt}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep("intro")}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Empezar de nuevo
                </button>
                <button
                  onClick={() => setStep("finished")}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:scale-105"
                >
                  ¡Tengo las escenas! Ir a Producción{" "}
                  <Video className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. PRODUCCIÓN / FINAL
  if (step === "finished") {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 font-sans flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50 animate-bounce-slow">
            <Rocket className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-4xl font-bold text-white">¡Guion Listo!</h2>
          <p className="text-gray-400 text-lg">
            Ahora tienes los prompts exactos para tus 4 escenas.
            <br />
            <br />
            <span className="text-white font-bold">Tu misión final:</span>
            <br />
            1. Genera las 4 escenas en{" "}
            <span className="text-fuchsia-400">Runway o Grok</span>.
            <br />
            2. Únelas en tu editor favorito con las transiciones sugeridas.
          </p>
          <button
            onClick={() => {
              setStep("intro");
              setInputs({
                destino: "",
                imagen: "",
                titulo: "",
                duracion: "",
                precio: "",
                beneficios: "",
                color: "",
                ambiente: "",
              });
            }}
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold mt-8 transition-transform hover:scale-105"
          >
            Crear Nueva Campaña
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default FlyerToVideoWorkflow;
