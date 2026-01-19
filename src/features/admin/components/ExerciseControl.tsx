import React, { useState } from "react";
import { exercises, Exercise } from "../../../data/exercises";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { ExerciseViewer } from "../../workshop/components/ExerciseViewer";

interface ExerciseControlProps {
  sessionId: string;
  onLaunchExercise: (exercise: Exercise) => void;
  onStopExercise: () => void;
  currentExercise: Exercise | null;
  isExerciseActive: boolean;
}

export const ExerciseControl: React.FC<ExerciseControlProps> = ({
  sessionId,
  onLaunchExercise,
  onStopExercise,
  currentExercise,
  isExerciseActive,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [filter, setFilter] = useState<string>("all");
  const [showDetails, setShowDetails] = useState(false);
  const [showParticipantPreview, setShowParticipantPreview] = useState(false);

  // Filtrer les exercices selon le type
  const filteredExercises = exercises.filter((ex) => {
    if (filter === "all") return true;
    return ex.type === filter;
  });

  const exerciseTypes = [
    { value: "all", label: "Tous", icon: "📚" },
    { value: "FUNDAMENTO", label: "Fondements", icon: "🎯" },
    { value: "PRÁCTICA", label: "Pratique", icon: "🎬" },
    { value: "AVANZADO", label: "Avancé", icon: "✨" },
    { value: "MARKETING", label: "Marketing", icon: "📱" },
  ];

  const handleLaunch = () => {
    if (selectedExercise) {
      onLaunchExercise(selectedExercise);
      setShowDetails(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            🎯
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Module Exercices & Quiz
            </h2>
            <p className="text-sm text-slate-400">
              Pilotage de session en temps réel
            </p>
          </div>
        </div>

        {isExerciseActive && currentExercise && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-emerald-400">
                Exercice en cours
              </span>
            </div>
            <Button
              onClick={() => setShowParticipantPreview(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              👁️ Vue Participant
            </Button>
            <Button
              onClick={onStopExercise}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              🛑 Terminer l'exercice
            </Button>
          </div>
        )}
      </div>

      {/* État de la présentation */}
      <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isExerciseActive
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {isExerciseActive ? "⏸️" : "▶️"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {isExerciseActive
                  ? "Présentation en pause"
                  : "Présentation active"}
              </p>
              <p className="text-xs text-slate-400">
                {isExerciseActive
                  ? "Les participants travaillent sur l'exercice"
                  : "Prêt à lancer un exercice"}
              </p>
            </div>
          </div>
          {isExerciseActive && currentExercise && (
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-400">
                {currentExercise.title}
              </p>
              <p className="text-xs text-slate-400">
                Durée: {currentExercise.time}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {exerciseTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filter === type.value
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Liste des exercices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-[500px] overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise);
              setShowDetails(true);
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedExercise?.id === exercise.id
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
            } ${
              currentExercise?.id === exercise.id ? "ring-2 ring-amber-500" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl">{exercise.emoji}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${exercise.typeColor} text-white font-bold`}
              >
                {exercise.type}
              </span>
            </div>
            <h3 className="font-bold text-white mb-1 text-sm">
              {exercise.id}. {exercise.title}
            </h3>
            <p className="text-xs text-slate-400 mb-2">{exercise.part}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>⏱️ {exercise.time}</span>
              <span>•</span>
              <span>📊 {exercise.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Détails de l'exercice sélectionné */}
      {showDetails && selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedExercise.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedExercise.id}. {selectedExercise.title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {selectedExercise.part}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Objectif */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  🎯 Objectif
                </h3>
                <p className="text-white">{selectedExercise.objective}</p>
              </div>

              {/* Apprentissages */}
              <div>
                <h3 className="text-violet-400 font-bold mb-3 flex items-center gap-2">
                  📚 Apprentissages clés
                </h3>
                <ul className="space-y-2">
                  {selectedExercise.learns.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-slate-300"
                    >
                      <span className="text-emerald-400">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  📝 Instructions
                </h3>
                <ol className="space-y-2">
                  {selectedExercise.instructions.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Message clé */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  💡 Message clé
                </h3>
                <p className="text-white italic">
                  {selectedExercise.keyMessage}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleLaunch}
                  disabled={isExerciseActive}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExerciseActive
                    ? "⏸️ Exercice déjà en cours"
                    : "🚀 Lancer cet exercice"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation Vue Participant */}
      {showParticipantPreview && currentExercise && isExerciseActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-7xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header du modal */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  👁️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Prévisualisation Vue Participant
                  </h3>
                  <p className="text-sm text-blue-100">
                    Voici ce que voient les participants en ce moment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-sm font-semibold text-white">
                    Mode Test
                  </span>
                </div>
                <Button
                  onClick={() => setShowParticipantPreview(false)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  ✕ Fermer
                </Button>
              </div>
            </div>

            {/* Contenu: Vue Participant */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <ExerciseViewer
                exercise={currentExercise}
                onComplete={() => {
                  // En mode test, on ne fait rien (prévisualisation uniquement)
                }}
                userId="admin-preview"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
