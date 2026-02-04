/**
 * @file ExerciseManagement.tsx
 * @description Exercise management component - displays exercise cards and controls
 */

import React from "react";
import { Play, Square, BookOpen, Eye, Users, Clock } from "lucide-react";
import { EXERCISES, type ExerciseId } from "./exerciseData";

interface ExerciseManagementProps {
  isActive: boolean;
  currentExercise: ExerciseId | null;
  onLaunch: (exercise: ExerciseId) => void;
  onStop: () => void;
  onPreview: () => void;
  participantCount: number;
}

export const ExerciseManagement: React.FC<ExerciseManagementProps> = ({
  isActive,
  currentExercise,
  onLaunch,
  onStop,
  onPreview,
  participantCount,
}) => {
  const currentExerciseData = EXERCISES.find((e) => e.id === currentExercise);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="card-glass p-8 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Ejercicios Interactivos
              </h2>
              <p className="text-gray-400">
                Lanza ejercicios prácticos para los participantes
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isActive
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-500"
              }`}
            />
            <span className="text-sm font-medium">
              {isActive ? "Ejercicio activo" : "Sin ejercicio activo"}
            </span>
          </div>
        </div>

        {/* Info del ejercicio activo - Barra compacte en haut */}
        {isActive && currentExerciseData && (
          <div
            className={`flex-shrink-0 mb-4 ${currentExerciseData.badge.bg.replace("/20", "/10")} border ${currentExerciseData.badge.bg.replace("bg-", "border-").replace("/20", "/30")} rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 ${currentExerciseData.badge.bg} rounded-lg flex items-center justify-center`}
                >
                  <span className="text-xl">{currentExerciseData.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-bold ${currentExerciseData.badge.text} truncate`}
                  >
                    Ejercicio &quot;{currentExerciseData.title}&quot; activo
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{participantCount} participantes conectados</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Duración: {currentExerciseData.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de control compacts */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onPreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Ejercicio
                </button>

                <button
                  onClick={onStop}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all"
                >
                  <Square className="w-3.5 h-3.5" />
                  Detener
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de ejercicios disponibles - Con scroll */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {EXERCISES.map((exercise) => (
              <div
                key={exercise.id}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-xl p-6 transition-all hover:scale-105 cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {exercise.emoji}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {exercise.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4">
                  {exercise.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-2 py-1 ${exercise.badge.bg} ${exercise.badge.text} text-xs rounded-full`}
                  >
                    {exercise.badge.label}
                  </span>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                    {exercise.duration}
                  </span>
                </div>

                {!isActive && (
                  <button
                    onClick={() => onLaunch(exercise.id)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${exercise.gradient} rounded-lg text-white font-semibold transition-all`}
                  >
                    <Play className="w-4 h-4" />
                    Lanzar Ejercicio
                  </button>
                )}

                {isActive && currentExercise === exercise.id && (
                  <button
                    onClick={onStop}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-semibold transition-all"
                  >
                    <Square className="w-4 h-4" />
                    Detener Ejercicio
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instrucciones cuando no hay ejercicio activo */}
        <div className="flex-shrink-0">
          {!isActive && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-2xl">💡</div>
                <div>
                  <h3 className="text-sm font-bold text-blue-400 mb-2">
                    ¿Cómo funciona?
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>
                      • Selecciona un ejercicio y haz clic en &quot;Lanzar
                      Ejercicio&quot;
                    </li>
                    <li>
                      • Todos los participantes conectados verán el ejercicio en
                      sus pantallas
                    </li>
                    <li>• Puedes detener el ejercicio en cualquier momento</li>
                    <li>
                      • Los participantes completarán el ejercicio a su propio
                      ritmo
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
