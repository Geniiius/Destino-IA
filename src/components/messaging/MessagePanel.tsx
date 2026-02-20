/**
 * @file components/messaging/MessagePanel.tsx
 * @description Panneau de messages pour les participants
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Bot, Clock, Copy, Check } from "lucide-react";
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

/** Inline copy button for credential values */
const CopyableValue: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      title={`Copiar ${label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-mono font-semibold transition-all duration-200 cursor-pointer ${
        copied
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          : "bg-white/10 text-white hover:bg-purple-500/20 hover:text-purple-200 border border-white/10 hover:border-purple-500/30"
      }`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 opacity-60" />
      )}
      <span>{value}</span>
      {copied && <span className="text-[10px] text-emerald-400 ml-1">¡Copiado!</span>}
    </button>
  );
};

/**
 * Parse a message and replace credential lines with clickable copy buttons.
 * Detects patterns like:
 *   📧 Usuario: value
 *   🔑 Contraseña: value
 */
/** Render a single line, replacing URLs with clickable links and credentials with copy buttons */
const renderLine = (line: string): React.ReactNode[] => {
  const credentialPattern = /^(📧\s*Usuario:\s*|🔑\s*Contraseña:\s*)(.+)$/;
  const credMatch = line.match(credentialPattern);
  if (credMatch && credMatch[1] && credMatch[2]) {
    const prefix = credMatch[1];
    const value = credMatch[2].trim();
    const label = prefix.includes("Usuario") ? "usuario" : "contraseña";
    return [
      <span key="prefix">{prefix}</span>,
      <CopyableValue key="val" value={value} label={label} />,
    ];
  }

  // Split line by URLs and render links
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let urlMatch: RegExpExecArray | null;

  while ((urlMatch = urlPattern.exec(line)) !== null) {
    if (urlMatch.index > lastIndex) {
      parts.push(line.slice(lastIndex, urlMatch.index));
    }
    const url = urlMatch[0];
    parts.push(
      <a
        key={`link-${urlMatch.index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 underline underline-offset-2 decoration-purple-400/40 hover:decoration-purple-300 transition-colors font-medium"
      >
        {url}
        <svg className="w-3 h-3 inline-block opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
    lastIndex = urlMatch.index + url.length;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [line];
};

const renderMessageContent = (text: string) => {
  const lines = text.split("\n");

  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {renderLine(line)}
      {i < lines.length - 1 && "\n"}
    </React.Fragment>
  ));
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
                  {renderMessageContent(msg.message)}
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
