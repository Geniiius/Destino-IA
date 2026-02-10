/**
 * @file features/workshop/components/WorkshopView.tsx
 * @description Vue participant - suit la session en temps réel
 *
 * Fonctionnalités :
 * - Affiche le slide courant synchronisé par l'admin
 * - Switch automatique entre presentation / exercise / quiz
 * - Auto-reconnexion en cas de perte de connexion
 * - Indicateur de connexion / mode courant
 * - Persistance : à la reconnexion, retrouve l'état exact
 */

import React, { useEffect, useMemo } from "react";
import { useLiveSession } from "@/hooks/useLiveSession";
import { useSlideManifest } from "@/hooks/useSlideManifest";
import { useParticipantPresence } from "@/hooks/useParticipantPresence";
import { SlidePresenter } from "@/components/SlidePresenter";
import { GamifiedQuiz } from "@/features/quiz";
import { AgenciaViajesExercise } from "@/features/workshop/components/exercises/AgenciaViajesExercise";
import { TextToImageIntro } from "@/features/workshop/components/exercises/TextToImageIntro";
import { TextToImageCorporate } from "@/features/workshop/components/exercises/TextToImageCorporate";
import { TextToImageAds } from "@/features/workshop/components/exercises/TextToImageAds";
import { TextToImageLogo } from "@/features/workshop/components/exercises/TextToImageLogo";
import { TextToVideoFromScratch } from "@/features/workshop/components/exercises/TextToVideoFromScratch";
import { TextToVideoWorkflow } from "@/features/workshop/components/exercises/TextToVideoWorkflow";
import { FlyerToVideoWorkflow } from "@/features/workshop/components/exercises/FlyerToVideoWorkflow";
import {
  Wifi,
  WifiOff,
  Presentation,
  BookOpen,
  HelpCircle,
  Loader2,
} from "lucide-react";
import type { SessionMode } from "@/types/session";

// ============================================
// TYPES
// ============================================

interface WorkshopViewProps {
  /** Nom du participant */
  participantName: string;
  /** ID du participant */
  participantId: string;
  /** ID de la session */
  sessionId?: string;
  /** Callback pour quitter */
  onLeave?: () => void;
}

// ============================================
// MAP DES EXERCICES
// ============================================

const EXERCISE_COMPONENTS: Record<
  string,
  React.FC<{
    participantId: string;
    participantName: string;
    sessionId: string;
  }>
> = {
  agencia: AgenciaViajesExercise,
};

