/**
 * @file features/auth/components/JoinForm.tsx
 * @description Formulario de ingreso para participantes
 */

import React, { useState } from "react";
import { ArrowRight, User, Mail, Loader2 } from "lucide-react";
import { LIMITS, ROUTES } from "@/config";
import { joinSession } from "@/services/participants";

interface JoinFormProps {
  onJoin: (name: string, email: string, id?: string) => void;
}

// Session ID par défaut pour le workshop
const DEFAULT_SESSION_ID = "destino-ia-workshop";

export const JoinForm: React.FC<JoinFormProps> = ({ onJoin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validaciones
    if (trimmedName.length < LIMITS.MIN_NAME_LENGTH) {
      setError(
        `El nombre debe tener al menos ${LIMITS.MIN_NAME_LENGTH} caracteres`,
      );
      return;
    }

    if (trimmedName.length > LIMITS.MAX_NAME_LENGTH) {
      setError(
        `El nombre no puede exceder ${LIMITS.MAX_NAME_LENGTH} caracteres`,
      );
      return;
    }

    if (!trimmedEmail) {
      setError("El email es obligatorio");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      // Créer ou rejoindre la session
      const participant = await joinSession(
        DEFAULT_SESSION_ID,
        trimmedName,
        trimmedEmail
      );
      onJoin(trimmedName, trimmedEmail, participant?.id);
    } catch (err) {
      // Si Supabase n'est pas configuré, continuer sans ID
      console.warn("Supabase non disponible, continuation sans ID:", err);
      onJoin(trimmedName, trimmedEmail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.location.hash = ROUTES.HOME;
  };

  return (
    <div className="relative z-10 w-full max-w-md px-8 animate-slide-up-strong">
      {/* Overlay pour atténuer l'effet pendant la saisie */}
      {isFocused && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0 pointer-events-none transition-opacity duration-300" />
      )}

      <div className="card-glass p-8 relative z-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Únete al Taller</h2>
            <p className="text-gray-400 text-sm">
              Ingresa tu nombre para participar
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tu nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ej: María García"
              className="input-elegant relative z-30 bg-black/80 backdrop-blur-md"
              maxLength={LIMITS.MAX_NAME_LENGTH}
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tu email
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
                placeholder="Ej: maria@ejemplo.com"
                className="input-elegant pl-11 relative z-30 bg-black/80 backdrop-blur-md"
                autoComplete="email"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Tu email te permite reconectar si pierdes la conexión
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

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
                  Conectando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
