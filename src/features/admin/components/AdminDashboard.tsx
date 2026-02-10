/**
 * @file features/admin/components/AdminDashboard.tsx
 * @description Dashboard d'administration du taller — optimisé pour pilotage live
 *
 * Structure:
 * - Header compact avec navigation par onglets
 * - Barre de statut live (connexion, mode, slide pausé, bouton vue participant)
 * - Volet gauche: Gestion des participants
 * - Zone centrale: Contenu actuel (Stage) — slide occupe l'espace max
 * - Volet droit: Playlist des slides (miniatures réelles)
 *
 * Synchronisation temps réel :
 * - useLiveSession pilote l'état de session via Supabase Realtime
 * - useSlideManifest charge le manifest des slides PDF→WebP
 * - SlidePresenter affiche les slides avec préchargement
 * - Continuité : le slide en cours est mémorisé lors des pauses exercice/quiz
 */

import React, { useState, useCallback, useEffect } from "react";
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
  ParticipantManageModal,
  ExerciseManagement,
  SendMessageModal,
  BroadcastMessageModal,
  type ExerciseId,
} from "./dashboard";

import { sendDirectMessage } from "@/services/directMessages";
import { forceDisconnectAll } from "@/services/adminUsers";

// Hooks temps réel
import { useLiveSession } from "@/hooks/useLiveSession";
import { useSlideManifest } from "@/hooks/useSlideManifest";
import { SlidePresenter, SlideThumbnail } from "@/components/SlidePresenter";
import { useAuth } from "@/hooks/useAuth";
import { isAuthConfigured } from "@/services/auth";

// Vue participant (pour preview admin)
import { WorkshopView } from "@/features/workshop/components/WorkshopView";

import {
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Loader2,
  Presentation,
  HelpCircle,
  Trophy,
  Square,
  Zap,
  Target,
  Clock,
  CheckCircle,
  Eye,
  X,
  Radio,
  Pause,
  RotateCcw,
  Wifi,
  WifiOff,
  Monitor,
} from "lucide-react";
import type { Participant, ActiveTab } from "@/types";
import { useParticipants } from "@/hooks/useParticipants";

const ADMIN_STORAGE_KEY = "destino_admin_auth";

