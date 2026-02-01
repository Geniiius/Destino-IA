/**
 * @file features/admin/components/AdminDashboard.tsx
 * @description Dashboard d'administration du taller
 *
 * Structure:
 * - Header avec navigation par onglets (Slides, Exercices, Quiz, Défi)
 * - Volet gauche: Gestion des participants
 * - Zone centrale: Contenu actuel (Stage)
 * - Volet droit: Structure du cours (Playlist)
 */

import React, { useState, useCallback } from "react";
import { GamifiedQuiz } from "@/features/quiz";
import { AgenciaViajesExercise } from "@/features/workshop/components/exercises/AgenciaViajesExercise";
import { TextToImageIntro } from "@/features/workshop/components/exercises/TextToImageIntro";
import { TextToImageCorporate } from "@/features/workshop/components/exercises/TextToImageCorporate";
import { TextToImageAds } from "@/features/workshop/components/exercises/TextToImageAds";
import { TextToImageLogo } from "@/features/workshop/components/exercises/TextToImageLogo";
import { TextToVideoFromScratch } from "@/features/workshop/components/exercises/TextToVideoFromScratch";
import { TextToVideoWorkflow } from "@/features/workshop/components/exercises/TextToVideoWorkflow";
import { FlyerToVideoWorkflow } from "@/features/workshop/components/exercises/FlyerToVideoWorkflow";

// Import des composants modulaires du dashboard
import {
  AdminHeader,
  ParticipantList,
  ExerciseManagement,
  type ExerciseId,
} from "./dashboard";

import {
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Home,
  FileUp,
  Loader2,
  AlertCircle,
  Mail,
  Send,
  Presentation,
  BookOpen,
  HelpCircle,
  Trophy,
  LayoutList,
  Square,
  Zap,
  Target,
  Clock,
  CheckCircle,
  Eye,
  X,
} from "lucide-react";
import type { Slide, Participant, SessionState, ActiveTab } from "@/types";
import {
  mockSlides,
  mockParticipants,
  initialSessionState,
} from "@/features/admin/data/mockData";
import { useSlideGeneration } from "@/features/admin/hooks/useSlideGeneration";

// Constantes pour les badges de type
const SLIDE_TYPE_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  intro: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Introduction" },
  theory: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    label: "Théorie",
  },
  exercise: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    label: "Exercice",
  },
  challenge: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    label: "Challenge",
  },
};

// Onglets de navegación
const TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "slides", label: "Slides", icon: Presentation },
  { id: "exercises", label: "Ejercicios", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "challenge", label: "Défi", icon: Trophy },
];

