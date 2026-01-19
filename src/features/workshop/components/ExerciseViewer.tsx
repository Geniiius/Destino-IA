import React, { useState } from "react";
import { Exercise } from "../../../data/exercises";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { X, Play } from "lucide-react";

interface ExerciseViewerProps {
  exercise: Exercise;
  onComplete: () => void;
  userId: string;
}

export const ExerciseViewer: React.FC<ExerciseViewerProps> = ({
  exercise,
  onComplete,
}) => {
  const [showGoodPrompt, setShowGoodPrompt] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              {exercise.part}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-bold text-white uppercase ${exercise.typeColor}`}
            >
              {exercise.type}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-4xl">{exercise.emoji}</span>
            <span>
              {exercise.id}. {exercise.title}
            </span>
          </h2>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-2">
              <span>⏱️</span> {exercise.time}
            </span>
            <span className="flex items-center gap-2">
              <span>📊</span> {exercise.level}
            </span>
          </div>
        </div>

        {/* Botón Ver ejemplo */}
        {exercise.aiExample && (
          <div className="mb-6 animate-fadeIn">
            <Button
              onClick={() => setShowExample(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">🎨</span>
              Ver ejemplo
            </Button>
          </div>
        )}

        {/* Objectif */}
        <Card className="bg-emerald-500/5 border-emerald-500/20 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold mb-1 uppercase tracking-wider text-xs">
                OBJECTIF
              </h3>
              <p className="text-white text-lg leading-relaxed">
                {exercise.objective}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Colonne gauche - Apprentissages et instructions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Apprentissages */}
            <Card className="bg-slate-800/40 border-slate-700/50 p-6">
              <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                <span>📚</span> CE QUE VOUS ALLEZ APPRENDRE
              </h3>
              <ul className="space-y-3">
                {exercise.learns.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-300 text-sm"
                  >
                    <span className="text-emerald-400 font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Message clé */}
            <Card className="bg-amber-500/5 border-amber-500/20 p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-amber-400 font-bold mb-1 uppercase tracking-wider text-xs">
                    CONSEIL PRO
                  </h3>
                  <p className="text-white text-sm font-semibold italic">
                    {exercise.keyMessage}
                  </p>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-500/5 border-blue-500/20 p-6">
              <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                <span>📝</span> ÉTAPES À SUIVRE
              </h3>
              <ol className="space-y-3">
                {exercise.instructions.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-300 text-sm"
                  >
                    <span className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-blue-400 font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          {/* Colonne droite - Prompts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mauvais prompt */}
            <Card className="bg-red-500/5 border-red-500/20 overflow-hidden">
              <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20 flex items-center justify-between">
                <h3 className="text-red-400 font-bold flex items-center gap-3 text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {exercise.badPrompt.title}
                </h3>
                <Button
                  onClick={() =>
                    copyToClipboard(exercise.badPrompt.content, "bad")
                  }
                  className="text-xs px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-300"
                >
                  {copied === "bad" ? "✓ Copié" : "📋 Copier"}
                </Button>
              </div>
              <div className="p-6">
                <pre className="text-slate-400 text-sm whitespace-pre-wrap font-mono bg-slate-900/60 p-4 rounded-lg border border-slate-700/50 overflow-x-auto">
                  {exercise.badPrompt.content}
                </pre>
                <div className="mt-4 flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/5 p-3 rounded-lg border border-red-400/10">
                  <span>Résultat:</span> {exercise.badPrompt.result}
                </div>
              </div>
            </Card>

            {/* Bouton révélation */}
            {!showGoodPrompt && (
              <Button
                onClick={() => setShowGoodPrompt(true)}
                className="w-full py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105"
              >
                <span className="text-2xl mr-2">✨</span>
                RÉVÉLER LE PROMPT PROFESSIONNEL RCTF
              </Button>
            )}

            {/* Bon prompt */}
            {showGoodPrompt && (
              <Card className="bg-emerald-500/5 border-emerald-500/30 overflow-hidden animate-fadeIn">
                <div className="bg-emerald-500/10 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
                  <h3 className="text-emerald-400 font-bold flex items-center gap-3 text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow" />
                    {exercise.goodPrompt.title}
                  </h3>
                  <Button
                    onClick={() =>
                      copyToClipboard(exercise.goodPrompt.content, "good")
                    }
                    className="text-xs px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                  >
                    {copied === "good" ? "✓ Copié" : "📋 Copier"}
                  </Button>
                </div>
                <div className="p-6">
                  <pre className="text-emerald-50 text-sm whitespace-pre-wrap font-mono bg-slate-900/60 p-4 rounded-lg border border-emerald-500/10 max-h-96 overflow-y-auto">
                    {exercise.goodPrompt.content}
                  </pre>
                  <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-400/5 p-3 rounded-lg border border-emerald-400/10">
                    <span>Impact:</span> {exercise.goodPrompt.result}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Bouton de validation */}
        <div className="flex justify-center pt-6 border-t border-slate-700/50">
          <Button
            onClick={onComplete}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            ✓ J'ai terminé cet exercice
          </Button>
        </div>
      </div>

      {/* Modal Ver ejemplo */}
      {showExample && exercise.aiExample && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowExample(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🎨</span>
                Ejemplo generado con IA
              </h3>
              <button
                onClick={() => setShowExample(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Imagen o Video */}
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                {exercise.aiExample.type === "image" ? (
                  <img
                    src={exercise.aiExample.url}
                    alt="Ejemplo generado con IA"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="relative aspect-video bg-slate-800">
                    <video
                      src={exercise.aiExample.url}
                      controls
                      className="w-full h-full"
                    >
                      Tu navegador no soporta el elemento video.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Play size={64} className="text-white opacity-20" />
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción opcional */}
              {exercise.aiExample.description && (
                <Card className="bg-blue-500/5 border-blue-500/20 p-4">
                  <p className="text-slate-300 text-sm">
                    {exercise.aiExample.description}
                  </p>
                </Card>
              )}

              {/* Prompt utilizado */}
              <Card className="bg-purple-500/5 border-purple-500/20 overflow-hidden">
                <div className="bg-purple-500/10 px-6 py-4 border-b border-purple-500/20">
                  <h4 className="text-purple-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                    <span>💬</span> PROMPT UTILIZADO PARA GENERAR ESTE EJEMPLO
                  </h4>
                </div>
                <div className="p-6">
                  <pre className="text-purple-50 text-sm whitespace-pre-wrap font-mono bg-slate-900/60 p-4 rounded-lg border border-purple-500/10">
                    {exercise.aiExample.prompt}
                  </pre>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(exercise.aiExample!.prompt);
                      setCopied("example");
                      setTimeout(() => setCopied(null), 2000);
                    }}
                    className="mt-4 text-xs px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
                  >
                    {copied === "example" ? "✓ Copiado" : "📋 Copiar prompt"}
                  </Button>
                </div>
              </Card>

              {/* Botón cerrar */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowExample(false)}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .shadow-glow {
          box-shadow: 0 0 10px rgba(16, 185, 129, 1);
        }
      `}</style>
    </div>
  );
};
