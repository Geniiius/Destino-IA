/**
 * @file env.ts
 * @description Configuration des variables d'environnement avec validation
 *
 * IMPORTANT: Ce fichier centralise TOUTES les variables d'environnement.
 * N'accède jamais à import.meta.env directement dans d'autres fichiers.
 *
 * Solo PDF.js + Supabase - Sin IA
 */

interface EnvConfig {
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // App
  APP_ENV: "development" | "staging" | "production";
  APP_VERSION: string;

  // Features flags
  ENABLE_REALTIME: boolean;
}

/**
 * Obtient une variable d'environnement avec validation
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;

  if (!value && !defaultValue) {
    // Pas de warning pour les clés optionnelles
    return "";
  }

  return value;
}

/**
 * Parse un booléen depuis une variable d'environnement
 */
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === "true" || value === "1";
}

/**
 * Configuration d'environnement exportée
 * Usage: import { env } from '@/config/env'
 */
export const env: EnvConfig = {
  // Supabase
  SUPABASE_URL: getEnvVar("VITE_SUPABASE_URL", ""),
  SUPABASE_ANON_KEY: getEnvVar("VITE_SUPABASE_ANON_KEY", ""),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar("VITE_SUPABASE_SERVICE_ROLE_KEY", ""),

  // App
  APP_ENV: getEnvVar("VITE_APP_ENV", "development") as EnvConfig["APP_ENV"],
  APP_VERSION: getEnvVar("VITE_APP_VERSION", "0.1.0"),

  // Features
  ENABLE_REALTIME: getEnvBoolean("VITE_ENABLE_REALTIME", true),
};

/**
 * Validation en développement
 */
export function validateEnv(): void {
  // Supabase est optionnel
  if (!env.SUPABASE_URL && env.ENABLE_REALTIME) {
    console.warn(
      "⚠️ Supabase non configuré - Les fonctionnalités realtime seront désactivées.",
    );
  }
}

// Ejecutar validación al importar
if (typeof window !== "undefined") {
  validateEnv();
}
