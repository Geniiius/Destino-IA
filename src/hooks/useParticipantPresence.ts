/**
 * @file hooks/useParticipantPresence.ts
 * @description Gère la présence du participant : heartbeat + déconnexion auto
 *
 * Fonctionnalités :
 * - Met à jour `last_seen_at` toutes les 30s (heartbeat)
 * - Marque le participant comme `disconnected` à la fermeture d'onglet
 * - Gère aussi `visibilitychange` pour les mises en arrière-plan longues
 *
 * Usage :
 *   useParticipantPresence(participantId);
 */

import { useEffect, useRef } from 'react';
import { updateParticipantStatus } from '@/services/participants';

/** Intervalle de heartbeat en ms (30 secondes) */
const HEARTBEAT_INTERVAL = 30_000;

export function useParticipantPresence(participantId: string | null): void {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Ne rien faire sans participantId valide
    if (!participantId || participantId === 'anonymous' || participantId === 'admin-preview') {
      return;
    }

    // ── Heartbeat : garder last_seen_at à jour ───
    const sendHeartbeat = () => {
      updateParticipantStatus(participantId, 'connected').catch(() => {
        // Silencieux — le réseau peut être instable
      });
    };

    // Premier battement immédiat (marque comme connecté)
    sendHeartbeat();

    // Puis toutes les 30s
    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // ── Déconnexion à la fermeture d'onglet ──────
    const handleBeforeUnload = () => {
      // sendBeacon pour garantir l'envoi même si l'onglet se ferme
      // Fallback sur updateParticipantStatus synchrone si pas de Supabase REST
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const url = `${supabaseUrl}/rest/v1/participants?id=eq.${participantId}`;
          const body = JSON.stringify({
            status: 'disconnected',
            last_seen_at: new Date().toISOString(),
          });

          // navigator.sendBeacon est fire-and-forget, parfait pour beforeunload
          navigator.sendBeacon(
            url,
            new Blob([body], { type: 'application/json' })
          );

          // Note: sendBeacon ne supporte pas les headers custom facilement.
          // On utilise aussi fetch keepalive comme backup.
          fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=minimal',
            },
            body,
            keepalive: true,
          }).catch(() => { /* fire and forget */ });
        }
      } catch {
        // Dernière tentative synchrone
        updateParticipantStatus(participantId, 'disconnected').catch(() => {});
      }
    };

    // ── Visibilité : pause/reprise du heartbeat ──
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Onglet caché depuis longtemps → arrêter le heartbeat
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Onglet redevient visible → relancer le heartbeat
        sendHeartbeat();
        if (!intervalRef.current) {
          intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Marquer comme déconnecté au démontage du composant
      updateParticipantStatus(participantId, 'disconnected').catch(() => {});
    };
  }, [participantId]);
}
