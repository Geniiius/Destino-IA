/**
 * @file PracticeScreen.tsx
 * @description Pantalla de práctica — diseño moderno con tarjetas coloridas
 */

import React from "react";
import {
  Send,
  LogOut,
  Sparkles,
  User,
  Target,
  MapPin,
  Heart,
  Palette,
  Hash,
  Eye,
} from "lucide-react";
import type { PracticeScreenProps } from "../types";
import { UI_TEXTS } from "../constants";

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
  placeholder: string;
  value: string;
  onChange: (_val: string) => void;
}

const FieldCard: React.FC<FieldCardProps> = ({
  fieldKey,
  label,
  placeholder,
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
        relative rounded-2xl border p-5 transition-all duration-300
        ${isFilled ? config.filledBg : config.cardBg}
        ${isFilled ? config.cardBorder : "border-transparent"}
        hover:shadow-md
      `}
    >
      {isFilled && (
        <Sparkles
          className={`absolute top-3 right-3 w-4 h-4 ${config.labelColor} opacity-60`}
        />
      )}

      <div className="flex items-center gap-2.5 mb-3">
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

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full bg-white border border-gray-200 rounded-xl
          px-4 py-3 text-sm text-gray-800
          placeholder-gray-400
          focus:outline-none focus:ring-2 ${config.focusRing}
          focus:border-transparent
          transition-all duration-200
          shadow-sm
        `}
      />
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

  const isComplete = Object.values(answers).every(
    (value) => value && value.trim().length > 0,
  );
  const completedCount = Object.values(answers).filter(
    (value) => value && value.trim().length > 0,
  ).length;

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

        {/* ── Grille de champs ── */}
        <div className="px-8 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {practice.fields.map((field) => (
            <FieldCard
              key={field.key}
              fieldKey={field.key}
              label={field.label}
              placeholder={field.placeholder}
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
              <p className="text-gray-600 text-sm leading-relaxed truncate">
                {isComplete
                  ? `Actúa como ${answers.rol}. ${answers.objetivo}. La escena es ${answers.escena}. Transmite ${answers.emocion}. Estilo: ${answers.estilo}. Formato: ${answers.salida}.`
                  : "Actúa como... La escena es..."}
              </p>
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
