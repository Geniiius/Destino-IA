/**
 * @file PracticeScreen.tsx
 * @description Pantalla de práctica con formulario y timer
 */

import React from "react";
import { Send, LogOut, Sparkles } from "lucide-react";
import type { PracticeScreenProps } from "../types";
import { UI_TEXTS, COLOR_STYLES } from "../constants";

const PracticeScreenComponent: React.FC<PracticeScreenProps> = ({
  answers,
  onAnswerChange,
  onSubmit,
  onExit,
}) => {
  const { practice } = UI_TEXTS;

  // Verificar si todos los campos están completos
  const isComplete = Object.values(answers).every(
    (value) => value && value.trim().length > 0,
  );
  const completedCount = Object.values(answers).filter(
    (value) => value && value.trim().length > 0,
  ).length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          {/* Título */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {practice.title}
            </h1>
            <p className="text-gray-400">{practice.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Progreso:</span>
          <span className="text-white font-bold">
            {completedCount} / {practice.fields.length}
          </span>
        </div>

        <div className="flex gap-1">
          {practice.fields.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-1 rounded-full transition-all ${
                index < completedCount ? "bg-emerald-500" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-4 mb-8">
        {practice.fields.map((field) => {
          const value = answers[field.key as keyof typeof answers] || "";
          const isFilled = value.trim().length > 0;
          const colorKey =
            field.key === "rol"
              ? "blue"
              : field.key === "objetivo"
                ? "emerald"
                : field.key === "escena" || field.key === "emocion"
                  ? "amber"
                  : field.key === "estilo"
                    ? "purple"
                    : "pink";
          const colorStyle = COLOR_STYLES[colorKey];

          return (
            <div
              key={field.key}
              className={`bg-white/5 backdrop-blur-xl border ${
                isFilled ? colorStyle.border : "border-white/10"
              } rounded-2xl p-6 transition-all hover:bg-white/10 ${
                isFilled ? colorStyle.glow : ""
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 ${
                    isFilled ? colorStyle.bg : "bg-white/5"
                  } border ${
                    isFilled ? colorStyle.border : "border-white/10"
                  } rounded-xl flex items-center justify-center text-xl transition-all`}
                >
                  {field.icon}
                </div>

                <div className="flex-1">
                  <label
                    htmlFor={field.key}
                    className={`block text-sm font-bold mb-2 ${
                      isFilled ? colorStyle.text : "text-gray-400"
                    } transition-colors`}
                  >
                    {field.label}
                  </label>

                  <textarea
                    id={field.key}
                    value={value}
                    onChange={(e) =>
                      onAnswerChange(field.key as any, e.target.value)
                    }
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-black/50 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista previa del prompt (si está completo) */}
      {isComplete && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 mb-8 animate-in fade-in duration-500">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-400">
              VISTA PREVIA DEL PROMPT:
            </h3>
          </div>

          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <p className="text-gray-200 text-sm leading-relaxed">
              Actúa como {answers.rol}. {answers.objetivo}. La escena es{" "}
              {answers.escena} que transmite {answers.emocion}. Usa un estilo{" "}
              {answers.estilo}. {answers.salida}.
            </p>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4 justify-between items-center">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 font-medium transition-all hover:scale-105"
        >
          <LogOut className="w-5 h-5" />
          <span>{practice.exitButton}</span>
        </button>

        <button
          onClick={onSubmit}
          disabled={!isComplete}
          className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          <span>{practice.submitButton}</span>
        </button>
      </div>

      {/* Info de ayuda */}
      {!isComplete && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Completa todos los campos para poder generar tu prompt
          </p>
        </div>
      )}
    </div>
  );
};

// Exportar con React.memo para evitar re-renders innecesarios
export const PracticeScreen = React.memo(PracticeScreenComponent);
