/**
 * @file services/directMessages.ts
 * @description Service pour la messagerie directe Admin → Participant
 */

import { getSupabaseClient } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface DirectMessage {
  id: string;
  session_id: string;
  participant_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Envoyer un message direct à un participant
 */
export async function sendDirectMessage(
  sessionId: string,
  participantId: string,
  message: string
): Promise<DirectMessage | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('Supabase non configuré - message non envoyé');
    return null;
  }

  const { data, error } = await supabase
    .from('direct_messages')
    .insert({
      session_id: sessionId,
      participant_id: participantId,
      message: message.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw new Error(`Erreur lors de l'envoi: ${error.message}`);
  }

  return data;
}

/**
 * Récupérer les messages d'un participant
 */
export async function getMessagesForParticipant(
  participantId: string
): Promise<DirectMessage[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('direct_messages')
    .select('*')
    .eq('participant_id', participantId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }

  return data || [];
}

/**
 * Compter les messages non lus d'un participant
 */
export async function getUnreadCount(
  participantId: string
): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from('direct_messages')
    .select('*', { count: 'exact', head: true })
    .eq('participant_id', participantId)
    .eq('is_read', false);

  if (error) {
    console.error('Erreur lors du comptage des messages:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Marquer tous les messages d'un participant comme lus
 */
export async function markAllAsRead(
  participantId: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from('direct_messages')
    .update({ is_read: true })
    .eq('participant_id', participantId)
    .eq('is_read', false);

  if (error) {
    console.error('Erreur lors du marquage comme lu:', error);
  }
}

/**
 * S'abonner aux nouveaux messages en temps réel pour un participant
 */
export function subscribeToMessages(
  participantId: string,
  onNewMessage: (message: DirectMessage) => void
): RealtimeChannel | null {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const channel = supabase
    .channel(`direct_messages:${participantId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `participant_id=eq.${participantId}`,
      },
      (payload) => {
        onNewMessage(payload.new as DirectMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Se désabonner des messages
 */
export function unsubscribeFromMessages(channel: RealtimeChannel | null): void {
  if (channel) {
    const supabase = getSupabaseClient();
    supabase?.removeChannel(channel);
  }
}