export const AdminDashboard: React.FC = () => {
  // ── Auth (pour déconnexion) ────────────────────
  const auth = useAuth();

  const handleSignOut = useCallback(async () => {
    if (isAuthConfigured()) {
      await auth.signOut();
    } else {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    window.location.hash = "";
  }, [auth]);

  // ── Hooks temps réel ──────────────────────────
  const {
    state: liveState,
    isReady: isSessionReady,
    isConnected,
    actions,
  } = useLiveSession();
  const { totalSlides, isReady: isSlidesReady } = useSlideManifest();
  const { participants: participantsData, onlineCount, refetch: refetchParticipants } = useParticipants({
    sessionId: liveState.session_id || "destino-ia-workshop",
  });

  // ── État local UI ─────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>("slides");
  const [showQuizPreview, setShowQuizPreview] = useState(false);
  const [showExercisePreview, setShowExercisePreview] = useState(false);
  const [showParticipantView, setShowParticipantView] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [managedParticipant, setManagedParticipant] =
    useState<Participant | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isDisconnectingAll, setIsDisconnectingAll] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Auto-switch to exercises tab when exercise is active ──
  useEffect(() => {
    if (isSessionReady && liveState.current_mode === "exercise") {
      setActiveTab("exercises");
    }
  }, [isSessionReady, liveState.current_mode]);

  // ── Participants (réels via hook) ──────────
  const participants: Participant[] = (participantsData ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    status: (p.status === "connected" ? "online" : "offline") as
      | "online"
      | "offline",
    assigned_email: p.email,
    joined_at: p.joined_at,
  }));

  // ── Données dérivées ──────────────────────────
  const currentIdx = liveState.current_slide_index; // 1-based
  const sessionId = liveState.session_id;
  const isExerciseActive = liveState.current_mode === "exercise";
  const currentExercise = liveState.active_exercise_id as ExerciseId | null;
  const isPaused = liveState.current_mode !== "presentation";
  const pausedAt = liveState.paused_slide_index;

  // ── Navigation slides ─────────────────────────
  const handleNavigate = useCallback(
    async (direction: "prev" | "next") => {
      if (direction === "prev") {
        await actions.previousSlide();
      } else {
        await actions.nextSlide();
      }
    },
    [actions],
  );

  // ── Exercices ─────────────────────────────────
  const handleLaunchExercise = useCallback(
    async (exercise: ExerciseId) => {
      await actions.pauseForExercise(exercise);
      console.log(
        `🚀 Exercice ${exercise} lancé (slide ${currentIdx} en pause)`,
      );
    },
    [actions, currentIdx],
  );

  const handleStopExercise = useCallback(async () => {
    setActionError(null);
    try {
      await actions.resumePresentation();
      console.log("⏹️ Exercice arrêté, reprise de la présentation");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("❌ Erreur arrêt exercice:", msg);
      setActionError(`Erreur: ${msg}. Réessayez.`);
      // Retry une fois après 1s
      setTimeout(async () => {
        try {
          await actions.resumePresentation();
          setActionError(null);
          console.log("✅ Exercice arrêté au retry");
        } catch {
          setActionError(
            "L'exercice n'a pas pu être arrêté. Rechargez la page.",
          );
        }
      }, 1000);
    }
  }, [actions]);

  // ── Navigation retour ─────────────────────────
  const handleBack = () => {
    window.location.hash = "";
  };

  // ── Messagerie ────────────────────────────────
  const handleSendToParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowMessageModal(true);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedParticipant) return;
    await sendDirectMessage(sessionId, selectedParticipant.id, message);
  };

  const handleSendToAll = () => {
    setShowBroadcastModal(true);
  };

  // ── Gestion participants ──────────────────────
  const handleManageParticipant = (participant: Participant) => {
    setManagedParticipant(participant);
  };

  const handleDisconnectAll = useCallback(async () => {
    setIsDisconnectingAll(true);
    const sid = sessionId || 'destino-ia-workshop';
    await forceDisconnectAll(sid);
    await refetchParticipants();
    setIsDisconnectingAll(false);
  }, [sessionId, refetchParticipants]);

  // ── Chargement ────────────────────────────────
  const isLoading = !isSessionReady || !isSlidesReady;

  return (
    <div className="relative z-10 w-full h-screen flex flex-col bg-[#0a0a0f]">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={handleBack}
        onlineCount={onlineCount}
        onSignOut={handleSignOut}
      />

      {/* ── Barre de statut Live (compacte) ─────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 bg-black/60 border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Indicateur de connexion */}
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <Wifi className="w-3 h-3 text-emerald-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" />
            )}
            <span
              className={`text-xs ${isConnected ? "text-emerald-400" : "text-amber-400"}`}
            >
              {isConnected ? "Connecté" : "Hors ligne"}
            </span>
          </div>

          {/* Séparateur */}
          <div className="w-px h-4 bg-white/10" />

          {/* Mode courant */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              liveState.current_mode === "presentation"
                ? "bg-emerald-500/10 text-emerald-400"
                : liveState.current_mode === "exercise"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-purple-500/10 text-purple-400"
            }`}
          >
            {liveState.current_mode === "presentation"
              ? "🖥️ Présentation"
              : liveState.current_mode === "exercise"
                ? "✏️ Exercice"
                : "❓ Quiz"}
          </span>

          {/* Slide en pause — indicateur proéminent */}
          {isPaused && pausedAt && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              ⏸ Slide {pausedAt} en pause — reprendra ici
            </span>
          )}

          {/* ── Bouton d'arrêt toujours visible quand exercice/quiz actif ── */}
          {isPaused && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={handleStopExercise}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors animate-pulse"
                title="Arrêter l'exercice / quiz et reprendre la présentation"
              >
                <Square className="w-3 h-3" />
                <span>
                  {liveState.current_mode === "exercise"
                    ? "Arrêter exercice"
                    : "Arrêter quiz"}
                </span>
              </button>
            </>
          )}

          {/* Erreur action */}
          {actionError && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              ⚠️ {actionError}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Vue Participant */}
          <button
            onClick={() => setShowParticipantView(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            title="Voir exactement ce que voient les participants"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Vue participant</span>
          </button>

          {/* Séparateur */}
          <div className="w-px h-4 bg-white/10" />

          {/* Bouton Live */}
          <button
            onClick={() => actions.toggleLive()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              liveState.is_live
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
            }`}
          >
            {liveState.is_live ? (
              <>
                <Square className="w-3 h-3" />
                <span>Arrêter</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </>
            ) : (
              <>
                <Radio className="w-3 h-3" />
                <span>Lancer la diffusion</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Bandeau de reprise (visible quand en pause exercice/quiz) ── */}
      {isPaused && pausedAt && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-amber-500/10 to-transparent border-b border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-300 text-xs">
            <Pause className="w-3.5 h-3.5" />
            <span>
              La présentation est en pause au <strong>slide {pausedAt}</strong>.
              Elle reprendra exactement à cet endroit.
            </span>
          </div>
          <button
            onClick={() => actions.resumePresentation()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reprendre au slide {pausedAt}
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* MAIN CONTENT - 3 colonnes */}
      {/* ============================================ */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <ParticipantList
          participants={participants}
          onSendToParticipant={handleSendToParticipant}
          onSendToAll={handleSendToAll}
          onManageParticipant={handleManageParticipant}
          onDisconnectAll={handleDisconnectAll}
          isDisconnectingAll={isDisconnectingAll}
        />

        {/* ============================================ */}
        {/* ZONE CENTRALE - Le Stage */}
        {/* ============================================ */}
        <main className="flex-1 flex flex-col overflow-hidden p-3">
          {/* ── Loader global ────────────────────── */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-gray-400">Chargement de la session...</p>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "slides" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="card-glass p-3 flex-1 flex flex-col min-h-0">
                {/* Header compact avec progression */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Presentation className="w-4 h-4 text-emerald-500" />
                    <span className="text-white font-medium">
                      Slide {currentIdx}
                    </span>
                    <span className="text-gray-500">/ {totalSlides}</span>
                  </div>

                  {/* Barre de progression inline */}
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentIdx / totalSlides) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs">
                      {Math.round((currentIdx / totalSlides) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Zone d'affichage du slide — remplit tout l'espace */}
                <div className="flex-1 bg-gradient-to-br from-black/60 to-black/40 rounded-xl overflow-hidden flex items-center justify-center min-h-0">
                  <SlidePresenter
                    slideIndex={currentIdx}
                    preloadAhead={5}
                    className="w-full h-full p-2"
                  />
                </div>

                {/* Navigation compacte */}
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    onClick={() => handleNavigate("prev")}
                    disabled={currentIdx <= 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Préc</span>
                  </button>

                  {/* Bouton mode : Diffuser / Pause / Reprendre */}
                  {liveState.current_mode === "presentation" ? (
                    <button
                      onClick={() => actions.toggleLive()}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-colors text-sm ${
                        liveState.is_live
                          ? "bg-amber-500 hover:bg-amber-400"
                          : "bg-emerald-500 hover:bg-emerald-400"
                      }`}
                    >
                      {liveState.is_live ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>En diffusion</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Diffuser</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => actions.resumePresentation()}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-white font-semibold transition-colors text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reprendre slide {pausedAt ?? currentIdx}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNavigate("next")}
                    disabled={currentIdx >= totalSlides}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white text-sm"
                  >
                    <span>Suiv</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Ejercicios */}
          {!isLoading && activeTab === "exercises" && (
            <ExerciseManagement
              isActive={isExerciseActive}
              currentExercise={currentExercise}
              onLaunch={handleLaunchExercise}
              onStop={handleStopExercise}
              onPreview={() => setShowExercisePreview(true)}
              participantCount={onlineCount}
            />
          )}

          {!isLoading && activeTab === "quiz" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="card-glass p-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Quiz 5 Pasos
                      </h2>
                      <p className="text-gray-400 text-xs">
                        🎭 ROL · 🎯 OBJETIVO · 🎬 ESCENA · 🎨 ESTILO · 📐
                        FORMATO
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                      liveState.is_quiz_active
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        liveState.is_quiz_active
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="font-medium">
                      {liveState.is_quiz_active
                        ? "Quiz en curso"
                        : "Quiz inactivo"}
                    </span>
                  </div>
                </div>

                {/* Quiz Info Cards — compact */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Target className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">15</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Preguntas
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">30s</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Por pregunta
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">2x</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Bonus Racha
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Users className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-white">
                      {onlineCount}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Participantes
                    </div>
                  </div>
                </div>

                {/* Categories Preview — compact */}
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Categorías del Quiz
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
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
                        className="rounded-lg p-3 text-center"
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
                          border: "1px solid",
                        }}
                      >
                        <span
                          className="text-xl font-black"
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
                        <p className="text-white text-xs font-medium mt-0.5">
                          {cat.label}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {cat.count} preguntas
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Controls */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  {!liveState.is_quiz_active ? (
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-gray-400 text-center text-sm max-w-md">
                        Al lanzar el quiz, todos los participantes conectados
                        verán el quiz en sus pantallas.
                      </p>
                      <button
                        onClick={() => actions.pauseForQuiz()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                      >
                        <Play className="w-5 h-5" />
                        Lanzar Quiz a Participantes
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">
                          Quiz activo — Los participantes están respondiendo
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowQuizPreview(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Vista
                        </button>
                        <button
                          onClick={() => actions.resumePresentation()}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 font-medium transition-all text-sm"
                        >
                          <Square className="w-4 h-4" />
                          Detener Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading && activeTab === "challenge" && (
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
        {/* VOLET DROIT - Playlist des Slides (compact) */}
        {/* ============================================ */}
        <aside className="w-64 flex-shrink-0 border-l border-white/10 bg-black/20 flex flex-col">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Presentation className="w-4 h-4 text-emerald-500" />
              <h2 className="text-white font-semibold text-sm">Slides</h2>
              <span className="text-gray-500 text-xs ml-auto">
                {totalSlides}
              </span>
            </div>
          </div>

          {/* Liste des slides avec miniatures */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Array.from({ length: totalSlides }, (_, i) => i + 1).map(
              (slideIndex) => (
                <SlideThumbnail
                  key={slideIndex}
                  slideIndex={slideIndex}
                  isActive={currentIdx === slideIndex}
                  onClick={() => actions.goToSlide(slideIndex)}
                />
              ),
            )}
          </div>

          {/* Résumé en bas */}
          <div className="p-3 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Progression</span>
              <span className="text-white font-medium">
                {currentIdx} / {totalSlides}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentIdx / totalSlides) * 100}%`,
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================ */}
      {/* MODAL : Vue Participant (fullscreen) */}
      {/* ============================================ */}
      {showParticipantView && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Barre d'info admin */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-blue-600/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white text-sm">
              <Monitor className="w-4 h-4" />
              <span className="font-medium">
                Mode Preview — Vue participant en temps réel
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowParticipantView(false)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Retour admin
              </button>
            </div>
          </div>
          {/* Vue participant exacte */}
          <div className="flex-1 overflow-hidden">
            <WorkshopView
              participantName="Admin Preview"
              participantId="admin-preview"
              sessionId={sessionId || "destino-ia-workshop"}
            />
          </div>
        </div>
      )}

      {/* Modal de vista previa del quiz */}
      {showQuizPreview && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="relative h-full">
            <button
              onClick={() => setShowQuizPreview(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl font-medium text-sm">
              <Eye className="w-4 h-4" />
              <span>Vista de Participantes</span>
            </div>

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
            <button
              onClick={() => setShowExercisePreview(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div
              className={`absolute top-4 left-4 z-10 flex items-center gap-2 ${
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
              } border px-3 py-1.5 rounded-xl font-medium text-sm`}
            >
              <Eye className="w-4 h-4" />
              <span>Vista Admin - Ejercicio</span>
            </div>

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

      {/* Modal de messagerie directe */}
      {showMessageModal && selectedParticipant && (
        <SendMessageModal
          participant={selectedParticipant}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedParticipant(null);
          }}
          onSend={handleSendMessage}
        />
      )}

      {/* Modal broadcast — envoyer à tous */}
      {showBroadcastModal && (
        <BroadcastMessageModal
          participants={participants}
          sessionId={sessionId}
          onClose={() => setShowBroadcastModal(false)}
        />
      )}

      {/* Modal gestion participant (déconnexion, reset mdp) */}
      {managedParticipant && (
        <ParticipantManageModal
          participant={managedParticipant}
          onClose={() => setManagedParticipant(null)}
          onDisconnected={() => {
            setManagedParticipant(null);
            refetchParticipants();
          }}
          onSendMessage={(p) => {
            setManagedParticipant(null);
            handleSendToParticipant(p);
          }}
        />
      )}
    </div>
  );
};
