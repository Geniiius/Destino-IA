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
      <div className="card-glass p-6 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Ejercicios Interactivos
              </h2>
              <p className="text-xs text-gray-400">
                Lanza ejercicios prácticos para los participantes
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
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
            <span className="font-medium">
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
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {EXERCISES.map((exercise) => (
              <div
                key={exercise.id}
                className={`group border rounded-xl p-3 transition-all cursor-pointer ${
                  isActive && currentExercise === exercise.id
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {exercise.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate">
                      {exercise.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`px-1.5 py-0.5 ${exercise.badge.bg} ${exercise.badge.text} text-[10px] rounded-full`}
                      >
                        {exercise.badge.label}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full">
                        {exercise.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {!isActive && (
                  <button
                    onClick={() => onLaunch(exercise.id)}
                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 ${exercise.gradient} rounded-lg text-white text-xs font-semibold transition-all`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Lanzar
                  </button>
                )}

                {isActive && currentExercise === exercise.id && (
                  <button
                    onClick={onStop}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold transition-all"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Detener
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
