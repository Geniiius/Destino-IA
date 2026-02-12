/**
 * @file features/auth/components/JoinForm.tsx
 * @description Formulario de inscripción/inicio de sesión para participantes
 *
 * Utiliza Supabase Auth para crear una cuenta real.
 * Fallback al sistema antiguo si Supabase no está configurado.
 */

import React, { useState } from "react";
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
} from "lucide-react";
import { LIMITS, ROUTES } from "@/config";
import { useAuth } from "@/hooks/useAuth";
import { isAuthConfigured } from "@/services/auth";
import { joinSession } from "@/services/participants";

interface JoinFormProps {
  onJoin: (
    name: string,
    email: string,
    id?: string,
    participantTableId?: string,
  ) => void;
}

const DEFAULT_SESSION_ID = "destino-ia-workshop";

type FormMode = "signup" | "signin";

export const JoinForm: React.FC<JoinFormProps> = ({ onJoin }) => {
  const auth = useAuth();
  const useSupabaseAuth = isAuthConfigured();

  const [mode, setMode] = useState<FormMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validaciones comunes
    if (mode === "signup" && trimmedName.length < LIMITS.MIN_NAME_LENGTH) {
      setError(
        `El nombre debe contener al menos ${LIMITS.MIN_NAME_LENGTH} caracteres`,
      );
      return;
    }
    if (mode === "signup" && trimmedName.length > LIMITS.MAX_NAME_LENGTH) {
      setError(
        `El nombre no puede superar ${LIMITS.MAX_NAME_LENGTH} caracteres`,
      );
      return;
    }
    if (!trimmedEmail) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    if (useSupabaseAuth) {
      // Validación contraseña
      if (!password || password.length < 6) {
        setError("La contraseña debe contener al menos 6 caracteres");
        return;
      }

      setIsLoading(true);

      if (mode === "signup") {
        const { success: ok, error: authError } = await auth.signUp(
          trimmedEmail,
          password,
          trimmedName,
        );
        if (!ok) {
          setError(authError || "Error al inscribirse");
          setIsLoading(false);
          return;
        }
        // Aussi insérer dans la table participants pour le dashboard admin
        let participantTableId: string | undefined;
        try {
          const p = await joinSession(
            DEFAULT_SESSION_ID,
            trimmedName,
            trimmedEmail,
          );
          participantTableId = p?.id;
        } catch (e) {
          console.warn("Participant table sync:", e);
        }
        setSuccess("¡Inscripción exitosa! Redirigiendo...");
        setTimeout(() => {
          onJoin(trimmedName, trimmedEmail, auth.user?.id, participantTableId);
        }, 800);
      } else {
        const { success: ok, error: authError } = await auth.signIn(
          trimmedEmail,
          password,
        );
        if (!ok) {
          setError(authError || "Error de conexión");
          setIsLoading(false);
          return;
        }
        // Aussi mettre à jour le statut dans la table participants
        let participantTableId: string | undefined;
        try {
          const p = await joinSession(
            DEFAULT_SESSION_ID,
            auth.user?.display_name || trimmedEmail,
            trimmedEmail,
          );
          participantTableId = p?.id;
        } catch (e) {
          console.warn("Participant table sync:", e);
        }
        onJoin(
          auth.user?.display_name || trimmedEmail,
          trimmedEmail,
          auth.user?.id,
          participantTableId,
        );
      }

      setIsLoading(false);
    } else {
      // Fallback sans Supabase
      setIsLoading(true);
      try {
        const participant = await joinSession(
          DEFAULT_SESSION_ID,
          trimmedName,
          trimmedEmail,
        );
        onJoin(trimmedName, trimmedEmail, participant?.id, participant?.id);
      } catch (err) {
        console.warn("Supabase non disponible:", err);
        onJoin(trimmedName, trimmedEmail);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    window.location.hash = ROUTES.HOME;
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signup" ? "signin" : "signup"));
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="relative z-10 w-full max-w-md px-8 animate-slide-up-strong">
      {isFocused && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0 pointer-events-none transition-opacity duration-300" />
      )}

      <div className="card-glass p-8 relative z-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            {mode === "signup" ? (
              <UserPlus className="w-6 h-6 text-emerald-500" />
            ) : (
              <LogIn className="w-6 h-6 text-emerald-500" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {mode === "signup" ? "Unirse al taller" : "Reconectarse"}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === "signup"
                ? "Crea tu cuenta para participar"
                : "Recupera tu sesión"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom (seulement en inscription) */}
          {mode === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Tu nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-30" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Ex : María García"
                  className="input-elegant pl-11 relative z-30 bg-black/80 backdrop-blur-md"
                  maxLength={LIMITS.MAX_NAME_LENGTH}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-30" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ex : maria@ejemplo.com"
                className="input-elegant pl-11 relative z-30 bg-black/80 backdrop-blur-md"
                autoComplete="email"
                autoFocus={mode === "signin"}
              />
            </div>
          </div>

          {/* Mot de passe (seulement avec Supabase) */}
          {useSupabaseAuth && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-30" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={
                    mode === "signup"
                      ? "Mínimo 6 caracteres"
                      : "Tu contraseña"
                  }
                  className="input-elegant pl-11 pr-11 relative z-30 bg-black/80 backdrop-blur-md"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 z-30"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1.5 text-xs text-gray-500">
                  Esta contraseña te permitirá reconectarte
                </p>
              )}
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-sm text-emerald-400">{success}</p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="btn-elegant-secondary flex-1 py-4 disabled:opacity-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-elegant-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "signup" ? "Inscribiendo..." : "Conectando..."}
                </>
              ) : (
                <>
                  {mode === "signup" ? "Inscribirse" : "Conectarse"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Switch mode */}
          {useSupabaseAuth && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={toggleMode}
                className="text-gray-500 text-sm hover:text-emerald-400 transition-colors"
              >
                {mode === "signup"
                  ? "¿Ya registrado? Conectarse"
                  : "¿Aún no tienes cuenta? Inscribirse"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
