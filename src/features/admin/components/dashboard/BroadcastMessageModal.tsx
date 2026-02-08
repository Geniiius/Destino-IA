/**
 * @file dashboard/BroadcastMessageModal.tsx
 * @description Modal pour envoyer un message à tous les participants connectés
 */

import React, { useState } from 'react';
import { X, Send, Users, Loader2, Check, MessageSquare } from 'lucide-react';
import { sendDirectMessage } from '@/services/directMessages';
import type { Participant } from '@/types';

interface BroadcastMessageModalProps {
  participants: Participant[];
  sessionId: string;
  onClose: () => void;
}

export const BroadcastMessageModal: React.FC<BroadcastMessageModalProps> = ({
  participants,
  sessionId,
  onClose,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectedParticipants = participants.filter((p) => p.status === 'online');

  const templates = [
    {
      label: '⏱️ Tiempo',
      text: '⏱️ Quedan 5 minutos para terminar el ejercicio. ¡Ánimo!',
    },
    {
      label: '📋 Instrucción',
      text: '📋 Por favor, compartan su pantalla cuando terminen.',
    },
    {
      label: '🔄 Pausa',
      text: '☕ Vamos a hacer una pausa de 10 minutos. ¡Volvemos pronto!',
    },
    {
      label: '🎉 Bravo',
      text: '🎉 ¡Excelente trabajo! Pasamos a la siguiente actividad.',
    },
  ];

  const handleSend = async () => {
    if (!message.trim() || connectedParticipants.length === 0) return;

    setIsSending(true);
    setError(null);

    let sent = 0;
    let failed = 0;

    // Envoyer à chaque participant connecté
    const promises = connectedParticipants.map(async (participant) => {
      try {
        await sendDirectMessage(sessionId, participant.id, message.trim());
        sent++;
      } catch {
        failed++;
      }
    });

    await Promise.allSettled(promises);

    setResult({ sent, failed });
    setIsSending(false);

    // Fermer après un délai si tout a réussi
    if (failed === 0) {
      setTimeout(onClose, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSend();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-[#0f0f14] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mensaje a Todos</h2>
              <p className="text-gray-400 text-xs">
                {connectedParticipants.length} participante{connectedParticipants.length !== 1 ? 's' : ''} connecté{connectedParticipants.length !== 1 ? 's' : ''}
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

        {/* Corps */}
        <div className="p-5 space-y-4">
          {/* Templates rapides */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
              Messages rapides
            </p>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setMessage(t.text)}
                  className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors border border-white/5"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écris ton message pour tous les participants..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none text-sm"
              autoFocus
              disabled={isSending || !!result}
            />
            <p className="text-xs text-gray-600 mt-1">
              Ctrl+Enter pour envoyer · Échap pour fermer
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* Résultat */}
          {result && (
            <div className="flex items-center gap-2 text-sm bg-emerald-500/10 text-emerald-400 rounded-lg px-4 py-2">
              <Check className="w-4 h-4" />
              <span>
                {result.sent} message{result.sent !== 1 ? 's' : ''} envoyé{result.sent !== 1 ? 's' : ''}
                {result.failed > 0 && ` · ${result.failed} échoué${result.failed !== 1 ? 's' : ''}`}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              Sera envoyé à {connectedParticipants.length} participant{connectedParticipants.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending || !!result || connectedParticipants.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all text-sm"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi...
              </>
            ) : result ? (
              <>
                <Check className="w-4 h-4" />
                Envoyé !
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer à tous
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
