import { getSupabaseClient } from './supabase';

/**
 * Service pour gérer les participants
 */

export interface Participant {
  id: string;
  session_id: string;
  name: string;
  email: string;
  status: 'connected' | 'disconnected';
  joined_at: string;
  last_seen_at: string;
  metadata: Record<string, any>;
}

/**
 * Vérifier si un participant existe avec cet email dans cette session
 */
export async function findParticipantByEmail(
  sessionId: string,
  email: string
): Promise<Participant | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('session_id', sessionId)
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Pas de participant trouvé
      return null;
    }
    console.error('Error finding participant:', error);
    return null;
  }

  return data;
}

/**
 * Créer un nouveau participant
 */
export async function createParticipant(
  sessionId: string,
  name: string,
  email: string
): Promise<Participant> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  const { data, error } = await supabase
    .from('participants')
    .insert({
      session_id: sessionId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      status: 'connected',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating participant:', error);
    throw new Error(`Error al crear participante: ${error.message}`);
  }

  return data;
}

/**
 * Rejoindre une session (reconnexion ou nouvelle inscription)
 */
export async function joinSession(
  sessionId: string,
  name: string,
  email: string
): Promise<Participant> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase no configurado');
  }

  // Vérifier si le participant existe déjà
  const existingParticipant = await findParticipantByEmail(sessionId, email);

  if (existingParticipant) {
    // Reconnexion : mettre à jour le statut et last_seen_at
    const { data, error } = await supabase
      .from('participants')
      .update({
        status: 'connected',
        last_seen_at: new Date().toISOString(),
        // Optionnellement mettre à jour le nom si changé
        name: name.trim(),
      })
      .eq('id', existingParticipant.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating participant:', error);
      throw new Error(`Error al reconectar: ${error.message}`);
    }

    return data;
  } else {
    // Nouveau participant
    return await createParticipant(sessionId, name, email);
  }
}

/**
 * Obtenir tous les participants d'une session
 */
export async function getSessionParticipants(
  sessionId: string
): Promise<Participant[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('session_id', sessionId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('Error fetching participants:', error);
    return [];
  }

  return data;
}

/**
 * Mettre à jour le statut d'un participant
 */
export async function updateParticipantStatus(
  participantId: string,
  status: 'connected' | 'disconnected'
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from('participants')
    .update({
      status,
      last_seen_at: new Date().toISOString(),
    })
    .eq('id', participantId);

  if (error) {
    console.error('Error updating participant status:', error);
  }
}

/**
 * Quitter une session (marquer comme déconnecté)
 */
export async function leaveSession(participantId: string): Promise<void> {
  await updateParticipantStatus(participantId, 'disconnected');
}

/**
 * Obtenir le nombre de participants connectés
 */
export async function getOnlineParticipantsCount(
  sessionId: string
): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('status', 'connected');

  if (error) {
    console.error('Error counting participants:', error);
    return 0;
  }

  return count || 0;
}
