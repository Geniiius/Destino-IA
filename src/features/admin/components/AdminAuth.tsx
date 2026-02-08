/**
 * @file features/admin/components/AdminAuth.tsx
 * @description Gate d'authentification admin — mot de passe simple
 *
 * Le mot de passe est défini via VITE_ADMIN_PASSWORD.
 * Par défaut en dev : 'admin' (pour ne pas bloquer le développement).
 * En production, il FAUT définir un vrai mot de passe dans .env.
 *
 * Le mot de passe est stocké en sessionStorage pour éviter de le
 * redemander à chaque changement d'onglet dans la même session navigateur.
 */

import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
const STORAGE_KEY = 'destino_admin_auth';

interface AdminAuthProps {
  children: React.ReactNode;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Vérifier si déjà authentifié dans cette session navigateur
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      setPassword('');
      // Shake animation reset
      setTimeout(() => setError(false), 600);
    }
  };

  // Pendant la vérification initiale
  if (isChecking) {
    return null;
  }

  // Déjà authentifié → afficher le dashboard
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Formulaire de mot de passe
  return (
    <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo / titre */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Administration</h1>
          <p className="text-gray-500 text-sm mt-1">
            Entrez le mot de passe pour accéder au panel
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              autoFocus
              className={`w-full bg-white/5 border rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                error
                  ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20 animate-[shake_0.5s_ease-in-out]'
                  : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">
              Mot de passe incorrect
            </p>
          )}

          <button
            type="submit"
            disabled={!password.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all text-sm"
          >
            <span>Accéder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Lien retour */}
        <div className="text-center mt-6">
          <button
            onClick={() => { window.location.hash = ''; }}
            className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
