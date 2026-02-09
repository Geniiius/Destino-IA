/**
 * @file services/auth.ts
 * @description Service d'authentification Supabase
 *
 * Gère :
 * - Inscription (signUp)
 * - Connexion (signIn)
 * - Déconnexion (signOut)
 * - Réinitialisation de mot de passe
 * - Gestion du profil
 * - Détection de session existante
 */

/* eslint-disable no-console, camelcase */

import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase/client';
import type { UserProfile } from '@/types/auth';

// ============================================
// INSCRIPTION
// ============================================

/**
 * Inscription d'un nouvel utilisateur.
 * Le profil est créé automatiquement par le trigger SQL.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: UserProfile | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { user: null, error: 'Supabase non configuré' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
          role: 'participant',
        },
        // Pas de confirmation email en mode atelier
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      return { user: null, error: translateAuthError(error.message) };
    }

    if (!data.user) {
      return { user: null, error: 'Utilisateur non créé' };
    }

    // Attendre un peu que le trigger crée le profil
    await new Promise(resolve => setTimeout(resolve, 500));

    // Récupérer le profil créé par le trigger
    const profile = await getProfile(data.user.id);
    return { user: profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[Auth] Erreur inscription:', message);
    return { user: null, error: message };
  }
}

// ============================================
// CONNEXION
// ============================================

/**
 * Connexion avec email et mot de passe.
 * Met à jour le statut en ligne.
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { user: null, error: 'Supabase non configuré' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      return { user: null, error: translateAuthError(error.message) };
    }

    if (!data.user) {
      return { user: null, error: 'Connexion échouée' };
    }

    // Mettre à jour le statut en ligne
    await supabase
      .from('profiles')
      .update({ is_online: true, last_seen_at: new Date().toISOString() })
      .eq('id', data.user.id);

    const profile = await getProfile(data.user.id);
    return { user: profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[Auth] Erreur connexion:', message);
    return { user: null, error: message };
  }
}

// ============================================
// DÉCONNEXION
// ============================================

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Marquer comme hors ligne avant de se déconnecter
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ is_online: false, last_seen_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    await supabase.auth.signOut();
  } catch (err) {
    console.error('[Auth] Erreur déconnexion:', err);
  }
}

// ============================================
// SESSION EXISTANTE
// ============================================

/**
 * Vérifie si une session existe déjà (utilisateur déjà connecté).
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const profile = await getProfile(user.id);

    // Mettre à jour last_seen
    if (profile) {
      await supabase
        .from('profiles')
        .update({ is_online: true, last_seen_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    return profile;
  } catch {
    return null;
  }
}

// ============================================
// PROFIL
// ============================================

/**
 * Récupère le profil d'un utilisateur.
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[Auth] Erreur profil:', error.message);
      return null;
    }

    return data as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Met à jour le profil de l'utilisateur courant.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'display_name' | 'avatar_url' | 'metadata'>>
): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (err) {
    console.error('[Auth] Erreur mise à jour profil:', err);
    return null;
  }
}

// ============================================
// RÉINITIALISATION MOT DE PASSE
// ============================================

/**
 * Envoie un email de réinitialisation de mot de passe.
 */
export async function resetPassword(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase non configuré' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      {
        redirectTo: `${window.location.origin}/#reset-password`,
      }
    );

    if (error) {
      return { success: false, error: translateAuthError(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: message };
  }
}

// ============================================
// ADMIN : GESTION DES UTILISATEURS
// ============================================

/**
 * Obtenir tous les profils participants (admin only).
 */
export async function getAllParticipants(
  sessionId: string = 'destino-ia-workshop'
): Promise<UserProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('current_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as UserProfile[]) || [];
  } catch (err) {
    console.error('[Auth] Erreur liste participants:', err);
    return [];
  }
}

/**
 * Obtenir les statistiques de session (admin only).
 */
export async function getSessionStats(
  sessionId: string = 'destino-ia-workshop'
): Promise<Record<string, number> | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .rpc('get_session_stats', { p_session_id: sessionId });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[Auth] Erreur stats:', err);
    return null;
  }
}

// ============================================
// ÉCOUTE DES CHANGEMENTS D'AUTH
// ============================================

/**
 * S'abonne aux changements d'état d'authentification.
 * @returns Fonction de cleanup
 */
export function onAuthStateChange(
  callback: (user: UserProfile | null) => void
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getProfile(session.user.id);
        callback(profile);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const profile = await getProfile(session.user.id);
        callback(profile);
      }
    }
  );

  return () => subscription.unsubscribe();
}

// ============================================
// HEARTBEAT (présence)
// ============================================

/**
 * Met à jour le last_seen_at du profil (heartbeat).
 * Appelé périodiquement pour maintenir la présence.
 */
export async function heartbeat(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase
      .from('profiles')
      .update({ is_online: true, last_seen_at: new Date().toISOString() })
      .eq('id', userId);
  } catch {
    // Silencieux - pas critique
  }
}

/**
 * Marque l'utilisateur comme hors ligne.
 */
export async function markOffline(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase
      .from('profiles')
      .update({ is_online: false, last_seen_at: new Date().toISOString() })
      .eq('id', userId);
  } catch {
    // Silencieux
  }
}

// ============================================
// UTILITAIRES
// ============================================

/**
 * Vérifie si Supabase Auth est configuré et fonctionnel.
 */
export function isAuthConfigured(): boolean {
  return isSupabaseConfigured();
}

/**
 * Traduit les erreurs Supabase Auth en français.
 */
function translateAuthError(message: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Email ou mot de passe incorrect',
    'User already registered': 'Un compte existe déjà avec cet email',
    'Email not confirmed': 'Veuillez confirmer votre email',
    'Invalid email': 'Adresse email invalide',
    'Signup requires a valid password': 'Le mot de passe est requis',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
    'Email rate limit exceeded': 'Trop de tentatives. Réessayez dans quelques minutes.',
    'For security purposes, you can only request this after': 'Pour des raisons de sécurité, veuillez attendre avant de réessayer.',
  };

  for (const [key, value] of Object.entries(translations)) {
    if (message.includes(key)) return value;
  }

  return message;
}
