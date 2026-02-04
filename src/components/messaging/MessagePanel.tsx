/**
 * @file components/messaging/MessagePanel.tsx
 * @description Panneau de messages pour les participants
 */

import React, { useEffect, useRef } from "react";
import { X, Bot, Clock } from "lucide-react";
import type { DirectMessage } from "@/types";

interface MessagePanelProps {
  messages: DirectMessage[];
  onClose: () => void;
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MessagePanel: React.FC<MessagePanelProps> = ({
  messages,
  onClose,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-[#0f0f14]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Mensajes del Animador</h3>
              <p className="text-xs text-gray-400">
                {messages.length} mensaje{messages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No tienes mensajes todavía
              </p>
              <p className="text-gray-600 text-xs mt-1">
                El animador puede enviarte instrucciones aquí
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl ${
                  msg.is_read
                    ? "bg-white/5"
                    : "bg-purple-500/10 border border-purple-500/20"
                }`}
              >
                {/* En-tête du message */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <span className="text-purple-400 text-xs font-medium">
                    Animador
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-xs ml-auto">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(msg.created_at)}</span>
                  </div>
                </div>

                {/* Contenu du message */}
                <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>

                {/* Badge non lu */}
                {!msg.is_read && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-purple-400 text-xs">Nuevo</span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
