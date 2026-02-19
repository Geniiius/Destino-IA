/**
 * @file SendMessageModal.tsx
 * @description Modal pour envoyer un message direct à un participant
 */

import React, { useState } from "react";
import { X, Send, User, MessageSquare, Loader2, Check, Key } from "lucide-react";
import type { Participant } from "@/types";

interface SendMessageModalProps {
  participant: Participant;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  participant,
  onClose,
  onSend,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Templates de messages prédéfinis
  const templates = [
    {
      label: "Identifiants",
      icon: Key,
      template: `Hola ${participant.name},\n\nTus credenciales de acceso para Grok: https://grok.com/\n\n📧 Usuario: \n🔑 Contraseña: \n\n¡No las compartas con nadie!`,
    },
    {
      label: "Instrucciones",
      icon: MessageSquare,
      template: `Hola ${participant.name},\n\nInstrucciones específicas:\n\n`,
    },
  ];

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      await onSend(message);
      setIsSent(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el mensaje");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-[#0f0f14] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mensaje Directo</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>{participant.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    participant.status === "online" ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Templates rapides */}
          <div className="flex gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.label}
                onClick={() => setMessage(tpl.template)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
              >
                <tpl.icon className="w-4 h-4" />
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Zone de texte */}
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              Ctrl + Enter para enviar
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Succès */}
          {isSent && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-emerald-400">¡Mensaje enviado con éxito!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending || isSent}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : isSent ? (
              <>
                <Check className="w-4 h-4" />
                Enviado
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
