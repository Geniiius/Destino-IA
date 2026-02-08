/**
 * @file components/SlidePresenter.tsx
 * @description Composant réutilisable d'affichage de slide PDF
 *
 * Fonctionnalités :
 * - Affichage du slide courant en plein écran
 * - Préchargement intelligent des slides suivants
 * - Transitions fluides entre slides
 * - Indicateur de chargement
 * - Mode compact (miniature) pour la playlist
 *
 * Utilisé par :
 * - AdminDashboard (vue présentateur)
 * - WorkshopView (vue participant)
 */

import React, { useEffect, useState, memo } from 'react';
import { useSlideManifest } from '@/hooks/useSlideManifest';
import { Loader2, ImageOff } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface SlidePresenterProps {
  /** Index du slide à afficher (1-based) */
  slideIndex: number;

  /** Nombre de slides à précharger en avance (défaut: 3) */
  preloadAhead?: number;

  /** Afficher les contrôles de navigation intégrés */
  showControls?: boolean;

  /** Mode miniature (pour la playlist) */
  compact?: boolean;

  /** Classe CSS additionnelle */
  className?: string;

  /** Callback quand le slide est chargé */
  onLoad?: () => void;

  /** Callback quand le slide échoue à charger */
  onError?: (error: string) => void;
}

// ============================================
// COMPOSANT
// ============================================

export const SlidePresenter: React.FC<SlidePresenterProps> = memo(
  ({
    slideIndex,
    preloadAhead = 3,
    compact = false,
    className = '',
    onLoad,
    onError,
  }) => {
    const { isReady, getSlideUrl, preload, error: manifestError } = useSlideManifest();
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string>('');

    // Mettre à jour l'URL du slide quand l'index change
    useEffect(() => {
      if (!isReady) return;

      const url = getSlideUrl(slideIndex);
      setCurrentSrc(url);
      setIsLoading(true);
      setHasError(false);

      // Précharger les slides suivants
      preload(slideIndex, preloadAhead);
    }, [slideIndex, isReady, getSlideUrl, preload, preloadAhead]);

    const handleImageLoad = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    const handleImageError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.(`Impossible de charger le slide ${slideIndex}`);
    };

    // ── État de chargement du manifest ──────────

    if (!isReady) {
      return (
        <div
          className={`flex items-center justify-center ${compact ? 'h-20' : 'h-full'} ${className}`}
        >
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      );
    }

    // ── Erreur du manifest ──────────────────────

    if (manifestError) {
      return (
        <div
          className={`flex flex-col items-center justify-center gap-2 ${compact ? 'h-20' : 'h-full'} ${className}`}
        >
          <ImageOff className="w-8 h-8 text-red-500/50" />
          <p className="text-red-400 text-sm">{manifestError}</p>
        </div>
      );
    }

    // ── Mode compact (miniature) ────────────────

    if (compact) {
      return (
        <div className={`relative overflow-hidden rounded-lg bg-black/40 ${className}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            </div>
          )}
          {hasError ? (
            <div className="flex items-center justify-center h-full">
              <ImageOff className="w-4 h-4 text-gray-600" />
            </div>
          ) : (
            <img
              src={currentSrc}
              alt={`Slide ${slideIndex}`}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
      );
    }

    // ── Mode normal (plein écran) ───────────────

    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        {/* Loader pendant le chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <span className="text-gray-400 text-sm">Chargement du slide {slideIndex}...</span>
            </div>
          </div>
        )}

        {/* Erreur */}
        {hasError && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3">
            <ImageOff className="w-16 h-16 text-red-500/30" />
            <p className="text-red-400">Impossible de charger le slide {slideIndex}</p>
          </div>
        )}

        {/* Image du slide */}
        {currentSrc && (
          <img
            src={currentSrc}
            alt={`Slide ${slideIndex}`}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10 transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
    );
  }
);

SlidePresenter.displayName = 'SlidePresenter';

// ============================================
// SOUS-COMPOSANT : Miniature pour la playlist
// ============================================

interface SlideThumbnailProps {
  slideIndex: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = memo(
  ({ slideIndex, isActive, onClick, className = '' }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-2 rounded-xl transition-all flex items-center gap-3 ${
          isActive
            ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
        } ${className}`}
      >
        {/* Numéro */}
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
            isActive ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          {slideIndex}
        </span>

        {/* Miniature */}
        <div className="w-16 h-9 flex-shrink-0">
          <SlidePresenter slideIndex={slideIndex} compact className="w-full h-full" />
        </div>

        {/* Label */}
        <span className="text-white text-sm font-medium truncate flex-1">
          Slide {slideIndex}
        </span>
      </button>
    );
  }
);

SlideThumbnail.displayName = 'SlideThumbnail';
