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

import { getSupabaseClient } from "@/services/supabase/client";
import { env } from "@/config/env";

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
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    // 1. Mettre à jour la table participants
    const { error: partError } = await supabase
      .from("participants")
      .update({
        status: "disconnected",
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", participantId);

    if (partError) {
      console.error("[AdminUsers] Erreur déconnexion participant:", partError);
      return { success: false, error: partError.message };
    }

    // 2. Tenter aussi de mettre à jour le profil si lié
    //    (fire & forget — le participant n'a pas forcément de profil auth)
    await supabase
      .from("profiles")
      .update({
        is_online: false,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", participantId)
      .then(
        () => {},
        () => {},
      );

    console.log("[AdminUsers] Participant déconnecté:", participantId);
    return { success: true, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[AdminUsers] Erreur forceDisconnect:", msg);
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
    return { success: false, count: 0, error: "Supabase non configuré" };
  }

  try {
    const { data, error } = await supabase
      .from("participants")
      .update({
        status: "disconnected",
        last_seen_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId)
      .eq("status", "connected")
      .select("id");

    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    const count = data?.length ?? 0;
    console.log(`[AdminUsers] ${count} participants déconnectés`);
    return { success: true, count, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur inconnue";
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
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = upper + lower + digits;

  // Garantir au moins 1 majuscule, 1 minuscule, 1 chiffre
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];

  for (let i = 3; i < length; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  // Mélanger
  return pwd
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

/**
 * Réinitialise le mot de passe d'un participant via Supabase.
 *
 * Approche 1 (prioritaire) : Database RPC « admin_reset_user_password »
 *   → fonction PL/pgSQL SECURITY DEFINER, pas besoin de service_role
 * Approche 2 (fallback)    : Edge Function « admin-reset-password »
 *   → côté serveur avec service_role key
 * Approche 3 (fallback)    : API Admin REST directe
 *   → nécessite VITE_SUPABASE_SERVICE_ROLE_KEY dans l'env
 * Approche 4 (sans newPassword) : Envoyer un email de reset
 *
 * IMPORTANT : Si aucune approche ne réussit, on retourne success: false.
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
      // ─── Approche 1 : Database RPC (la plus simple et sécurisée) ───
      try {
        const { data, error } = await supabase.rpc(
          'admin_reset_user_password',
          {
            target_email: email,
            new_password: newPassword,
          },
        );

        if (!error && data?.success) {
          console.log(
            '[AdminUsers] Mot de passe mis à jour via RPC',
          );
          return {
            success: true,
            generatedPassword: newPassword,
            error: null,
          };
        }

        if (error) {
          console.warn(
            '[AdminUsers] RPC non dispo, tentative Edge Function:',
            error.message,
          );
        } else if (data?.error) {
          // La RPC existe mais a retourné une erreur métier
          return {
            success: false,
            error: data.error,
          };
        }
      } catch (rpcErr) {
        console.warn(
          '[AdminUsers] RPC non disponible:',
          rpcErr,
        );
      }

      // ─── Approche 2 : Edge Function (côté serveur) ───
      try {
        const { data, error } = await supabase.functions.invoke(
          'admin-reset-password',
          {
            body: { email, newPassword },
          },
        );

        if (!error && data?.success) {
          console.log(
            '[AdminUsers] Mot de passe mis à jour via Edge Function',
          );
          return {
            success: true,
            generatedPassword: newPassword,
            error: null,
          };
        }

        if (error) {
          console.warn(
            '[AdminUsers] Edge Function erreur:',
            error,
          );
        }
      } catch (edgeFnErr) {
        console.warn(
          '[AdminUsers] Edge Function non disponible:',
          edgeFnErr,
        );
      }

      // ─── Approche 3 : API Admin REST avec service_role key ───
      if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
        const updated = await tryAdminApiPasswordUpdate(
          email,
          newPassword,
        );
        if (updated) {
          return {
            success: true,
            generatedPassword: newPassword,
            error: null,
          };
        }
      }

      // ─── Aucune approche n'a fonctionné ───
      return {
        success: false,
        generatedPassword: newPassword,
        error:
          'Impossible de mettre à jour le mot de passe. ' +
          'Exécutez la migration 006_admin_reset_password.sql ' +
          'dans le SQL Editor de Supabase Dashboard.',
      };
    }

    // Sans newPassword : envoyer un email de réinitialisation
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
 * Tentative de mise à jour du mot de passe via l'API Admin REST.
 * Extraite pour réduire la complexité de adminResetPassword.
 */
async function tryAdminApiPasswordUpdate(
  email: string,
  newPassword: string,
): Promise<boolean> {
  try {
    const listRes = await fetch(
      `${env.SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`,
      {
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        },
      },
    );

    if (!listRes.ok) return false;

    const listData = await listRes.json();
    const users = listData.users || listData;
    const targetUser = (Array.isArray(users) ? users : []).find(
      (u: { email?: string }) =>
        u.email?.toLowerCase() === email.toLowerCase().trim(),
    );

    if (!targetUser) {
      console.warn('[AdminUsers] Utilisateur non trouvé:', email);
      return false;
    }

    const updateRes = await fetch(
      `${env.SUPABASE_URL}/auth/v1/admin/users/${targetUser.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      },
    );

    if (updateRes.ok) {
      console.log('[AdminUsers] Mot de passe mis à jour via Admin API');
      return true;
    }

    console.warn('[AdminUsers] Admin API update failed:', updateRes.status);
    return false;
  } catch (adminErr) {
    console.warn('[AdminUsers] Admin API erreur:', adminErr);
    return false;
  }
}

/**
 * Obtenir les infos détaillées d'un participant
 * (table participants + profil auth si lié).
 */
export async function getParticipantDetails(participantId: string): Promise<{
  participant: Record<string, unknown> | null;
  profile: Record<string, unknown> | null;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      participant: null,
      profile: null,
      error: "Supabase non configuré",
    };
  }

  try {
    // Participant de la table participants
    const { data: participant, error: partError } = await supabase
      .from("participants")
      .select("*")
      .eq("id", participantId)
      .single();

    if (partError) {
      return { participant: null, profile: null, error: partError.message };
    }

    // Profil auth si existe
    let profile = null;
    if (participant?.email) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", participant.email)
        .maybeSingle();

      profile = profileData;
    }

    return { participant, profile, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur inconnue";
    return { participant: null, profile: null, error: msg };
  }
}
