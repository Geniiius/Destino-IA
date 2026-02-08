import { useState, useEffect, useCallback, useMemo } from 'react';

// ─── Types ─────────────────────────────────────────────────────

interface SlideInfo {
  index: number;
  file: string;
  size: number;
  width: number;
  height: number;
}

interface SlideManifest {
  version: string;
  generatedAt: string;
  source: string;
  settings: {
    quality: number;
    maxWidth: number;
    dpi: number;
  };
  slides: SlideInfo[];
  totalSlides: number;
  totalSize: number;
}

interface UseSlideManifestReturn {
  /** true quand le manifest est chargé et prêt */
  isReady: boolean;
  /** Nombre total de slides */
  totalSlides: number;
  /** Taille totale en bytes */
  totalSize: number;
  /** Le manifest complet (null avant chargement) */
  manifest: SlideManifest | null;
  /** Erreur éventuelle au chargement */
  error: string | null;
  /** Retourne l'URL CDN du slide à l'index donné (1-based) */
  getSlideUrl: (index: number) => string;
  /** Précharge les N slides suivants (défaut: 3) */
  preload: (currentIndex: number, ahead?: number) => void;
  /** Précharge TOUS les slides (idéal pour la salle d'attente) */
  preloadAll: () => void;
}

// ─── Constantes ────────────────────────────────────────────────

const MANIFEST_URL = '/slides/slides-manifest.json';
const SLIDES_BASE_URL = '/slides';
const DEFAULT_PRELOAD_AHEAD = 3;

// Cache global pour éviter de re-créer les Image objects
const preloadedImages = new Set<string>();

// ─── Hook ──────────────────────────────────────────────────────

export function useSlideManifest(): UseSlideManifestReturn {
  const [manifest, setManifest] = useState<SlideManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Charger le manifest au montage
  useEffect(() => {
    let cancelled = false;

    async function loadManifest(): Promise<void> {
      try {
        const response = await fetch(MANIFEST_URL);

        if (!response.ok) {
          throw new Error(`Manifest introuvable (HTTP ${response.status})`);
        }

        const data: SlideManifest = await response.json();

        if (cancelled) return;

        if (!data.slides || data.slides.length === 0) {
          throw new Error('Manifest vide : aucun slide trouvé');
        }

        setManifest(data);
        setIsReady(true);
        setError(null);

        console.log(
          `📋 Slides manifest chargé: ${data.totalSlides} slides, ${formatSize(data.totalSize)}`
        );
      } catch (err) {
        if (cancelled) return;

        const message = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(message);
        setIsReady(false);
        console.warn(`⚠️ Impossible de charger le manifest:`, message);
      }
    }

    loadManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  // Obtenir l'URL CDN d'un slide (1-based index)
  const getSlideUrl = useCallback(
    (index: number): string => {
      if (!manifest) {
        // Fallback avant chargement du manifest
        const padded = index.toString().padStart(3, '0');
        return `${SLIDES_BASE_URL}/slide-${padded}.webp`;
      }

      const slide = manifest.slides.find((s) => s.index === index);
      if (!slide) {
        console.warn(`⚠️ Slide ${index} introuvable dans le manifest`);
        const padded = index.toString().padStart(3, '0');
        return `${SLIDES_BASE_URL}/slide-${padded}.webp`;
      }

      return `${SLIDES_BASE_URL}/${slide.file}`;
    },
    [manifest]
  );

  // Précharger les N+3 slides suivants
  const preload = useCallback(
    (currentIndex: number, ahead: number = DEFAULT_PRELOAD_AHEAD): void => {
      if (!manifest) return;

      const maxIndex = manifest.totalSlides;

      for (let i = 1; i <= ahead; i++) {
        const targetIndex = currentIndex + i;
        if (targetIndex > maxIndex) break;

        const url = getSlideUrl(targetIndex);
        if (preloadedImages.has(url)) continue;

        const img = new Image();
        img.src = url;
        preloadedImages.add(url);
      }
    },
    [manifest, getSlideUrl]
  );

  // Précharger TOUS les slides (salle d'attente)
  const preloadAll = useCallback((): void => {
    if (!manifest) return;

    let loaded = 0;
    const total = manifest.totalSlides;

    for (const slide of manifest.slides) {
      const url = `${SLIDES_BASE_URL}/${slide.file}`;
      if (preloadedImages.has(url)) {
        loaded++;
        continue;
      }

      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === total) {
          console.log(`✅ ${total} slides préchargés en cache`);
        }
      };
      img.src = url;
      preloadedImages.add(url);
    }
  }, [manifest]);

  // Métadonnées dérivées
  const totalSlides = useMemo(() => manifest?.totalSlides ?? 0, [manifest]);
  const totalSize = useMemo(() => manifest?.totalSize ?? 0, [manifest]);

  return {
    isReady,
    totalSlides,
    totalSize,
    manifest,
    error,
    getSlideUrl,
    preload,
    preloadAll,
  };
}

// ─── Utilitaire ────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}
