/**
 * @file hooks/useParticipantMessages.ts
 * @description Hook pour gérer les messages du participant
 */

import { useState, useEffect, useCallback } from "react";
import type { DirectMessage } from "@/types";
import {
  getMessagesForParticipant,
  markAllAsRead,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "@/services/directMessages";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseParticipantMessagesReturn {
  messages: DirectMessage[];
  unreadCount: number;
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

export function useParticipantMessages(
  participantId: string | null
): UseParticipantMessagesReturn {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [_channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Charger les messages initiaux
  useEffect(() => {
    if (!participantId) return;

    const loadMessages = async () => {
      const msgs = await getMessagesForParticipant(participantId);
      setMessages(msgs);
    };

    loadMessages();
  }, [participantId]);

  // S'abonner aux nouveaux messages en temps réel
  useEffect(() => {
    if (!participantId) return;

    const sub = subscribeToMessages(participantId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    setChannel(sub);

    return () => {
      unsubscribeFromMessages(sub);
    };
  }, [participantId]);

  // Calculer le nombre de messages non lus
  const unreadCount = messages.filter((m) => !m.is_read).length;

  // Ouvrir le panneau et marquer comme lu
  const openPanel = useCallback(async () => {
    setIsOpen(true);
    if (participantId && unreadCount > 0) {
      await markAllAsRead(participantId);
      // Mettre à jour l'état local
      setMessages((prev) =>
        prev.map((m) => ({ ...m, is_read: true }))
      );
    }
  }, [participantId, unreadCount]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePanel = useCallback(() => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }, [isOpen, openPanel, closePanel]);

  return {
    messages,
    unreadCount,
    isOpen,
    openPanel,
    closePanel,
    togglePanel,
  };
}
