/**
 * @file PracticeScreen.tsx
 * @description Pantalla de práctica — diseño moderno con tarjetas coloridas
 */

import React, { useState } from "react";
import {
  Send,
  LogOut,
  Sparkles,
  Check,
  User,
  Target,
  MapPin,
  Heart,
  Palette,
  Hash,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { PracticeScreenProps } from "../types";
import { UI_TEXTS } from "../constants";

// ============================================
// EJEMPLOS PRE-CONSTRUIDOS
// ============================================
const PRESET_EXAMPLES = [
  {
    id: "bali",
    emoji: "🏝️",
    title: "Bali - Lujo",
    image: "/assets/examples/agencia/bali.webp",
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-300",
    bg: "bg-cyan-50",
    answers: {
      rol: "Agente de viajes especializado en destinos asiáticos de lujo",
      objetivo: "Vender un paquete turístico de 7 días a Bali para parejas",
      escena: "Playa paradisíaca de Uluwatu al amanecer con templo en el acantilado",
      emocion: "Paz, renovación espiritual y conexión con la naturaleza",
      estilo: "Fotografía de revista de lujo tipo Condé Nast Traveler",
      salida: "Descripción promocional para Instagram (200 palabras) con 5 hashtags",
    },
  },
  {
    id: "paris",
    emoji: "🗼",
    title: "París - Romance",
    image: "/assets/examples/agencia/paris.webp",
    color: "from-pink-500 to-rose-500",
    border: "border-pink-300",
    bg: "bg-pink-50",
    answers: {
      rol: "Experto en viajes románticos por Europa",
      objetivo: "Promocionar un escapada de fin de semana a París para San Valentín",
      escena: "Cena con vista a la Torre Eiffel iluminada de noche, terraza con velas",
      emocion: "Romance, elegancia y exclusividad parisina",
      estilo: "Cinematográfico cálido, tonos dorados, estilo película francesa",
      salida: "Post para Instagram con descripción emocional y 5 hashtags en español",
    },
  },
  {
    id: "safari",
    emoji: "🦁",
    title: "Safari - Aventura",
    image: "/assets/examples/agencia/safari.webp",
    color: "from-amber-500 to-orange-500",
    border: "border-amber-300",
    bg: "bg-amber-50",
    answers: {
      rol: "Guía de safari y fotógrafo de naturaleza salvaje",
      objetivo: "Atraer aventureros a un safari de 5 días en Kenia",
      escena: "Sabana africana al atardecer con elefantes caminando hacia el horizonte",
      emocion: "Asombro, libertad y conexión con la vida salvaje",
      estilo: "Documental de National Geographic, colores tierra intensos",
      salida: "Anuncio para Facebook Ads con llamada a la acción y precio",
    },
  },
  {
    id: "caribe",
    emoji: "🌊",
    title: "Caribe - Familiar",
    image: "/assets/examples/agencia/caribe.webp",
    color: "from-teal-500 to-emerald-500",
    border: "border-teal-300",
    bg: "bg-teal-50",
    answers: {
      rol: "Asesor de viajes familiares todo incluido",
      objetivo: "Vender paquete vacacional familiar a Cancún para Semana Santa",
      escena: "Familia jugando en playa de arena blanca con agua turquesa cristalina",
      emocion: "Diversión, alegría familiar y recuerdos inolvidables",
      estilo: "Colorido y vibrante, fotos tipo catálogo de resort premium",
      salida: "Carrusel de 5 slides para Instagram con texto corto por slide",
    },
  },
  {
    id: "japon",
    emoji: "🌸",
    title: "Japón - Cultural",
    image: "/assets/examples/agencia/japon.webp",
    color: "from-fuchsia-500 to-purple-500",
    border: "border-fuchsia-300",
    bg: "bg-fuchsia-50",
    answers: {
      rol: "Especialista en turismo cultural y experiencias auténticas en Asia",
      objetivo: "Promocionar un tour de 10 días por Japón en temporada de cerezos",
      escena: "Templo de Kioto rodeado de cerezos en flor con geishas caminando",
      emocion: "Fascinación, serenidad y descubrimiento cultural milenario",
      estilo: "Minimalista japonés, tonos pastel rosa y blanco, estilo zen",
      salida: "Email marketing con itinerario resumido y botón de reserva",
    },
  },
  {
    id: "maldivas",
    emoji: "🏖️",
    title: "Maldivas - Premium",
    image: "/assets/examples/agencia/maldivas.webp",
    color: "from-sky-500 to-indigo-500",
    border: "border-sky-300",
    bg: "bg-sky-50",
    answers: {
      rol: "Consultor de viajes de ultra-lujo y luna de miel",
      objetivo: "Vender estadía de 5 noches en villa overwater en Maldivas",
      escena: "Villa sobre el agua al atardecer con piscina infinita y océano turquesa",
      emocion: "Exclusividad absoluta, intimidad y paraíso terrenal",
      estilo: "Ultra premium, editorial de lujo, iluminación golden hour",
      salida: "Landing page con descripción, 3 beneficios y formulario de contacto",
    },
  },
];

// Configuración visual por campo
const FIELD_CONFIG: Record<
  string,
  {
    icon: React.FC<{ className?: string }>;
    iconBg: string;
    labelColor: string;
    cardBg: string;
    cardBorder: string;
    focusRing: string;
    filledBg: string;
  }
> = {
  rol: {
    icon: User,
    iconBg: "bg-blue-500",
    labelColor: "text-blue-700",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-200",
    focusRing: "focus:ring-blue-400",
    filledBg: "bg-blue-100",
  },
  objetivo: {
    icon: Target,
    iconBg: "bg-green-500",
    labelColor: "text-green-700",
    cardBg: "bg-green-50",
    cardBorder: "border-green-200",
    focusRing: "focus:ring-green-400",
    filledBg: "bg-green-100",
  },
  escena: {
    icon: MapPin,
    iconBg: "bg-amber-500",
    labelColor: "text-amber-700",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-200",
    focusRing: "focus:ring-amber-400",
    filledBg: "bg-amber-100",
  },
  emocion: {
    icon: Heart,
    iconBg: "bg-red-500",
    labelColor: "text-red-600",
    cardBg: "bg-red-50",
    cardBorder: "border-red-200",
    focusRing: "focus:ring-red-400",
    filledBg: "bg-red-100",
  },
  estilo: {
    icon: Palette,
    iconBg: "bg-indigo-500",
    labelColor: "text-indigo-700",
    cardBg: "bg-indigo-50",
    cardBorder: "border-indigo-200",
    focusRing: "focus:ring-indigo-400",
    filledBg: "bg-indigo-100",
  },
  salida: {
    icon: Hash,
    iconBg: "bg-pink-500",
    labelColor: "text-pink-600",
    cardBg: "bg-pink-50",
    cardBorder: "border-pink-200",
    focusRing: "focus:ring-pink-400",
    filledBg: "bg-pink-100",
  },
};

// ── Composant carte-champ individuel ──
interface FieldCardProps {
  fieldKey: string;
  label: string;
  description?: string;
  placeholder: string;
  example?: string;
  value: string;
  onChange: (_val: string) => void;
}

const FieldCard: React.FC<FieldCardProps> = ({
  fieldKey,
  label,
  description,
  placeholder,
  example,
  value,
  onChange,
}) => {
  const config = FIELD_CONFIG[fieldKey] ?? FIELD_CONFIG.rol;
  if (!config) return null;
  const Icon = config.icon;
  const isFilled = value.trim().length > 0;

  return (
    <div
      className={`
        relative rounded-2xl border-2 p-5 transition-all duration-300
        ${isFilled ? config.filledBg : config.cardBg}
        ${isFilled ? config.cardBorder : "border-transparent"}
        hover:shadow-lg hover:scale-[1.01]
      `}
    >
      {/* Checkmark badge when filled */}
      {isFilled && (
        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${config.iconBg} flex items-center justify-center shadow-sm`}>
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-1.5">
        <div
          className={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        <span
          className={`text-xs font-extrabold uppercase tracking-widest ${config.labelColor}`}
        >
          {label.split(" - ")[0]}
        </span>
      </div>

      {/* Description text */}
      {description && (
        <p className="text-xs text-gray-500 mb-3 ml-[46px]">{description}</p>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className={`
          w-full bg-white border border-gray-200 rounded-xl
          px-4 py-3 text-sm text-gray-800
          placeholder-gray-400
          focus:outline-none focus:ring-2 ${config.focusRing}
          focus:border-transparent
          transition-all duration-200
          shadow-sm resize-none
          leading-relaxed
        `}
      />

      {/* Example hint */}
      {example && !isFilled && (
        <p className={`text-xs mt-2 ${config.labelColor} opacity-70`}>
          <span className="font-semibold">Ejemplo:</span> {example}
        </p>
      )}
    </div>
  );
};

const PracticeScreenComponent: React.FC<PracticeScreenProps> = ({
  answers,
  onAnswerChange,
  onSubmit,
  onExit,
}) => {
  const { practice } = UI_TEXTS;
  const [showExamples, setShowExamples] = useState(true);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [hoveredExample, setHoveredExample] = useState<string | null>(null);

  const isComplete = Object.values(answers).every(
    (value) => value && value.trim().length > 0,
  );
  const completedCount = Object.values(answers).filter(
    (value) => value && value.trim().length > 0,
  ).length;

  const handleSelectExample = (example: typeof PRESET_EXAMPLES[0]) => {
    setSelectedExample(example.id);
    Object.entries(example.answers).forEach(([key, value]) => {
      onAnswerChange(key as keyof typeof answers, value);
    });
    setShowExamples(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5">
      {/* ═══ Carte principale ═══ */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(240,238,255,0.95) 50%, rgba(255,240,245,0.95) 100%)",
        }}
      >
        {/* Bandeau décoratif supérieur */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* ── Header ── */}
        <div className="px-8 pt-7 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
                <span className="text-3xl">✍️</span>
                {practice.title}
                <span
                  className="text-sm font-semibold text-gray-500
                    bg-gray-200 px-3 py-1 rounded-full"
                >
                  {completedCount}/{practice.fields.length}
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1 hidden md:block">
                {practice.subtitle}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {practice.fields.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-2.5 rounded-full transition-all duration-300 ${
                    index < completedCount
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Selector de Ejemplos ── */}
        <div className="px-8 pb-3">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors mb-2"
          >
            <Sparkles className="w-4 h-4" />
            {showExamples ? "Ocultar ejemplos" : "💡 ¿Necesitas inspiración? Elige un ejemplo"}
            {showExamples ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showExamples && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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

        {/* ── Grille de champs ── */}
        <div className="px-8 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {practice.fields.map((field) => (
            <FieldCard
              key={field.key}
              fieldKey={field.key}
              label={field.label}
              description={(field as Record<string, string>).description}
              placeholder={field.placeholder}
              example={(field as Record<string, string>).example}
              value={answers[field.key as keyof typeof answers] || ""}
              onChange={(val) =>
                onAnswerChange(field.key as keyof typeof answers, val)
              }
            />
          ))}
        </div>

        {/* ── Vista Previa ── */}
        <div className="px-8 pb-6">
          <div
            className="flex items-start gap-4 rounded-2xl p-5
              bg-gradient-to-r from-teal-50 to-cyan-50
              border border-teal-200"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-extrabold text-teal-700 uppercase tracking-widest mb-1">
                Vista Previa
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isComplete
                  ? <>
                      Como <strong>{answers.rol}</strong>. {answers.objetivo}. La escena es <strong>{answers.escena}</strong>. La emoción es {answers.emocion}. El <strong>estilo</strong> visual es {answers.estilo}. Formato de salida: {answers.salida}.
                    </>
                  : "Completa todos los campos para ver tu prompt generado aquí..."}
              </p>
              {isComplete && (
                <p className="text-xs text-teal-600 mt-2 opacity-70">
                  Ejemplo: {(practice.fields[practice.fields.length - 1] as Record<string, string>).example}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Bouton Generar ── */}
        <div className="px-8 pb-7 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={!isComplete}
            className={`
              group flex items-center gap-3 px-8 py-3.5 rounded-2xl
              font-bold text-white text-base transition-all duration-300
              ${
                isComplete
                  ? `bg-gradient-to-r from-teal-500 to-blue-500
                     hover:from-teal-400 hover:to-blue-400
                     hover:scale-[1.03] hover:shadow-xl
                     shadow-lg shadow-teal-500/25`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            <span>{practice.submitButton}</span>
            <Send
              className={`w-5 h-5 ${
                isComplete ? "group-hover:translate-x-1" : ""
              } transition-transform`}
            />
          </button>
        </div>
      </div>

      {/* ── Bouton Salir (extérieur) ── */}
      <button
        onClick={onExit}
        className="flex items-center gap-2 text-gray-400 hover:text-white
          transition-colors self-start px-2 py-1"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">{practice.exitButton}</span>
      </button>
    </div>
  );
};

export const PracticeScreen = React.memo(PracticeScreenComponent);
