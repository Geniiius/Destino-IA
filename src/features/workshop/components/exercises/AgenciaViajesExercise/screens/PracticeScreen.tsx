/**
 * @file PracticeScreen.tsx
 * @description Pantalla de práctica con formulario y timer
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
  FileText 
} from "lucide-react";
import type { PracticeScreenProps } from "../types";
import { UI_TEXTS, COLOR_STYLES } from "../constants";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  rol: User,
  objetivo: Target,
  escena: MapPin,
  emocion: Heart,
  estilo: Palette,
  salida: FileText,
};

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
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-center">
      {/* Header Compacto */}
      <div className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {practice.title}
            <span className="text-sm font-normal text-gray-400 bg-white/10 px-2 py-1 rounded-full">
              {completedCount}/{practice.fields.length}
            </span>
          </h1>
          <p className="text-gray-400 text-sm hidden md:block">{practice.subtitle}</p>
        </div>
        
        {/* Progress Bar Compacta */}
        <div className="flex gap-1">
          {practice.fields.map((_, index) => (
            <div
              key={index}
              className={`w-6 h-2 rounded-full transition-all ${
                index < completedCount ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Formulario en Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {practice.fields.map((field) => {
          const value = answers[field.key as keyof typeof answers] || "";
          const isFilled = value.trim().length > 0;
          
          // Mapeo seguro de color
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
          const Icon = ICON_MAP[field.key] || Sparkles;

          return (
            <div
              key={field.key}
              className={`
                relative group transition-all duration-300
                bg-black/20 backdrop-blur-sm border rounded-xl p-4
                ${isFilled ? colorStyle.border : "border-white/5 hover:border-white/20"}
                ${isFilled ? colorStyle.bg.replace('/20', '/10') : ""}
              `}
            >
              <div className="flex gap-3">
                {/* Icono */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                    ${isFilled ? colorStyle.bg : "bg-white/5 group-hover:bg-white/10"}
                    ${isFilled ? colorStyle.text : "text-gray-500 group-hover:text-gray-300"}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Input Area */}
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={field.key}
                    className={`
                      block text-xs font-bold uppercase tracking-wider mb-1.5
                      ${colorStyle.text}
                    `}
                  >
                    {field.label.split("-")[0]} {/* Solo mostramos el nombre corto */}
                  </label>

                  <textarea
                    id={field.key}
                    value={value}
                    onChange={(e) =>
                      onAnswerChange(field.key as any, e.target.value)
                    }
                    placeholder={field.placeholder}
                    rows={2} // Altura fija pequeña
                    className={`
                      w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white 
                      placeholder-gray-600 focus:outline-none focus:ring-1 focus:bg-black/60 transition-all resize-none
                      ${isFilled ? "border-white/20" : ""}
                      focus:${colorStyle.border.replace('border-', 'ring-')}
                    `}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista previa del prompt (si está completo o casi completo) */}
      <div className={`transition-all duration-500 overflow-hidden ${isComplete ? "max-h-40 opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
        <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
             <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              Vista Previa
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
              Actúa como {answers.rol}. {answers.objetivo}. La escena es {answers.escena}...
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-between items-center mt-auto">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">{practice.exitButton}</span>
        </button>

        <button
          onClick={onSubmit}
          disabled={!isComplete}
          className={`
            group flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-white transition-all
            ${isComplete 
              ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:scale-105 shadow-lg shadow-emerald-500/20" 
              : "bg-gray-800 text-gray-500 cursor-not-allowed"}
          `}
        >
          <span>{practice.submitButton}</span>
          <Send className={`w-5 h-5 ${isComplete ? "group-hover:translate-x-1" : ""} transition-transform`} />
        </button>
      </div>
    </div>
  );
};

// Exportar con React.memo para evitar re-renders innecesarios
export const PracticeScreen = React.memo(PracticeScreenComponent);
