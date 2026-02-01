/**
 * @file hooks/useCopyToClipboard.ts
 * @description Hook réutilisable pour copier du texte dans le clipboard
 *
 * Gère automatiquement:
 * - État "copied" avec feedback visuel
 * - Fallback pour navigateurs anciens
 * - Timeout automatique (2s par défaut)
 * - Cleanup au unmount
 */

import { useState, useCallback, useRef, useEffect } from "react";

interface UseCopyToClipboardOptions {
  /**
   * Durée d'affichage du feedback "copied" en millisecondes
   * @default 2000
   */
  timeout?: number;
}

interface UseCopyToClipboardReturn {
  /**
   * Indique si le texte vient d'être copié
   */
  copied: boolean;

  /**
   * Fonction pour copier du texte dans le clipboard
   * @param text - Texte à copier
   * @returns Promise<boolean> - true si succès, false sinon
   */
  copy: (text: string) => Promise<boolean>;
}

/**
 * Hook pour gérer la copie de texte dans le clipboard
 *
 * @example
 * ```tsx
 * const { copied, copy } = useCopyToClipboard();
 *
 * <button onClick={() => copy(myText)}>
 *   {copied ? '✓ Copié' : '📋 Copier'}
 * </button>
 * ```
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { timeout = 2000 } = options;

  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout au unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      try {
        // Try modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          setCopied(true);

          // Reset copied state after timeout
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
          }, timeout);

          return true;
        }

        // Fallback pour navigateurs anciens
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (success) {
          setCopied(true);

          // Reset copied state after timeout
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
          }, timeout);
        }

        return success;
      } catch (error) {
        console.error("Failed to copy text:", error);
        return false;
      }
    },
    [timeout],
  );

  return { copied, copy };
}