export const AdminDashboard: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(mockSlides);
  const [participants] = useState<Participant[]>(mockParticipants);
  const [session, setSession] = useState<SessionState>(initialSessionState);
  const [activeTab, setActiveTab] = useState<ActiveTab>("slides");
  const [dragActive, setDragActive] = useState(false);
  const [showQuizPreview, setShowQuizPreview] = useState(false);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [showExercisePreview, setShowExercisePreview] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<ExerciseId | null>(
    null,
  );

  // Session ID pour les exercices
  const sessionId = session.id || "default-session";

  const { isProcessing, error, processDocument, clearError } =
    useSlideGeneration({
      onSuccess: (newSlides) => {
        setSlides(newSlides);
        updateSession({ current_slide_id: newSlides[0]?.id });
      },
    });

  const currentIdx = slides.findIndex((s) => s.id === session.current_slide_id);
  const currentSlide = slides[currentIdx] || slides[0];

  const updateSession = (updates: Partial<SessionState>) => {
    const newState = { ...session, ...updates };
    setSession(newState);
    // Envoyer l'état de session et le slide actuel aux participants
    const currentSlideForUpdate = slides.find(
      (s) => s.id === (updates.current_slide_id || session.current_slide_id),
    );
    window.dispatchEvent(
      new CustomEvent("sessionUpdate", {
        detail: {
          state: newState,
          slide: currentSlideForUpdate || currentSlide,
        },
      }),
    );
  };
  const handleNavigate = (direction: "prev" | "next") => {
    const newIdx =
      direction === "prev"
        ? Math.max(0, currentIdx - 1)
        : Math.min(slides.length - 1, currentIdx + 1);
    updateSession({ current_slide_id: slides[newIdx].id });
  };

  const handleLaunchExercise = (exercise: ExerciseId) => {
    setIsExerciseActive(true);
    setCurrentExercise(exercise);
    console.log(`🚀 Ejercicio ${exercise} lanzado`);
  };

  const handleStopExercise = () => {
    setIsExerciseActive(false);
    setCurrentExercise(null);
    console.log("⏹️ Ejercicio detenido");
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file?.type === "application/pdf") {
        processDocument(file);
      }
    },
    [processDocument],
  );

  const handleBack = () => {
    window.location.hash = "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSendToParticipant = (participant: Participant) => {
    // TODO: Implémenter l'envoi d'email jetable
    console.log("Envoyer email à:", participant.name);
  };

  const handleSendToAll = () => {
    // TODO: Implémenter l'envoi groupé
    console.log("Envoyer à tous les participants");
  };

  const onlineCount = participants.filter((p) => p.status === "online").length;

  return (
    <div className="relative z-10 w-full h-screen flex flex-col bg-[#0a0a0f]">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={handleBack}
        onlineCount={onlineCount}
      />

      {/* ============================================ */}
      {/* MAIN CONTENT - 3 colonnes */}
      {/* ============================================ */}
      <div className="flex-1 flex overflow-hidden">
        <ParticipantList
          participants={participants}
          onSendToParticipant={handleSendToParticipant}
          onSendToAll={handleSendToAll}
        />

        {/* ============================================ */}
        {/* ZONE CENTRALE - Le Stage */}
        {/* ============================================ */}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          {activeTab === "slides" && (
            <>
              {/* Contenu du slide actuel */}
              <div className="flex-1 flex flex-col">
                <div className="card-glass p-8 flex-1 flex flex-col">
                  {/* Header avec progression */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <LayoutList className="w-5 h-5 text-emerald-500" />
                      <span className="text-white font-medium">
                        Vue Présentateur
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span>
                        Slide {currentIdx + 1} / {slides.length}
                      </span>
                    </div>
                  </div>

                  {/* Zone de contenu principale */}
                  <div className="flex-1 bg-gradient-to-br from-black/60 to-black/40 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                    {currentSlide?.imageUrl ? (
                      /* Afficher l'image de la page PDF */
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img
                          src={currentSlide.imageUrl}
                          alt={currentSlide.title}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                        />
                      </div>
                    ) : (
                      /* Afficher le contenu texte classique */
                      <>
                        {/* Badge de type */}
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-6 ${
                            SLIDE_TYPE_STYLES[currentSlide?.type || "theory"].bg
                          } ${
                            SLIDE_TYPE_STYLES[currentSlide?.type || "theory"]
                              .text
                          }`}
                        >
                          {
                            SLIDE_TYPE_STYLES[currentSlide?.type || "theory"]
                              .label
                          }
                        </span>

                        {/* Titre */}
                        <h2 className="text-4xl font-bold text-white mb-3">
                          {currentSlide?.title}
                        </h2>

                        {/* Sous-titre */}
                        {currentSlide?.subtitle && (
                          <p className="text-emerald-400 text-xl mb-6">
                            {currentSlide.subtitle}
                          </p>
                        )}

                        {/* Description */}
                        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                          {currentSlide?.content}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => handleNavigate("prev")}
                      disabled={currentIdx === 0}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Précédent</span>
                    </button>

                    <button className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white font-semibold transition-colors">
                      <Play className="w-5 h-5" />
                      <span>Diffuser</span>
                    </button>

                    <button
                      onClick={() => handleNavigate("next")}
                      disabled={currentIdx === slides.length - 1}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white"
                    >
                      <span>Suivant</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Zone de drop PDF */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`mt-4 p-6 border-2 border-dashed rounded-xl transition-all ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-500/10"
                    : error
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                }`}
              >
                <div className="flex items-center justify-center gap-4">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                      <p className="text-white">
                        Traitement du PDF en cours...
                      </p>
                    </>
                  ) : error ? (
                    <>
                      <AlertCircle className="w-6 h-6 text-red-500" />
                      <p className="text-red-400">{error}</p>
                      <button
                        onClick={clearError}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm"
                      >
                        Réessayer
                      </button>
                    </>
                  ) : (
                    <>
                      <FileUp className="w-6 h-6 text-emerald-500" />
                      <p className="text-gray-300">
                        Glissez un PDF ici pour importer des slides
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Onglet Ejercicios */}
          {activeTab === "exercises" && (
            <ExerciseManagement
              isActive={isExerciseActive}
              currentExercise={currentExercise}
              onLaunch={handleLaunchExercise}
              onStop={handleStopExercise}
              onPreview={() => setShowExercisePreview(true)}
              participantCount={onlineCount}
            />
          )}

          {activeTab === "quiz" && (
            <div className="flex-1 flex flex-col">
              <div className="card-glass p-8 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Quiz RCTF
                      </h2>
                      <p className="text-gray-400">
                        Validación de conocimientos de Prompt Engineering
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      session.is_quiz_active
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        session.is_quiz_active
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {session.is_quiz_active
                        ? "Quiz en curso"
                        : "Quiz inactivo"}
                    </span>
                  </div>
                </div>

                {/* Quiz Info Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">15</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Preguntas
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">30s</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Por pregunta
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">2x</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Bonus Racha
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5 text-center">
                    <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {onlineCount}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Participantes
                    </div>
                  </div>
                </div>

                {/* Categories Preview */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
                    Categorías del Quiz
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { key: "R", label: "Rol", color: "blue", count: 3 },
                      {
                        key: "C",
                        label: "Contexto",
                        color: "purple",
                        count: 3,
                      },
                      { key: "T", label: "Tarea", color: "amber", count: 3 },
                      {
                        key: "F",
                        label: "Formato",
                        color: "emerald",
                        count: 3,
                      },
                      { key: "G", label: "General", color: "pink", count: 3 },
                    ].map((cat) => (
                      <div
                        key={cat.key}
                        className={`bg-${cat.color}-500/10 border border-${cat.color}-500/20 rounded-xl p-4 text-center`}
                        style={{
                          backgroundColor:
                            cat.color === "blue"
                              ? "rgba(59, 130, 246, 0.1)"
                              : cat.color === "purple"
                                ? "rgba(168, 85, 247, 0.1)"
                                : cat.color === "amber"
                                  ? "rgba(245, 158, 11, 0.1)"
                                  : cat.color === "emerald"
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : "rgba(236, 72, 153, 0.1)",
                          borderColor:
                            cat.color === "blue"
                              ? "rgba(59, 130, 246, 0.2)"
                              : cat.color === "purple"
                                ? "rgba(168, 85, 247, 0.2)"
                                : cat.color === "amber"
                                  ? "rgba(245, 158, 11, 0.2)"
                                  : cat.color === "emerald"
                                    ? "rgba(16, 185, 129, 0.2)"
                                    : "rgba(236, 72, 153, 0.2)",
                        }}
                      >
                        <span
                          className="text-2xl font-black"
                          style={{
                            color:
                              cat.color === "blue"
                                ? "#60a5fa"
                                : cat.color === "purple"
                                  ? "#c084fc"
                                  : cat.color === "amber"
                                    ? "#fbbf24"
                                    : cat.color === "emerald"
                                      ? "#34d399"
                                      : "#f472b6",
                          }}
                        >
                          {cat.key}
                        </span>
                        <p className="text-white text-sm font-medium mt-1">
                          {cat.label}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {cat.count} preguntas
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Controls */}
                <div className="mt-auto pt-6 border-t border-white/10">
                  {!session.is_quiz_active ? (
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-gray-400 text-center max-w-md">
                        Al lanzar el quiz, todos los participantes conectados
                        verán el quiz en sus pantallas y podrán comenzar a
                        responder.
                      </p>
                      <button
                        onClick={() => {
                          updateSession({
                            is_quiz_active: true,
                            quiz_started_at: new Date().toISOString(),
                          });
                        }}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                      >
                        <Play className="w-6 h-6" />
                        Lanzar Quiz a Participantes
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 px-6 py-3 rounded-xl">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Quiz activo - Los participantes están respondiendo
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowQuizPreview(true)}
                          className="flex items-center gap-3 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all"
                        >
                          <Eye className="w-5 h-5" />
                          Ver Vista de Participantes
                        </button>
                        <button
                          onClick={() => {
                            updateSession({
                              is_quiz_active: false,
                              quiz_started_at: undefined,
                            });
                          }}
                          className="flex items-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 font-medium transition-all"
                        >
                          <Square className="w-5 h-5" />
                          Detener Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "challenge" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-purple-500/50 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Défi Final
                </h3>
                <p className="text-gray-400">
                  Configurez le défi de fin d'atelier
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ============================================ */}
        {/* VOLET DROIT - Structure du Cours (Playlist) */}
        {/* ============================================ */}
        <aside className="w-80 flex-shrink-0 border-l border-white/10 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Presentation className="w-5 h-5 text-emerald-500" />
              <h2 className="text-white font-semibold">Structure du Cours</h2>
            </div>
          </div>

          {/* Liste des slides avec catégorisation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {slides.map((slide, idx) => {
              const typeStyle =
                SLIDE_TYPE_STYLES[slide.type] || SLIDE_TYPE_STYLES.theory;
              const isActive = session.current_slide_id === slide.id;

              return (
                <button
                  key={slide.id}
                  onClick={() => updateSession({ current_slide_id: slide.id })}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-emerald-500/20 border-2 border-emerald-500/50"
                      : "bg-white/5 hover:bg-white/10 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Numéro */}
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate mb-1">
                        {slide.title}
                      </p>

                      {/* Badge de type */}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
                      >
                        {typeStyle.label}
                      </span>

                      {/* Sous-titre si présent */}
                      {slide.subtitle && (
                        <p className="text-gray-500 text-xs mt-1 truncate">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Résumé en bas */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progression</span>
              <span className="text-white font-medium">
                {currentIdx + 1} / {slides.length}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIdx + 1) / slides.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Modal de vista previa del quiz */}
      {showQuizPreview && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="relative h-full">
            {/* Botón de cerrar */}
            <button
              onClick={() => setShowQuizPreview(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Etiqueta de "Vista Previa" */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl font-medium">
              <Eye className="w-4 h-4" />
              <span>Vista de Participantes</span>
            </div>

            {/* Quiz en vista previa */}
            <GamifiedQuiz
              participantName="Vista Previa"
              onClose={() => setShowQuizPreview(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de vista previa del ejercicio */}
      {showExercisePreview && currentExercise && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="relative h-full">
            {/* Botón de cerrar */}
            <button
              onClick={() => setShowExercisePreview(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Etiqueta de "Vista Previa" */}
            <div
              className={`absolute top-6 left-6 z-10 flex items-center gap-2 ${
                currentExercise === "agencia"
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : currentExercise === "intro"
                    ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                    : currentExercise === "corporate"
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                      : currentExercise === "imageToVideo" ||
                          currentExercise === "textToVideo"
                        ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                        : "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-400"
              } border px-4 py-2 rounded-xl font-medium`}
            >
              <Eye className="w-4 h-4" />
              <span>Vista Admin - Ejercicio</span>
            </div>

            {/* Ejercicio en vista previa según tipo */}
            {currentExercise === "agencia" && (
              <AgenciaViajesExercise
                participantId="admin-preview"
                participantName="Vista Previa Admin"
                sessionId={sessionId || "preview"}
              />
            )}
            {currentExercise === "intro" && <TextToImageIntro />}
            {currentExercise === "corporate" && <TextToImageCorporate />}
            {currentExercise === "ads" && <TextToImageAds />}
            {currentExercise === "logo" && <TextToImageLogo />}
            {currentExercise === "imageToVideo" && <TextToVideoWorkflow />}
            {currentExercise === "textToVideo" && <TextToVideoFromScratch />}
            {currentExercise === "flyerToVideo" && <FlyerToVideoWorkflow />}
          </div>
        </div>
      )}
    </div>
  );
};
