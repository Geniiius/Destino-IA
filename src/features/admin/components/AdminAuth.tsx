/**
 * @file features/admin/components/AdminAuth.tsx
 * @description Puerta de autenticación admin vía Supabase Auth
 *
 * Utiliza Supabase Auth para una autenticación real.
 * Solo los usuarios con role='admin' pueden acceder al dashboard.
 * Fallback a contraseña simple si Supabase no está configurado.
 */

import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Mail,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isAuthConfigured } from "@/services/auth";

/* ── Fallback sans Supabase ─────────────────────── */
const FALLBACK_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin";
const STORAGE_KEY = "destino_admin_auth";

interface AdminAuthProps {
  children: React.ReactNode;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const auth = useAuth();
  const useSupabaseAuth = isAuthConfigured();

  // ── State fallback (sans Supabase) ──────────────
  const [fallbackAuth, setFallbackAuth] = useState(false);
  const [fallbackChecking, setFallbackChecking] = useState(true);

  // ── State commun ────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Vérification fallback
  useEffect(() => {
    if (!useSupabaseAuth) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "true") setFallbackAuth(true);
      setFallbackChecking(false);
    }
  }, [useSupabaseAuth]);

  // ── Submit ──────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (useSupabaseAuth) {
      // Auth Supabase
      const { success, error: authError } = await auth.signIn(
        email.trim(),
        password,
      );

      if (!success) {
        setError(authError || "Conexión fallida");
        setPassword("");
        setIsLoading(false);
        return;
      }

      // Vérifier le rôle admin après connexion
      // Le hook useAuth met à jour automatiquement
      setIsLoading(false);
    } else {
      // Fallback
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (password === FALLBACK_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setFallbackAuth(true);
      } else {
        setError("Contraseña incorrecta");
        setPassword("");
      }
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (useSupabaseAuth) {
      await auth.signOut();
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      setFallbackAuth(false);
    }
    window.location.hash = "";
  };

  // ── Chargement ──────────────────────────────────

  const isChecking = useSupabaseAuth ? auth.isLoading : fallbackChecking;
  const isAuthenticated = useSupabaseAuth
    ? auth.isAuthenticated && auth.isAdmin
    : fallbackAuth;

  // Auth Supabase mais pas admin
  const isAuthButNotAdmin =
    useSupabaseAuth && auth.isAuthenticated && !auth.isAdmin;

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030305] flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-emerald-500/60 animate-spin" />
      </div>
    );
  }

  // Authentifié + admin → dashboard
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Connecté mais pas admin
  if (isAuthButNotAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030305] flex flex-col items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-red-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Acceso denegado
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Esta cuenta no tiene permisos de administrador.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSignOut}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-all"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => {
                window.location.hash = "#workshop";
              }}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white text-sm transition-all"
            >
              Ir al taller
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire de connexion ─────────────────────

  return (
    <div className="fixed inset-0 z-50 bg-[#030305] flex flex-col items-center justify-center overflow-hidden">
      {/* Background subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.03)_0%,transparent_40%)]" />
      </div>

      {/* Grille très subtile */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div
        className={`relative z-10 w-full max-w-[360px] px-6 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Logo / titre */}
        <div
          className={`text-center mb-10 transition-all duration-700 delay-100 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div
              className="absolute inset-0 bg-emerald-500/10 rounded-2xl animate-pulse"
              style={{ animationDuration: "3s" }}
            />
            <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 rounded-2xl flex items-center justify-center border border-emerald-500/10">
              <ShieldCheck
                className="w-9 h-9 text-emerald-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Administration
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-light">
            Acceso seguro al panel de control
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 transition-all duration-700 delay-200 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {/* Email (seulement avec Supabase) */}
          {useSupabaseAuth && (
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-emerald-500/70" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico del administrador"
                autoFocus
                disabled={isLoading}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all duration-300 text-sm tracking-wide disabled:opacity-50 hover:border-white/10"
              />
            </div>
          )}

          {/* Mot de passe */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-emerald-500/70" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoFocus={!useSupabaseAuth}
              disabled={isLoading}
              className={`w-full bg-white/[0.03] border rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 text-sm tracking-wide disabled:opacity-50 ${
                error
                  ? "border-red-500/40 bg-red-500/5 animate-[shake_0.4s_ease-in-out]"
                  : "border-white/[0.06] hover:border-white/10 focus:border-emerald-500/30 focus:bg-white/[0.05]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors duration-200 disabled:opacity-50"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Message d'erreur */}
          <div
            className={`overflow-hidden transition-all duration-300 ${error ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="text-red-400/80 text-xs text-center font-light py-1">
              {error}
            </p>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={
              !password.trim() ||
              (useSupabaseAuth && !email.trim()) ||
              isLoading
            }
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-300 text-sm group relative overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Acceder al panel</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Lien retour */}
        <div
          className={`text-center mt-8 transition-all duration-700 delay-300 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <button
            onClick={() => {
              window.location.hash = "";
            }}
            className="text-gray-600 text-xs hover:text-gray-400 transition-colors duration-300 font-light tracking-wide"
          >
            ← Volver al inicio
          </button>
        </div>

        {/* Indicateur de sécurité */}
        <div
          className={`flex items-center justify-center gap-1.5 mt-12 transition-all duration-700 delay-[400ms] ease-out ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
          <span className="text-[10px] text-gray-700 font-light tracking-wider uppercase">
            {useSupabaseAuth ? "Autenticación Supabase" : "Modo local"}
          </span>
          <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
        </div>
      </div>
    </div>
  );
};
