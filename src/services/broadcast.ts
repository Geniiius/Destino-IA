/**
 * @file services/broadcast.ts
 * @description Service de messages broadcast (admin → tous)
 */

/* eslint-disable no-console, camelcase */

import { getSupabaseClient } from '@/services/supabase/client';

// ============================================
// TYPES
// ============================================

export interface BroadcastMessage {
  id: string;
  session_id: string;
  sender_id: string;
  message: string;
  message_type: 'info' | 'warning' | 'success' | 'alert';
  created_at: string;
  expires_at: string | null;
}

// ============================================
// ENVOI (Admin)
// ============================================

/**
 * Envoyer un message broadcast à tous les participants.
 */
export async function sendBroadcast(
  senderId: string,
  message: string,
  messageType: BroadcastMessage['message_type'] = 'info',
  sessionId: string = 'destino-ia-workshop',
  expiresInMinutes?: number
): Promise<BroadcastMessage | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const record: Partial<BroadcastMessage> = {
      session_id: sessionId,
      sender_id: senderId,
      message,
      message_type: messageType,
    };

    if (expiresInMinutes) {
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + expiresInMinutes);
      record.expires_at = expires.toISOString();
    }

    const { data, error } = await supabase
      .from('broadcast_messages')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data as BroadcastMessage;
  } catch (err) {
    console.error('[Broadcast] Erreur envoi:', err);
    return null;
  }
}

// ============================================
// LECTURE
// ============================================

/**
 * Récupère les messages broadcast récents.
 */
export async function getRecentBroadcasts(
  sessionId: string = 'destino-ia-workshop',
  limit: number = 20
): Promise<BroadcastMessage[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('broadcast_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as BroadcastMessage[]) || [];
  } catch (err) {
    console.error('[Broadcast] Erreur lecture:', err);
    return [];
  }
}

// ============================================
// REALTIME
// ============================================

/**
 * S'abonne aux nouveaux messages broadcast.
 */
export function subscribeToBroadcasts(
  callback: (message: BroadcastMessage) => void,
  sessionId: string = 'destino-ia-workshop'
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`broadcast:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'broadcast_messages',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        callback(payload.new as BroadcastMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
