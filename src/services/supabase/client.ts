/**
 * @file services/supabase/client.ts
 * @description Cliente de Supabase configurado
 *
 * Este archivo es el ÚNICO punto de acceso a Supabase.
 * Nunca importes @supabase/supabase-js directamente en otros archivos.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { REALTIME_CHANNELS } from "@/config/constants";

// Crear cliente singleton
let supabaseClient: SupabaseClient | null = null;

/**
 * Vérifie si Supabase est configuré
 */
export function isSupabaseConfigured(): boolean {
  return !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

/**
 * Obtiene la instancia del cliente Supabase
 * Retourne null si Supabase n'est pas configuré
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseClient;
}

/**
 * Alias para acceso directo
 * Peut être null si Supabase n'est pas configuré
 */
export const supabase = getSupabaseClient();

/**
 * Canales de realtime pre-configurados
 * Retourne null si supabase n'est pas configuré
 */
export const channels = {
  sessionState: () =>
    supabase?.channel(REALTIME_CHANNELS.SESSION_STATE) || null,
  participants: () => supabase?.channel(REALTIME_CHANNELS.PARTICIPANTS) || null,
  chat: () => supabase?.channel(REALTIME_CHANNELS.CHAT) || null,
};

/**
 * Helper para verificar conexión
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("health_check").select("*").limit(1);
    return !error;
  } catch {
    return false;
  }
}
