import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Star,
  Clock,
  Users,
  ChevronRight,
  X,
  Maximize2,
  Sparkles,
  Radio,
} from 'lucide-react';
import type { ExerciseSubmission, ExerciseStats } from '../../../types/gallery';
import { useGallery } from '../../../hooks/useGallery';

interface ExerciseGalleryTabProps {
  sessionId: string;
  exercises: Array<{ id: string; title: string }>;
  onStartBroadcast: (
    mode: 'all' | 'favorites' | 'single',
    exerciseId: string,
    submissionId?: string
  ) => void;
}

export const ExerciseGalleryTab: React.FC<ExerciseGalleryTabProps> = ({
  sessionId,
  exercises,
  onStartBroadcast,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ExerciseSubmission | null>(
    null
  );

  return (
    <div className="h-full flex">
      {/* Liste des exercices (sidebar) */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-black/20">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            Ejercicios
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Selecciona un ejercicio para ver las imágenes
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {exercises.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              sessionId={sessionId}
              isSelected={selectedExercise === exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
            />
          ))}
        </div>
      </div>

      {/* Galerie de l'exercice sélectionné */}
      <div className="flex-1 flex flex-col">
        {selectedExercise ? (
          <ExerciseGalleryDetail
            sessionId={sessionId}
            exerciseId={selectedExercise}
            exerciseTitle={
              exercises.find((e) => e.id === selectedExercise)?.title ||
              'Ejercicio'
            }
            onStartBroadcast={onStartBroadcast}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Selecciona un ejercicio
              </h3>
              <p className="text-gray-400">
                Elige un ejercicio de la lista para ver las imágenes enviadas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour chaque item d'exercice dans la liste
const ExerciseListItem: React.FC<{
  exercise: { id: string; title: string };
  sessionId: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ exercise, sessionId, isSelected, onClick }) => {
  const { stats, submissions } = useGallery({
    sessionId,
    exerciseId: exercise.id,
  });

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl transition-all
        ${
          isSelected
            ? 'bg-emerald-500/20 border-2 border-emerald-500'
            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white text-sm">{exercise.title}</h4>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${
            isSelected ? 'text-emerald-500 rotate-90' : 'text-gray-500'
          }`}
        />
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-gray-400">
          <Users className="w-3 h-3" />
          <span>{stats?.total_submissions || 0}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="w-3 h-3 fill-current" />
          <span>{stats?.total_favorites || 0}</span>
        </div>
      </div>
    </button>
  );
};

// Détail de la galerie d'un exercice
const ExerciseGalleryDetail: React.FC<{
  sessionId: string;
  exerciseId: string;
  exerciseTitle: string;
  onStartBroadcast: (
    mode: 'all' | 'favorites' | 'single',
    exerciseId: string,
    submissionId?: string
  ) => void;
  selectedImage: ExerciseSubmission | null;
  onSelectImage: (submission: ExerciseSubmission | null) => void;
}> = ({
  sessionId,
  exerciseId,
  exerciseTitle,
  onStartBroadcast,
  selectedImage,
  onSelectImage,
}) => {
  const { submissions, stats, toggleFavorite, loading } = useGallery({
    sessionId,
    exerciseId,
  });

  const handleToggleFavorite = async (submissionId: string, isFavorite: boolean) => {
    await toggleFavorite(submissionId, !isFavorite);
  };

  const favoriteSubmissions = submissions.filter((s) => s.is_favorite);

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{exerciseTitle}</h2>
            <div className="flex items-center gap-6 mt-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{stats?.total_submissions || 0} imágenes</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span>{stats?.total_favorites || 0} favoritos</span>
              </div>
              {stats?.last_submission_at && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    Última:{' '}
                    {new Date(stats.last_submission_at).toLocaleTimeString(
                      'es-ES',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Boutons de diffusion */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartBroadcast('all', exerciseId)}
              disabled={submissions.length === 0}
              className="btn-elegant-secondary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Radio className="w-4 h-4" />
              Difundir Todas
            </button>
            <button
              onClick={() => onStartBroadcast('favorites', exerciseId)}
              disabled={favoriteSubmissions.length === 0}
              className="btn-elegant-primary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Difundir Favoritos
            </button>
          </div>
        </div>
      </div>

      {/* Grille d'images */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando imágenes...</p>
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">
                Aún no hay imágenes enviadas para este ejercicio
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="relative group cursor-pointer"
                onClick={() => onSelectImage(submission)}
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={submission.image_url}
                    alt={`Creación de ${submission.participant_name}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-medium text-sm">
                        {submission.participant_name}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {new Date(submission.submitted_at).toLocaleTimeString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Bouton favoris */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(submission.id, submission.is_favorite);
                  }}
                  className={`absolute top-2 left-2 p-2 rounded-lg transition-all z-10 ${
                    submission.is_favorite
                      ? 'bg-amber-500 shadow-lg shadow-amber-500/50'
                      : 'bg-black/50 hover:bg-black/70'
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      submission.is_favorite
                        ? 'text-white fill-current'
                        : 'text-white'
                    }`}
                  />
                </button>

                {/* Badge nouveau (si < 5min) */}
                {new Date().getTime() -
                  new Date(submission.submitted_at).getTime() <
                  5 * 60 * 1000 && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Nuevo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal zoom */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
          onClick={() => onSelectImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onSelectImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <img
              src={selectedImage.image_url}
              alt={`Creación de ${selectedImage.participant_name}`}
              className="w-full rounded-2xl shadow-2xl"
            />

            <div className="mt-6 flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
              <div>
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
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleToggleFavorite(
                      selectedImage.id,
                      selectedImage.is_favorite
                    )
                  }
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    selectedImage.is_favorite
                      ? 'bg-amber-500 hover:bg-amber-400 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      selectedImage.is_favorite ? 'fill-current' : ''
                    }`}
                  />
                  {selectedImage.is_favorite ? 'Quitar favorito' : 'Favorito'}
                </button>

                <button
                  onClick={() =>
                    onStartBroadcast('single', exerciseId, selectedImage.id)
                  }
                  className="btn-elegant-primary px-4 py-2 flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  Difundir Esta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
