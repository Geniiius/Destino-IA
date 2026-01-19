import React from 'react';
import { Radio, Square, Sparkles, Image as ImageIcon, Users } from 'lucide-react';
import type { GalleryBroadcastState } from '../../../types/gallery';

interface GalleryBroadcastControlProps {
  broadcastState: GalleryBroadcastState | null;
  onStartBroadcast: (
    mode: 'all' | 'favorites' | 'single',
    exerciseId: string,
    submissionId?: string
  ) => void;
  onStopBroadcast: () => void;
  currentExerciseId?: string;
  submissionsCount?: number;
  favoritesCount?: number;
}

export const GalleryBroadcastControl: React.FC<
  GalleryBroadcastControlProps
> = ({
  broadcastState,
  onStartBroadcast,
  onStopBroadcast,
  currentExerciseId,
  submissionsCount = 0,
  favoritesCount = 0,
}) => {
  const isBroadcasting = broadcastState?.is_broadcasting || false;

  if (isBroadcasting) {
    return (
      <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 animate-pulse-slow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Difusión Activa
              </h3>
              <p className="text-red-300 text-sm">
                Modo:{' '}
                {broadcastState?.broadcast_mode === 'all'
                  ? 'Todas las imágenes'
                  : broadcastState?.broadcast_mode === 'favorites'
                  ? 'Solo favoritos'
                  : 'Imagen única'}
              </p>
            </div>
          </div>

          <button
            onClick={onStopBroadcast}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold flex items-center gap-2 transition-colors"
          >
            <Square className="w-5 h-5" />
            Detener Difusión
          </button>
        </div>

        <div className="mt-4 p-4 bg-black/30 rounded-lg">
          <p className="text-sm text-gray-300">
            Los participantes están viendo la galería en este momento. Puedes
            detener la difusión para que vuelvan al contenido normal.
          </p>
        </div>
      </div>
    );
  }

  if (!currentExerciseId) {
    return (
      <div className="bg-gray-800/30 border border-white/10 rounded-xl p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">
            Selecciona un ejercicio en la pestaña "Ejercicios" para difundir la
            galería
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Difundir Galería</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Todas las imágenes */}
        <button
          onClick={() => onStartBroadcast('all', currentExerciseId)}
          disabled={submissionsCount === 0}
          className="p-6 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border-2 border-transparent hover:border-emerald-500 transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-semibold text-white mb-2">Todas</h4>
            <p className="text-sm text-gray-400 mb-3">
              Muestra todas las imágenes enviadas
            </p>
            <div className="text-2xl font-bold text-emerald-400">
              {submissionsCount}
            </div>
            <p className="text-xs text-gray-500">imágenes</p>
          </div>
        </button>

        {/* Solo favoritos */}
        <button
          onClick={() => onStartBroadcast('favorites', currentExerciseId)}
          disabled={favoritesCount === 0}
          className="p-6 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border-2 border-transparent hover:border-amber-500 transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h4 className="font-semibold text-white mb-2">Favoritos</h4>
            <p className="text-sm text-gray-400 mb-3">
              Solo las mejores seleccionadas
            </p>
            <div className="text-2xl font-bold text-amber-400">
              {favoritesCount}
            </div>
            <p className="text-xs text-gray-500">favoritos</p>
          </div>
        </button>

        {/* Imagen única */}
        <div className="p-6 bg-white/5 rounded-xl border-2 border-white/10">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="font-semibold text-white mb-2">Imagen Única</h4>
            <p className="text-sm text-gray-400 mb-3">
              Haz clic en una imagen específica en la galería y luego en
              "Difundir Esta"
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-300 leading-relaxed">
          <strong>Consejo:</strong> Puedes marcar imágenes como favoritas haciendo
          clic en la estrella, luego difundir solo esas para destacar las mejores
          creaciones.
        </p>
      </div>
    </div>
  );
};
