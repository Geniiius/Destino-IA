/**
 * @file features/workshop/components/ParticipantView.tsx
 * @description Vista del participante durante el taller - Pantalla completa inmersiva
 */

import React, { useState, useEffect } from "react";
import {
  Monitor,
  MessageCircle,
  BookOpen,
  Send,
  Download,
  FileText,
  Video,
  Image,
  ExternalLink,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { SessionState, Slide, SlideType } from "@/types";
import { GamifiedQuiz } from "@/features/quiz";
import { ExerciseViewer } from "./ExerciseViewer";
import { useExerciseSync } from "../../admin/hooks/useExerciseSync";
import { ImageSubmission } from "@/components/gallery/ImageSubmission";
import { GalleryView } from "@/components/gallery/GalleryView";
import { useGallery } from "@/hooks/useGallery";
import { uploadImageToStorage, submitImage } from "@/services/submissions";

interface ParticipantViewProps {
  participantName: string;
  sessionId?: string;
  userId?: string;
}

// Styles pour les badges de type
const SLIDE_TYPE_STYLES: Record<
  SlideType,
  { bg: string; text: string; label: string }
> = {
  intro: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Introducción" },
  theory: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    label: "Teoría",
  },
  exercise: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    label: "Ejercicio",
  },
  challenge: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    label: "Desafío",
  },
};

// Ressources mock
const MOCK_RESOURCES = [
  { id: "1", name: "Guía de Prompts IA", type: "pdf", size: "2.4 MB" },
  { id: "2", name: "Plantillas de Marketing", type: "pdf", size: "1.8 MB" },
  {
    id: "3",
    name: "Video Tutorial - Midjourney",
    type: "video",
    size: "45 MB",
  },
  { id: "4", name: "Pack de Imágenes", type: "image", size: "12 MB" },
];