// Exercices sans props spécifiques
const EXERCISE_SIMPLE_COMPONENTS: Record<string, React.FC> = {
  intro: TextToImageIntro,
  corporate: TextToImageCorporate,
  ads: TextToImageAds,
  logo: TextToImageLogo,
  textToVideo: TextToVideoFromScratch,
  imageToVideo: TextToVideoWorkflow,
  flyerToVideo: FlyerToVideoWorkflow,
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const WorkshopView: React.FC<WorkshopViewProps> = ({
  participantName,
  participantId,
  sessionId,
  onLeave,
}) => {
  const { state, isReady, isConnected } = useLiveSession({
    sessionId,
    realtime: true,
  });

  const { preloadAll } = useSlideManifest();

  // Heartbeat de présence — signale la connexion et détecte la déconnexion
  useParticipantPresence(participantId);

  // Précharger tous les slides à l'arrivée
  useEffect(() => {
    if (isReady) {
      preloadAll();
    }
  }, [isReady, preloadAll]);

  // ── Mode info ──────────────────────────────────

  const modeInfo = useMemo((): {
    icon: React.ElementType;
    label: string;
    iconClass: string;
    textClass: string;
  } => {
    const modeMap: Record<
      SessionMode,
      {
        icon: React.ElementType;
        label: string;
        iconClass: string;
        textClass: string;
      }
    > = {
      presentation: {
        icon: Presentation,
        label: "Présentation",
        iconClass: "w-4 h-4 text-emerald-500",
        textClass: "text-emerald-400 text-sm font-medium",
      },
      exercise: {
        icon: BookOpen,
        label: "Exercice en cours",
        iconClass: "w-4 h-4 text-amber-500",
        textClass: "text-amber-400 text-sm font-medium",
      },
      quiz: {
        icon: HelpCircle,
        label: "Quiz en cours",
        iconClass: "w-4 h-4 text-purple-500",
        textClass: "text-purple-400 text-sm font-medium",
      },
    };
    return modeMap[state.current_mode] ?? modeMap.presentation;
  }, [state.current_mode]);

  // ── Écran de chargement ────────────────────────

  if (!isReady) {
    return (
      <div className="h-full bg-[#050508] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-400">Connexion à la session...</p>
        <p className="text-gray-600 text-sm mt-2">
          Bienvenue {participantName} !
        </p>
      </div>
    );
  }

  // ── Session pas encore en live ─────────────────

  if (!state.is_live) {
    return (
      <div className="h-full bg-[#050508] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Presentation className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Bienvenue, {participantName} !
          </h2>
          <p className="text-gray-400 mb-6">
            La session va bientôt commencer. Restez sur cette page, le contenu
            apparaîtra automatiquement quand le formateur lancera la
            présentation.
          </p>

          {/* Indicateur de connexion */}
          <div className="flex items-center justify-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-400 text-sm">
                  Connecté — En attente
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-500" />
                <span className="text-amber-400 text-sm">Reconnexion...</span>
              </>
            )}
          </div>

          {/* Bouton quitter */}
          {onLeave && (
            <button
              onClick={onLeave}
              className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm transition-colors"
            >
              Quitter la session
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Rendu selon le mode ────────────────────────

  return (
    <div className="w-full h-full bg-[#050508] flex flex-col">
      {/* ── Barre de statut ──────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
        {/* Info mode */}
        <div className="flex items-center gap-2">
          {React.createElement(modeInfo.icon, {
            className: modeInfo.iconClass,
          })}
          <span className={modeInfo.textClass}>{modeInfo.label}</span>
        </div>

        {/* Slide courant */}
        {state.current_mode === "presentation" && (
          <span className="text-gray-500 text-xs">
            Slide {state.current_slide_index} / {state.total_slides}
          </span>
        )}

        {/* Connexion */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <Wifi className="w-3 h-3 text-emerald-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" />
          )}
        </div>
      </header>

      {/* ── Contenu principal ────────────────────── */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* MODE PRÉSENTATION */}
        {state.current_mode === "presentation" && (
          <div className="w-full flex-1 p-4">
            <SlidePresenter
              slideIndex={state.current_slide_index}
              preloadAhead={5}
              className="w-full h-full"
            />
          </div>
        )}

        {/* MODE EXERCICE */}
        {state.current_mode === "exercise" && state.active_exercise_id && (
          <div className="w-full flex-1 overflow-y-auto">
            {(() => {
              const exerciseId = state.active_exercise_id!;

              // Composants avec props spécifiques
              const SpecificComponent = EXERCISE_COMPONENTS[exerciseId];
              if (SpecificComponent) {
                return (
                  <SpecificComponent
                    participantId={participantId}
                    participantName={participantName}
                    sessionId={sessionId ?? state.session_id}
                  />
                );
              }

              // Composants simples
              const SimpleComponent = EXERCISE_SIMPLE_COMPONENTS[exerciseId];
              if (SimpleComponent) {
                return <SimpleComponent />;
              }

              // Exercice non trouvé
              return (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <BookOpen className="w-16 h-16 text-amber-500/30" />
                  <p className="text-gray-400">
                    Exercice « {exerciseId} » en préparation...
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* MODE QUIZ */}
        {state.current_mode === "quiz" && state.is_quiz_active && (
          <GamifiedQuiz
            participantName={participantName}
            onClose={() => {
              // Le quiz se ferme quand l'admin change le mode
              // Ne rien faire ici, l'admin contrôle
            }}
          />
        )}
      </main>
    </div>
  );
};
