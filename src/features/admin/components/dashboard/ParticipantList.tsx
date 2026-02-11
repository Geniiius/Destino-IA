/**
 * @file ParticipantList.tsx
 * @description Liste des participants avec actions admin
 */

import React from "react";
import { Users, Mail, Send, Settings, LogOut, Loader2 } from "lucide-react";
import type { Participant } from "@/types";

interface ParticipantListProps {
  participants: Participant[];
  onSendToParticipant: (participant: Participant) => void;
  onSendToAll: () => void;
  onManageParticipant?: (participant: Participant) => void;
  onDisconnectAll?: () => void;
  isDisconnectingAll?: boolean;
}

const getInitials = (name: string): string => {
  const names = name.split(" ");
  if (names.length >= 2 && names[0] && names[1]) {
    return ((names[0][0] ?? "") + (names[1][0] ?? "")).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onSendToParticipant,
  onSendToAll,
  onManageParticipant,
  onDisconnectAll,
  isDisconnectingAll,
}) => {
  const onlineCount = participants.filter((p) => p.status === "online").length;

  // Trier : connectés en haut, puis par nom
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <aside className="w-72 flex-shrink-0 border-r border-white/10 bg-black/20 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-500" />
          <h2 className="text-white font-semibold">Participants</h2>
          <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
            {onlineCount}/{participants.length}
          </span>
        </div>
      </div>

      {/* Liste des participants */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedParticipants.map((participant) => (
          <div
            key={participant.id}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
              participant.status === "online"
                ? "bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {/* Avatar avec initiales */}
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  participant.status === "online"
                    ? "bg-gradient-to-br from-emerald-500/30 to-emerald-400/20 ring-2 ring-emerald-500/40"
                    : "bg-gradient-to-br from-emerald-500/20 to-blue-500/20"
                }`}
              >
                <span className="text-sm font-bold text-white">
                  {getInitials(participant.name)}
                </span>
              </div>
              {/* Indicateur de statut */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0f] ${
                  participant.status === "online"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-gray-500"
                }`}
              />
            </div>

            {/* Nom et statut */}
            <div className="flex-1 text-left min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  participant.status === "online"
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                {participant.name}
              </p>
              <p
                className={`text-xs font-medium ${
                  participant.status === "online"
                    ? "text-emerald-400"
                    : "text-gray-500"
                }`}
              >
                {participant.status === "online" ? "● Connecté" : "Hors ligne"}
              </p>
            </div>

            {/* Actions au hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onSendToParticipant(participant)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Envoyer un message"
              >
                <Mail className="w-3.5 h-3.5 text-gray-400 hover:text-purple-400" />
              </button>
              {onManageParticipant && (
                <button
                  onClick={() => onManageParticipant(participant)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title="Gérer ce participant"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400 hover:text-amber-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions groupées */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onSendToAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium transition-colors text-sm"
        >
          <Send className="w-4 h-4" />
          Envoyer à tous
        </button>

        {onDisconnectAll && onlineCount > 0 && (
          <button
            onClick={onDisconnectAll}
            disabled={isDisconnectingAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-medium transition-colors text-xs disabled:opacity-50"
          >
            {isDisconnectingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            Déconnecter tous ({onlineCount})
          </button>
        )}
      </div>
    </aside>
  );
};
