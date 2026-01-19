import React, { useState } from 'react';
import { X, Star, Radio, Maximize2 } from 'lucide-react';
import type { ExerciseSubmission } from '../../types/gallery';

interface GalleryViewProps {
  mode: 'all' | 'favorites' | 'single';
  submissions: ExerciseSubmission[];
  currentParticipantId?: string;
  onClose?: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  mode,
  submissions,
  currentParticipantId,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<ExerciseSubmission | null>(
    null
  );

  // Filtrer selon le mode
  const displayedSubmissions =
    mode === 'favorites'
      ? submissions.filter((s) => s.is_favorite)
      : mode === 'single'
      ? submissions.slice(0, 1)
      : submissions;

  const isMySubmission = (submission: ExerciseSubmission) =>
    submission.participant_id === currentParticipantId;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Header avec indicateur EN VIVO */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
              <Radio className="w-4 h-4" />
              <span className="text-sm font-bold">EN VIVO</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'favorites'
                ? 'Mejores Creaciones'
                : mode === 'single'
                ? 'Creación Destacada'
                : 'Galería del Grupo'}
            </h2>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="h-full overflow-y-auto pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {displayedSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-xl text-gray-400">
                {mode === 'favorites'
                  ? 'Aún no hay favoritos seleccionados'
                  : 'No hay imágenes para mostrar'}
              </p>
            </div>
          ) : mode === 'single' ? (
            // Mode single : image en grand
            <div className="flex items-center justify-center min-h-[70vh]">
              <div className="max-w-4xl w-full">
                <div className="relative group">
                  <img
                    src={displayedSubmissions[0].image_url}
                    alt={`Creación de ${displayedSubmissions[0].participant_name}`}
                    className="w-full rounded-2xl shadow-2xl"
                  />
                  {isMySubmission(displayedSubmissions[0]) && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">¡Tu creación!</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-2xl font-bold text-white">
                    {displayedSubmissions[0].participant_name}
                  </p>
                  <p className="text-gray-400 mt-1">
                    {new Date(
                      displayedSubmissions[0].submitted_at
                    ).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Mode grid : toutes les images ou favoris
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`
                    relative group cursor-pointer transform transition-all duration-300 hover:scale-105
                    ${
                      isMySubmission(submission)
                        ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/50'
                        : ''
                    }
                  `}
                  onClick={() => setSelectedImage(submission)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800">
                    <img
                      src={submission.image_url}
                      alt={`Creación de ${submission.participant_name}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">
                              {submission.participant_name}
                            </p>
                            <p className="text-gray-300 text-xs">
                              {new Date(
                                submission.submitted_at
                              ).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Badge favorito */}
                    {submission.is_favorite && (
                      <div className="absolute top-3 right-3 bg-amber-500 p-2 rounded-full shadow-lg">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </div>
                    )}

                    {/* Badge "Tu creación" */}
                    {isMySubmission(submission) && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ¡Tuya!
                      </div>
                    )}
                  </div>

                  {/* Nom en dessous */}
                  <p className="mt-3 text-center text-white font-medium">
                    {submission.participant_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal zoom (pour mode grid) */}
      {selectedImage && mode !== 'single' && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <img
              src={selectedImage.image_url}
              alt={`Creación de ${selectedImage.participant_name}`}
              className="w-full rounded-2xl shadow-2xl"
            />

            <div className="mt-6 text-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold text-white">
                {selectedImage.participant_name}
              </p>
              <p className="text-gray-400 mt-1">
                {new Date(selectedImage.submitted_at).toLocaleString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {selectedImage.is_favorite && (
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Favorito del formador</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
