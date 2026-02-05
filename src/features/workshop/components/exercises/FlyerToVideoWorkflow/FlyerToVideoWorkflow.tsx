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
  Palmtree,
  Mountain,
  Building2,
  Umbrella,
  Heart,
} from "lucide-react";
import { useCopyToClipboard } from "../../../../../hooks";

// Definición de temas con ejemplos estructurados
const TEMAS_EJEMPLOS = {
  playa: {
    nombre: "Playa & Resort",
    icono: Palmtree,
    color: "cyan",
    ejemplo: {
      rol: "Director creativo de agencia de viajes especializada en destinos de playa y resort all-inclusive",
      objetivo: "Crear un spot publicitario que inspire a familias y parejas a reservar vacaciones de playa con urgencia promocional",
      escenaEmocion: "Playas paradisíacas del Caribe mexicano al atardecer, sensación de libertad, relajación y escape del estrés cotidiano",
      estiloVisual: "Cinematográfico premium con tonos cálidos dorados, agua cristalina turquesa, tomas aéreas de drone, slow motion en olas",
      salidaEsperada: "4 escenas de video 9:16 de 6 segundos cada una, calidad broadcast TV, con sugerencias de locución en español mexicano",
      destino: "Cancún, Riviera Maya",
      imagen: "Pareja caminando de la mano en playa de arena blanca, agua turquesa cristalina, atardecer dorado, palmeras al fondo",
      titulo: "Escápate al Paraíso",
      duracion: "5 días / 4 noches",
      precio: "$12,999 MXN",
      beneficios: "All-inclusive, Vuelos directos, Traslados incluidos",
      color: "Turquesa tropical",
      ambiente: "Relajación, Romance, Escape"
    }
  },
  aventura: {
    nombre: "Aventura & Naturaleza",
    icono: Mountain,
    color: "emerald",
    ejemplo: {
      rol: "Director creativo especializado en turismo de aventura y ecoturismo para viajeros exploradores",
      objetivo: "Inspirar a aventureros a descubrir destinos naturales únicos con experiencias auténticas e inolvidables",
      escenaEmocion: "Paisajes montañosos épicos de Islandia, cascadas monumentales, sensación de asombro, descubrimiento y conexión con la naturaleza",
      estiloVisual: "Épico cinematográfico estilo documental National Geographic, tonos verdes y azules intensos, tomas dramáticas de paisajes",
      salidaEsperada: "4 escenas de video 9:16 de 6 segundos cada una, estética de película de aventura, transiciones fluidas",
      destino: "Islandia - Tierra de Hielo y Fuego",
      imagen: "Viajero frente a cascada Skógafoss, arcoíris visible, musgo verde brillante, cielo dramático con nubes",
      titulo: "Conquista lo Imposible",
      duracion: "8 días / 7 noches",
      precio: "$45,000 MXN",
      beneficios: "Guía experto, Aurora boreal, Glaciares privados",
      color: "Verde bosque",
      ambiente: "Aventura, Épico, Descubrimiento"
    }
  },
  ciudad: {
    nombre: "Ciudad & Cultura",
    icono: Building2,
    color: "violet",
    ejemplo: {
      rol: "Director creativo de turismo cultural urbano para viajeros sofisticados que buscan arte, historia y gastronomía",
      objetivo: "Atraer a viajeros culturales a explorar las joyas arquitectónicas, museos y experiencias gastronómicas de ciudades europeas",
      escenaEmocion: "Calles empedradas de Roma al amanecer, arquitectura histórica majestuosa, sensación de elegancia, historia viva y sofisticación",
      estiloVisual: "Cinematográfico elegante estilo película europea, tonos cálidos ocres y dorados, fotografía de golden hour, movimientos suaves",
      salidaEsperada: "4 escenas de video 9:16 de 6 segundos cada una, calidad premium lifestyle, narración envolvente",
      destino: "Roma, Italia",
      imagen: "Vista del Coliseo al amanecer dorado, calle italiana con scooter vintage, fuente de Trevi iluminada",
      titulo: "Vive la Dolce Vita",
      duracion: "7 días / 6 noches",
      precio: "$35,000 MXN",
      beneficios: "Tours VIP sin filas, Cenas gourmet, Hotel céntrico",
      color: "Dorado romano",
      ambiente: "Cultura, Elegancia, Historia"
    }
  },
  crucero: {
    nombre: "Crucero & Lujo",
    icono: Umbrella,
    color: "blue",
    ejemplo: {
      rol: "Director creativo de marketing de cruceros de lujo para familias y parejas que buscan experiencias all-inclusive premium",
      objetivo: "Posicionar el crucero como la experiencia vacacional definitiva donde el viaje es tan importante como el destino",
      escenaEmocion: "Cubierta de crucero de lujo al atardecer navegando el Mediterráneo, sensación de exclusividad, libertad infinita y servicio impecable",
      estiloVisual: "Ultra premium y aspiracional, tonos azules profundos y blancos brillantes, tomas cinematográficas del barco y destinos",
      salidaEsperada: "4 escenas de video 9:16 de 6 segundos cada una, estética de marca de lujo, transiciones elegantes",
      destino: "Crucero Mediterráneo - Barcelona a Roma",
      imagen: "Pareja brindando champagne en balcón de suite, vista al mar infinito, puesta de sol espectacular, barco navegando",
      titulo: "Navega Hacia tus Sueños",
      duracion: "10 días / 9 noches",
      precio: "$55,000 MXN",
      beneficios: "Suite con balcón, Bebidas premium, 5 destinos incluidos",
      color: "Azul océano profundo",
      ambiente: "Lujo, Exclusividad, Libertad"
    }
  },
  romantico: {
    nombre: "Romántico & Luna de Miel",
    icono: Heart,
    color: "rose",
    ejemplo: {
      rol: "Director creativo especializado en viajes románticos y lunas de miel para parejas enamoradas",
      objetivo: "Crear una experiencia visual irresistible que haga que las parejas imaginen su momento perfecto juntos",
      escenaEmocion: "Maldivas al atardecer, villas sobre el agua cristalina, intimidad perfecta, romance de película y momentos inolvidables",
      estiloVisual: "Romántico cinematográfico con tonos rosados, dorados suaves, bokeh de luces, tomas íntimas y emotivas",
      salidaEsperada: "4 escenas de video 9:16 de 6 segundos cada una, estética de película romántica, música sugerida emotiva",
      destino: "Maldivas - Paraíso del Romance",
      imagen: "Pareja cenando en muelle privado sobre el agua, velas flotantes, cielo estrellado, villa overwater iluminada",
      titulo: "Tu Historia de Amor Comienza Aquí",
      duracion: "6 días / 5 noches",
      precio: "$89,000 MXN",
      beneficios: "Villa overwater, Cena romántica privada, Spa para parejas",
      color: "Rosa atardecer",
      ambiente: "Romance, Intimidad, Ensueño"
    }
  }
};

