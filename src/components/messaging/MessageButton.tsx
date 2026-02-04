/**
 * @file components/messaging/MessageButton.tsx
 * @description Bouton discret pour les participants avec badge de notification
 */

import React from "react";
import { Bot } from "lucide-react";

interface MessageButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export const MessageButton: React.FC<MessageButtonProps> = ({
  unreadCount,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group"
      aria-label={`Messages${unreadCount > 0 ? ` (${unreadCount} non lus)` : ""}`}
    >
      {/* Bouton principal */}
      <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600/80 to-indigo-600/80 hover:from-purple-500 hover:to-indigo-500 rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110">
        {/* Icône robot/humanoïde */}
        <Bot className="w-7 h-7 text-white" />
        
        {/* Effet de glow au hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/0 to-indigo-400/0 group-hover:from-purple-400/20 group-hover:to-indigo-400/20 transition-all duration-300" />
      </div>

      {/* Badge de notification */}
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 min-w-[24px] h-6 px-2 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-white text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </div>
      )}

      {/* Pulse animation quand il y a des messages non lus */}
      {unreadCount > 0 && (
        <div className="absolute inset-0 rounded-2xl bg-purple-500/30 animate-ping" />
      )}
    </button>
  );
};