export const ParticipantView: React.FC<ParticipantViewProps> = ({
  participantName,
  sessionId = "default-session",
  userId = "participant-" + Math.random().toString(36).substr(2, 9),
}) => {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [activeTab, setActiveTab] = useState<"slide" | "chat" | "resources">(
    "slide"
  );
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ name: string; message: string; time: string; isMe: boolean }>
  >([
    {
      name: "Instructor",
      message: "¡Bienvenidos al taller! Comenzamos en unos minutos.",
      time: "10:00",
      isMe: false,
    },
  ]);

  // Hook de synchronisation des exercices
  const { sessionState: exerciseState, markExerciseComplete } = useExerciseSync(
    sessionId,
    false
  );

  // Hook de galerie (pour soumissions et diffusion)
  const {
    broadcastState,
    isBroadcasting,
    submissions,
    mySubmission,
    submitImage: handleSubmitImage,
    uploadProgress,
  } = useGallery({
    sessionId,
    exerciseId: currentSlide?.type === 'exercise' ? `exercise-${currentSlide.title}` : undefined,
    participantId: userId,
  });

  const handleCompleteExercise = async () => {
    await markExerciseComplete(userId);
  };

  const handleImageSubmit = async (file: File) => {
    if (!currentSlide || currentSlide.type !== 'exercise') return;
    
    const exerciseId = `exercise-${currentSlide.title}`;
    
    // Upload l'image vers Storage
    const imageUrl = await uploadImageToStorage(
      file,
      sessionId,
      userId,
      exerciseId
    );
    
    // Créer la soumission dans la DB
    await submitImage(sessionId, userId, exerciseId, imageUrl);
  };

  // Escuchar actualizaciones de sesión
  useEffect(() => {
    const handleSessionUpdate = (
      event: CustomEvent<{ state: SessionState; slide?: Slide }>
    ) => {
      setSessionState(event.detail.state);
      if (event.detail.slide) {
        setCurrentSlide(event.detail.slide);
      }
    };

    window.addEventListener(
      "sessionUpdate",
      handleSessionUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "sessionUpdate",
        handleSessionUpdate as EventListener
      );
    };
  }, []);

  const isConnected = sessionState !== null;

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          name: participantName,
          message: chatMessage,
          time: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: true,
        },
      ]);
      setChatMessage("");
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "video":
        return Video;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  // Si un exercice est actif, afficher l'exercice en plein écran
  if (exerciseState.isExerciseActive && exerciseState.currentExercise) {
    return (
      <ExerciseViewer
        exercise={exerciseState.currentExercise}
        onComplete={handleCompleteExercise}
        userId={userId}
      />
    );
  }

  // Si le quiz est actif, afficher le quiz en plein écran
  if (sessionState?.is_quiz_active) {
    return (
      <GamifiedQuiz
        participantName={participantName}
        onClose={undefined} // Le participant ne peut pas fermer le quiz
      />
    );
  }

  // Si une diffusion de galerie est active, afficher la galerie
  if (isBroadcasting && broadcastState) {
    return (
      <GalleryView
        mode={broadcastState.broadcast_mode}
        submissions={submissions}
        currentParticipantId={userId}
      />
    );
  }

  return (
    <div className="relative z-10 w-full h-screen flex flex-col bg-[#0a0a0f]">
      {/* ============================================ */}
      {/* HEADER - Barra superior */}
      {/* ============================================ */}
      <header className="flex-shrink-0 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Saludo y nombre */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {participantName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-emerald-400 text-sm font-medium">
                Bienvenido/a
              </p>
              <h1 className="text-xl font-bold text-white">
                {participantName}
              </h1>
            </div>
          </div>

          {/* Navegación por pestañas - Centro */}
          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {[
              { id: "slide", icon: Monitor, label: "Presentación" },
              { id: "chat", icon: MessageCircle, label: "Chat" },
              { id: "resources", icon: BookOpen, label: "Recursos" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === id
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Estado de conexión */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isConnected ? "bg-emerald-500/10" : "bg-yellow-500/10"
            }`}
          >
            {isConnected ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-yellow-500 animate-pulse" />
            )}
            <span
              className={`text-sm font-medium ${
                isConnected ? "text-emerald-400" : "text-yellow-400"
              }`}
            >
              {isConnected ? "En vivo" : "Conectando..."}
            </span>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ============================================ */}
      <main className="flex-1 overflow-hidden p-6">
        {/* TAB: PRESENTACIÓN */}
        {activeTab === "slide" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 card-glass rounded-2xl overflow-hidden flex flex-col">
              {currentSlide ? (
                <>
                  {/* Header del slide con tipo */}
                  <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${
                        SLIDE_TYPE_STYLES[currentSlide.type].bg
                      } ${SLIDE_TYPE_STYLES[currentSlide.type].text}`}
                    >
                      {SLIDE_TYPE_STYLES[currentSlide.type].label}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>EN VIVO</span>
                    </div>
                  </div>

                  {/* Contenido del slide */}
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
                    {currentSlide.imageUrl ? (
                      /* Afficher l'image de la page PDF */
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={currentSlide.imageUrl}
                          alt={currentSlide.title}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                      </div>
                    ) : (
                      /* Afficher le contenu texte classique */
                      <>
                        <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                          {currentSlide.title}
                        </h2>
                        {currentSlide.subtitle && (
                          <p className="text-emerald-400 text-2xl mb-8">
                            {currentSlide.subtitle}
                          </p>
                        )}
                        <p className="text-gray-300 text-xl max-w-3xl leading-relaxed mb-8">
                          {currentSlide.content}
                        </p>
                      </>
                    )}

                    {/* Zone de soumission d'image pour les exercices */}
                    {currentSlide.type === 'exercise' && (
                      <div className="w-full max-w-2xl mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">
                          Comparte tu Creación
                        </h3>
                        <ImageSubmission
                          onSubmit={handleImageSubmit}
                          currentSubmission={mySubmission}
                          uploadProgress={uploadProgress}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer con indicador */}
                  <div className="px-8 py-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <ChevronRight className="w-4 h-4" />
                      <span>El presentador controla las diapositivas</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Estado de espera */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center mb-8">
                    <Monitor className="w-16 h-16 text-emerald-500/50" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Esperando al presentador
                  </h3>
                  <p className="text-gray-400 text-lg max-w-md">
                    La presentación comenzará cuando el instructor inicie la
                    sesión. Mientras tanto, puedes explorar el chat o los
                    recursos.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-yellow-400">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-sm font-medium">
                      Conectando con la sesión...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CHAT */}
        {activeTab === "chat" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 card-glass rounded-2xl overflow-hidden flex flex-col">
              {/* Header del chat */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-white font-semibold">Chat del Taller</h2>
                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                    {chatMessages.length} mensajes
                  </span>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                        msg.isMe
                          ? "bg-emerald-500 text-white rounded-br-md"
                          : "bg-white/10 text-white rounded-bl-md"
                      }`}
                    >
                      {!msg.isMe && (
                        <p className="text-emerald-400 text-xs font-semibold mb-1">
                          {msg.name}
                        </p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isMe ? "text-emerald-100" : "text-gray-500"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RECURSOS */}
        {activeTab === "resources" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 card-glass rounded-2xl overflow-hidden flex flex-col">
              {/* Header de recursos */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-white font-semibold">
                    Recursos del Taller
                  </h2>
                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                    {MOCK_RESOURCES.length} archivos
                  </span>
                </div>
              </div>

              {/* Lista de recursos */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_RESOURCES.map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                      <div
                        key={resource.id}
                        className="flex items-center gap-4 p-5 bg-white/5 hover:bg-white/10 rounded-xl transition-all group cursor-pointer"
                      >
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            resource.type === "pdf"
                              ? "bg-red-500/20"
                              : resource.type === "video"
                              ? "bg-purple-500/20"
                              : "bg-blue-500/20"
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 ${
                              resource.type === "pdf"
                                ? "text-red-400"
                                : resource.type === "video"
                                ? "text-purple-400"
                                : "text-blue-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {resource.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {resource.size}
                          </p>
                        </div>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer con link externo */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <button className="w-full flex items-center justify-center gap-2 py-3 text-emerald-400 hover:text-emerald-300 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Ver todos los recursos en Google Drive
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