type TemaKey = keyof typeof TEMAS_EJEMPLOS;

const FlyerToVideoWorkflow = () => {
  // ESTADOS
  const [step, setStep] = useState("intro"); // intro, flyer_data, prompt_gen, finished
  const [selectedTema, setSelectedTema] = useState<TemaKey | null>(null);
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

  // Función para aplicar ejemplo de tema
  const aplicarEjemplo = (tema: TemaKey) => {
    setSelectedTema(tema);
    const ejemplo = TEMAS_EJEMPLOS[tema].ejemplo;
    setInputs({
      destino: ejemplo.destino,
      imagen: ejemplo.imagen,
      titulo: ejemplo.titulo,
      duracion: ejemplo.duracion,
      precio: ejemplo.precio,
      beneficios: ejemplo.beneficios,
      color: ejemplo.color,
      ambiente: ejemplo.ambiente,
    });
  };

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
    const temaActual = selectedTema ? TEMAS_EJEMPLOS[selectedTema] : null;
    
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 font-sans animate-fade-in">
        <div className="max-w-5xl mx-auto">
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
              Define la Imagen Base
            </h2>
            <p className="text-gray-400">
              Selecciona un tema para ver ejemplos estructurados, o rellena manualmente los datos.
            </p>
          </div>

          {/* SELECTOR DE TEMAS */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">
              Elige un tema para cargar un ejemplo completo:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(Object.keys(TEMAS_EJEMPLOS) as TemaKey[]).map((key) => {
                const tema = TEMAS_EJEMPLOS[key];
                const IconComponent = tema.icono;
                const isSelected = selectedTema === key;
                const colorClasses: Record<string, string> = {
                  cyan: isSelected ? "border-cyan-500 bg-cyan-900/30 text-cyan-300" : "border-gray-700 hover:border-cyan-500/50",
                  emerald: isSelected ? "border-emerald-500 bg-emerald-900/30 text-emerald-300" : "border-gray-700 hover:border-emerald-500/50",
                  violet: isSelected ? "border-violet-500 bg-violet-900/30 text-violet-300" : "border-gray-700 hover:border-violet-500/50",
                  blue: isSelected ? "border-blue-500 bg-blue-900/30 text-blue-300" : "border-gray-700 hover:border-blue-500/50",
                  rose: isSelected ? "border-rose-500 bg-rose-900/30 text-rose-300" : "border-gray-700 hover:border-rose-500/50",
                };
                
                return (
                  <button
                    key={key}
                    onClick={() => aplicarEjemplo(key)}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${colorClasses[tema.color]}`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">{tema.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EJEMPLO ESTRUCTURADO - Solo visible si hay tema seleccionado */}
          {temaActual && (
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Ejemplo de Prompt Estructurado: {temaActual.nombre}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs font-bold">ROL</span>
                    <span className="text-gray-400 text-xs">¿Quién eres?</span>
                  </div>
                  <p className="text-sm text-gray-200">{temaActual.ejemplo.rol}</p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-4 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs font-bold">OBJETIVO</span>
                    <span className="text-gray-400 text-xs">¿Qué quieres hacer?</span>
                  </div>
                  <p className="text-sm text-gray-200">{temaActual.ejemplo.objetivo}</p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-bold">ESCENA + EMOCIÓN</span>
                    <span className="text-gray-400 text-xs">¿Dónde y qué sentimiento?</span>
                  </div>
                  <p className="text-sm text-gray-200">{temaActual.ejemplo.escenaEmocion}</p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-4 border border-pink-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded text-xs font-bold">ESTILO VISUAL</span>
                    <span className="text-gray-400 text-xs">¿Cómo debe verse?</span>
                  </div>
                  <p className="text-sm text-gray-200">{temaActual.ejemplo.estiloVisual}</p>
                </div>
                
                <div className="md:col-span-2 bg-black/30 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold">SALIDA ESPERADA</span>
                    <span className="text-gray-400 text-xs">¿Qué formato?</span>
                  </div>
                  <p className="text-sm text-gray-200">{temaActual.ejemplo.salidaEsperada}</p>
                </div>
              </div>
            </div>
          )}

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
