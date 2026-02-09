import { useState, useEffect, useCallback, useRef } from 'react';

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

// ─── Cache Singleton (module-level) ────────────────────────────
// Partagé entre TOUTES les instances du hook — un seul fetch réseau

/** Manifest déjà chargé */
let cachedManifest: SlideManifest | null = null;
/** Promise en cours pour dédupliquer les fetches concurrents */
let manifestPromise: Promise<SlideManifest> | null = null;
/** Erreur du dernier chargement */
let cachedError: string | null = null;
/** Index rapide slide.index → SlideInfo (O(1) lookup) */
let slideIndexMap: Map<number, SlideInfo> | null = null;

// Cache global pour éviter de re-créer les Image objects
const preloadedImages = new Set<string>();

// ─── Fonctions module-level ────────────────────────────────────

/** Effectue le fetch réseau du manifest et met en cache */
async function fetchAndCacheManifest(): Promise<SlideManifest> {
  const response = await fetch(MANIFEST_URL);

  if (!response.ok) {
    throw new Error(`Manifest introuvable (HTTP ${response.status})`);
  }

  const data: SlideManifest = await response.json();

  if (!data.slides || data.slides.length === 0) {
    throw new Error('Manifest vide : aucun slide trouvé');
  }

  // Stocker en cache singleton + construire l'index
  cachedManifest = data;
  cachedError = null;
  slideIndexMap = new Map(data.slides.map((s) => [s.index, s]));

  return data;
}

/**
 * Charge le manifest une seule fois. Les appels concurrents
 * réutilisent la même Promise (déduplication).
 */
function loadManifestOnce(): Promise<SlideManifest> {
  // Déjà en cache → retour immédiat
  if (cachedManifest) return Promise.resolve(cachedManifest);

  // Fetch déjà en cours → réutiliser la même Promise
  if (manifestPromise) return manifestPromise;

  manifestPromise = fetchAndCacheManifest()
    .catch((err) => {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      cachedError = message;
      throw err;
    })
    .finally(() => {
      // Libérer la promise en cas d'erreur pour permettre un retry
      if (!cachedManifest) {
        manifestPromise = null;
      }
    });

  return manifestPromise;
}

/** Lookup O(1) d'un slide par index */
function getSlideByIndex(index: number): SlideInfo | undefined {
  return slideIndexMap?.get(index);
}

/** Construit l'URL CDN d'un slide (1-based index) */
function buildSlideUrl(index: number): string {
  const slide = getSlideByIndex(index);
  if (slide) {
    return `${SLIDES_BASE_URL}/${slide.file}`;
  }
  // Fallback convention-based
  const padded = index.toString().padStart(3, '0');
  return `${SLIDES_BASE_URL}/slide-${padded}.webp`;
}

// ─── Hook ──────────────────────────────────────────────────────

export function useSlideManifest(): UseSlideManifestReturn {
  const [manifest, setManifest] = useState<SlideManifest | null>(cachedManifest);
  const [error, setError] = useState<string | null>(cachedError);
  const [isReady, setIsReady] = useState(cachedManifest !== null);

  const mountedRef = useRef(true);

  // Charger le manifest (une seule fois grâce au singleton)
  useEffect(() => {
    mountedRef.current = true;

    // Déjà en cache → sync immédiat, pas de fetch
    if (cachedManifest) {
      setManifest(cachedManifest);
      setIsReady(true);
      setError(null);
      return;
    }

    loadManifestOnce()
      .then((data) => {
        if (mountedRef.current) {
          setManifest(data);
          setIsReady(true);
          setError(null);
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          const message = err instanceof Error ? err.message : 'Erreur inconnue';
          setError(message);
          setIsReady(false);
        }
      });

    return () => {
      mountedRef.current = false;
    };
  }, []); // ← Pas de dépendances — le manifest ne change jamais en runtime

  // Obtenir l'URL CDN d'un slide (1-based index)
  const getSlideUrl = useCallback(
    (index: number): string => {
      return buildSlideUrl(index);
    },
    // Stable après le premier chargement
    [manifest]
  );

  // Précharger les N slides suivants
  const preload = useCallback(
    (currentIndex: number, ahead: number = DEFAULT_PRELOAD_AHEAD): void => {
      const m = cachedManifest;
      if (!m) return;

      const maxIndex = m.totalSlides;

      for (let i = 1; i <= ahead; i++) {
        const targetIndex = currentIndex + i;
        if (targetIndex > maxIndex) break;

        const url = buildSlideUrl(targetIndex);
        if (preloadedImages.has(url)) continue;

        const img = new Image();
        img.src = url;
        preloadedImages.add(url);
      }
    },
    [manifest]
  );

  // Précharger TOUS les slides (salle d'attente)
  const preloadAll = useCallback((): void => {
    const m = cachedManifest;
    if (!m) return;

    let loaded = 0;
    const total = m.totalSlides;

    for (const slide of m.slides) {
      const url = `${SLIDES_BASE_URL}/${slide.file}`;
      if (preloadedImages.has(url)) {
        loaded++;
        continue;
      }

      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === total) {
          console.log(`✅ ${total} slides préchargés en cache navigateur`);
        }
      };
      img.src = url;
      preloadedImages.add(url);
    }
  }, [manifest]);

  // Métadonnées dérivées (pas besoin de useMemo — ce sont des primitives)
  const totalSlides = manifest?.totalSlides ?? 0;
  const totalSize = manifest?.totalSize ?? 0;

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
