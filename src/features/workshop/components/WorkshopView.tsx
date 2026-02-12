/**
 * @file features/workshop/components/WorkshopView.tsx
 * @description Vista participante - sigue la sesión en tiempo real
 *
 * Funcionalidades:
 * - Muestra la diapositiva actual sincronizada por el admin
 * - Cambio automático entre presentación / ejercicio / quiz
 * - Auto-reconexión en caso de pérdida de conexión
 * - Indicador de conexión / modo actual
 * - Persistencia: al reconectarse, recupera el estado exacto
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

  // Heartbeat de presencia — señala la conexión y detecta la desconexión
  useParticipantPresence(participantId);

  // Precargar todas las diapositivas al llegar
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
        label: "Presentación",
        iconClass: "w-4 h-4 text-cyan-500",
        textClass: "text-cyan-400 text-sm font-medium",
      },
      exercise: {
        icon: BookOpen,
        label: "Ejercicio en curso",
        iconClass: "w-4 h-4 text-amber-500",
        textClass: "text-amber-400 text-sm font-medium",
      },
      quiz: {
        icon: HelpCircle,
        label: "Quiz en curso",
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
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <p className="text-gray-400">Conectando a la sesión...</p>
        <p className="text-gray-600 text-sm mt-2">
          Bienvenido/a, {participantName}
        </p>
      </div>
    );
  }

  // ── Session pas encore en live ─────────────────

  if (!state.is_live) {
    return (
      <div className="h-full bg-[#050508] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Fondo ambiental */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(56,189,248,0.06)_0%,transparent_60%)]" />
          <div className="absolute top-[-15%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-sky-600/[0.03] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '5s' }} />
        </div>

        {/* Grilla sutil */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="text-center max-w-lg relative z-10 px-6">
          {/* Logo */}
          <div className="mb-10">
            <img
              src="/assets/logo.png"
              alt="Destino IA"
              className="w-72 h-auto mx-auto drop-shadow-[0_0_60px_rgba(56,189,248,0.25)] animate-float"
            />
          </div>

          {/* Card de bienvenida */}
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 mb-6">
            {/* Saludo */}
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 font-medium mb-3">
              Bienvenido/a al taller
            </p>
            <h2 className="text-4xl font-bold text-white mb-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 animate-gradient-x">
                {participantName}
              </span>
            </h2>

            <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto my-6" />

            <p className="text-gray-400 leading-relaxed text-[15px]">
              La sesión comenzará pronto. Permanece en esta página,
              el contenido aparecerá automáticamente cuando el formador
              inicie la presentación.
            </p>
          </div>

          {/* Indicador de conexión */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm mb-4">
            {isConnected ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                </span>
                <span className="text-cyan-400 text-sm font-medium tracking-wide">
                  Conectado — En espera
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">Reconectando...</span>
              </>
            )}
          </div>

          {/* Botón salir */}
          {onLeave && (
            <div className="mt-6">
              <button
                onClick={onLeave}
                className="px-6 py-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-cyan-500/20 rounded-xl text-gray-600 hover:text-gray-300 text-xs uppercase tracking-[0.2em] transition-all duration-300"
              >
                Salir de la sesión
              </button>
            </div>
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

        {/* Diapositiva actual */}
        {state.current_mode === "presentation" && (
          <span className="text-gray-500 text-xs">
            Diapositiva {state.current_slide_index} / {state.total_slides}
          </span>
        )}

        {/* Conexión */}
        <div className="flex items-center gap-1">
          {isConnected ? (
            <Wifi className="w-3 h-3 text-cyan-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" />
          )}
        </div>
      </header>

      {/* ── Contenido principal ────────────────────── */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* MODO PRESENTACIÓN */}
        {state.current_mode === "presentation" && (
          <div className="w-full flex-1 min-h-0 p-2 sm:p-3 md:p-4">
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
                    Ejercicio «{exerciseId}» en preparación...
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
