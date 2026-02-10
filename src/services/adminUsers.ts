/**
 * @file services/adminUsers.ts
 * @description Service admin pour la gestion des utilisateurs
 *
 * Fonctionnalités :
 * - Déconnexion forcée d'un participant
 * - Réinitialisation / génération de mot de passe
 * - Marquer un participant hors ligne
 */

/* eslint-disable no-console, camelcase */

import { getSupabaseClient } from '@/services/supabase/client';

// ============================================
// DÉCONNEXION FORCÉE
// ============================================

/**
 * Force la déconnexion d'un participant.
 * - Met à jour son statut dans la table `participants` → 'disconnected'
 * - Met à jour `profiles.is_online` → false
 *
 * Note : côté Supabase Auth, on ne peut pas invalider la session
 * d'un autre utilisateur sans service_role. On marque donc le
 * participant comme déconnecté dans les tables métier, et le
 * broadcast Realtime lui signalera la déconnexion.
 */
export async function forceDisconnectParticipant(
  participantId: string,
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase non configuré' };
  }

  try {
    // 1. Mettre à jour la table participants
    const { error: partError } = await supabase
      .from('participants')
      .update({
        status: 'disconnected',
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', participantId);

    if (partError) {
      console.error('[AdminUsers] Erreur déconnexion participant:', partError);
      return { success: false, error: partError.message };
    }

    // 2. Tenter aussi de mettre à jour le profil si lié
    //    (fire & forget — le participant n'a pas forcément de profil auth)
    await supabase
      .from('profiles')
      .update({
        is_online: false,
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', participantId)
      .then(
        () => {},
        () => {},
      );

    console.log('[AdminUsers] Participant déconnecté:', participantId);
    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[AdminUsers] Erreur forceDisconnect:', msg);
    return { success: false, error: msg };
  }
}

// ============================================
// DÉCONNEXION DE TOUS LES PARTICIPANTS
// ============================================

/**
 * Force la déconnexion de tous les participants d'une session.
 */
export async function forceDisconnectAll(
  sessionId: string,
): Promise<{ success: boolean; count: number; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, count: 0, error: 'Supabase non configuré' };
  }

  try {
    const { data, error } = await supabase
      .from('participants')
      .update({
        status: 'disconnected',
        last_seen_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)
      .eq('status', 'connected')
      .select('id');

    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    const count = data?.length ?? 0;
    console.log(`[AdminUsers] ${count} participants déconnectés`);
    return { success: true, count, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, count: 0, error: msg };
  }
}

// ============================================
// RÉINITIALISATION MOT DE PASSE (ADMIN)
// ============================================

/**
 * Génère un mot de passe aléatoire lisible.
 */
export function generatePassword(length = 10): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const all = upper + lower + digits;

  // Garantir au moins 1 majuscule, 1 minuscule, 1 chiffre
  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];

  for (let i = 3; i < length; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  // Mélanger
  return pwd
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Réinitialise le mot de passe d'un participant via Supabase Admin API.
 *
 * IMPORTANT : Cette fonction utilise l'API client. Pour une vraie
 * réinitialisation côté serveur, il faudrait une Edge Function avec
 * le service_role key. Ici, on envoie un email de réinitialisation
 * OU on génère un nouveau mot de passe si possible.
 *
 * Option 1 (par défaut) : Envoyer un email de reset
 * Option 2 (newPassword fourni) : Mettre à jour directement
 *   → nécessite une Edge Function ou accès admin
 */
export async function adminResetPassword(
  email: string,
  newPassword?: string,
): Promise<{
  success: boolean;
  generatedPassword?: string;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase non configuré' };
  }

  try {
    if (newPassword) {
      // Tentative de mise à jour directe via Edge Function
      // Si pas d'Edge Function, fallback sur email reset
      try {
        const { error } = await supabase.functions.invoke(
          'admin-reset-password',
          {
            body: { email, newPassword },
          },
        );

        if (!error) {
          return {
            success: true,
            generatedPassword: newPassword,
            error: null,
          };
        }

        console.warn(
          '[AdminUsers] Edge Function non dispo, fallback email:',
          error,
        );
      } catch {
        console.warn(
          '[AdminUsers] Edge Function non dispo, fallback email reset',
        );
      }
    }

    // Fallback : envoyer un email de réinitialisation
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      {
        redirectTo: `${window.location.origin}/#reset-password`,
      },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[AdminUsers] Erreur reset password:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Obtenir les infos détaillées d'un participant
 * (table participants + profil auth si lié).
 */
export async function getParticipantDetails(
  participantId: string,
): Promise<{
  participant: Record<string, unknown> | null;
  profile: Record<string, unknown> | null;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { participant: null, profile: null, error: 'Supabase non configuré' };
  }

  try {
    // Participant de la table participants
    const { data: participant, error: partError } = await supabase
      .from('participants')
      .select('*')
      .eq('id', participantId)
      .single();

    if (partError) {
      return { participant: null, profile: null, error: partError.message };
    }

    // Profil auth si existe
    let profile = null;
    if (participant?.email) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', participant.email)
        .maybeSingle();

      profile = profileData;
    }

    return { participant, profile, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return { participant: null, profile: null, error: msg };
  }
}
