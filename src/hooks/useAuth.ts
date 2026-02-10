/**
 * @file hooks/useAuth.ts
 * @description Hook d'authentification centralisé
 *
 * Gère tout le cycle de vie de l'auth :
 * - Vérification de session au montage
 * - Écoute des changements d'état
 * - Heartbeat de présence
 * - Actions (signUp, signIn, signOut, etc.)
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  resetPassword as authResetPassword,
  getCurrentUser,
  updateProfile as authUpdateProfile,
  onAuthStateChange,
  heartbeat,
  markOffline,
} from "@/services/auth";
import type { UserProfile, AuthState, UseAuthReturn } from "@/types/auth";

/** Intervalle du heartbeat (30 secondes) */
const HEARTBEAT_INTERVAL = 30_000;

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    email: null,
    role: null,
    isAdmin: false,
    error: null,
  });

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // ── Mettre à jour l'état depuis un profil ───────

  const setUser = useCallback((user: UserProfile | null) => {
    setState({
      isAuthenticated: !!user,
      isLoading: false,
      user,
      email: user?.email || null,
      role: user?.role || null,
      isAdmin: user?.role === "admin",
      error: null,
    });
  }, []);

  // ── Démarrer le heartbeat ──────────────────────

  const startHeartbeat = useCallback((userId: string) => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(
      () => heartbeat(userId),
      HEARTBEAT_INTERVAL,
    );
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // ── Initialisation : vérifier session existante ─

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setUser(user);
          if (user) startHeartbeat(user.id);
        }
      } catch (err) {
        console.warn("[Auth] Erreur init:", err);
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
          }));
        }
      }
    }

    // Timeout de sécurité : ne jamais rester bloqué plus de 3s
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setState((prev) => {
          if (prev.isLoading) {
            console.warn(
              "[Auth] Timeout de sécurité atteint — déblocage forcé",
            );
            return {
              ...prev,
              isLoading: false,
              isAuthenticated: false,
              user: null,
            };
          }
          return prev;
        });
      }
    }, 3000);

    init().finally(() => clearTimeout(safetyTimeout));

    // Écouter les changements d'auth
    cleanupRef.current = onAuthStateChange((user) => {
      if (isMounted) {
        setUser(user);
        if (user) {
          startHeartbeat(user.id);
        } else {
          stopHeartbeat();
        }
      }
    });

    // Cleanup beforeunload pour marquer offline
    const handleBeforeUnload = () => {
      if (state.user) {
        markOffline(state.user.id);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      stopHeartbeat();
      cleanupRef.current?.();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ─────────────────────────────────────

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { user, error } = await authSignUp(email, password, displayName);

      if (error) {
        setState((prev) => ({ ...prev, isLoading: false, error }));
        return { success: false, error };
      }

      setUser(user);
      if (user) startHeartbeat(user.id);
      return { success: true };
    },
    [setUser, startHeartbeat],
  );

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { user, error } = await authSignIn(email, password);

      if (error) {
        setState((prev) => ({ ...prev, isLoading: false, error }));
        return { success: false, error };
      }

      setUser(user);
      if (user) startHeartbeat(user.id);
      return { success: true };
    },
    [setUser, startHeartbeat],
  );

  const signOutAction = useCallback(async () => {
    if (state.user) {
      await markOffline(state.user.id);
    }
    stopHeartbeat();
    await authSignOut();
    setUser(null);
  }, [state.user, stopHeartbeat, setUser]);

  const resetPasswordAction = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      const { success, error } = await authResetPassword(email);
      return { success, error: error || undefined };
    },
    [],
  );

  const updateProfileAction = useCallback(
    async (
      updates: Partial<
        Pick<UserProfile, "display_name" | "avatar_url" | "metadata">
      >,
    ) => {
      if (!state.user) return;
      const updated = await authUpdateProfile(state.user.id, updates);
      if (updated) setUser(updated);
    },
    [state.user, setUser],
  );

  return {
    ...state,
    signUp,
    signIn,
    signOut: signOutAction,
    resetPassword: resetPasswordAction,
    updateProfile: updateProfileAction,
  };
}
