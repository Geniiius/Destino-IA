/**
 * @file types/auth.ts
 * @description Types pour l'authentification et les profils utilisateurs
 */

/* eslint-disable camelcase */

// ============================================
// RÔLES
// ============================================

export type UserRole = 'admin' | 'participant';

// ============================================
// PROFIL UTILISATEUR
// ============================================

/**
 * Profil utilisateur stocké dans la table `profiles`.
 * Lié à auth.users via l'UUID.
 */
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  current_session_id: string | null;
  is_online: boolean;
  last_seen_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ============================================
// ÉTAT D'AUTH
// ============================================

export interface AuthState {
  /** L'utilisateur est-il authentifié ? */
  isAuthenticated: boolean;

  /** Chargement en cours (vérification session) */
  isLoading: boolean;

  /** Profil complet de l'utilisateur */
  user: UserProfile | null;

  /** Email de l'utilisateur (lecture rapide) */
  email: string | null;

  /** Rôle de l'utilisateur */
  role: UserRole | null;

  /** Est-ce un admin ? */
  isAdmin: boolean;

  /** Erreur éventuelle */
  error: string | null;
}

// ============================================
// ACTIONS D'AUTH
// ============================================

export interface AuthActions {
  /** Inscription avec email + mot de passe */
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;

  /** Connexion */
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;

  /** Déconnexion */
  signOut: () => Promise<void>;

  /** Demander la réinitialisation du mot de passe */
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;

  /** Mettre à jour le profil */
  updateProfile: (updates: Partial<Pick<UserProfile, 'display_name' | 'avatar_url' | 'metadata'>>) => Promise<void>;
}

// ============================================
// HOOK RETURN
// ============================================

export interface UseAuthReturn extends AuthState, AuthActions {}

// ============================================
// ADMIN : GESTION DES UTILISATEURS
// ============================================

export interface AdminUserActions {
  /** Obtenir tous les participants */
  getParticipants: () => Promise<UserProfile[]>;

  /** Déclencher la réinitialisation de mot de passe pour un utilisateur */
  resetUserPassword: (userId: string, email: string) => Promise<{ success: boolean; error?: string }>;

  /** Envoyer un message broadcast */
  sendBroadcast: (message: string, type?: 'info' | 'warning' | 'success' | 'alert') => Promise<void>;

  /** Envoyer un message direct */
  sendDirectMessage: (participantId: string, message: string) => Promise<void>;
}
