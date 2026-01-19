/**
 * @file features/auth/components/JoinForm.tsx
 * @description Formulario de ingreso para participantes
 */

import React, { useState } from 'react';
import { ArrowRight, User, Mail } from 'lucide-react';
import { LIMITS, ROUTES } from '@/config';

interface JoinFormProps {
  onJoin: (name: string, email: string) => void;
}

export const JoinForm: React.FC<JoinFormProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validaciones
    if (trimmedName.length < LIMITS.MIN_NAME_LENGTH) {
      setError(`El nombre debe tener al menos ${LIMITS.MIN_NAME_LENGTH} caracteres`);
      return;
    }

    if (trimmedName.length > LIMITS.MAX_NAME_LENGTH) {
      setError(`El nombre no puede exceder ${LIMITS.MAX_NAME_LENGTH} caracteres`);
      return;
    }

    if (!trimmedEmail) {
      setError('El email es obligatorio');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    onJoin(trimmedName, trimmedEmail);
  };

  const handleBack = () => {
    window.location.hash = ROUTES.HOME;
  };

  return (
    <div className="relative z-10 w-full max-w-md px-8 animate-slide-up-strong">
      <div className="card-glass p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Únete al Taller</h2>
            <p className="text-gray-400 text-sm">Ingresa tu nombre para participar</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Tu nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María García"
              className="input-elegant"
              maxLength={LIMITS.MAX_NAME_LENGTH}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Tu email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: maria@ejemplo.com"
                className="input-elegant pl-11"
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
              className="btn-elegant-secondary flex-1 py-4"
            >
              Volver
            </button>
            <button
              type="submit"
              className="btn-elegant-primary flex-1 py-4 flex items-center justify-center gap-2"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
