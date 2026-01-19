import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, Loader, X } from 'lucide-react';

interface ImageSubmissionProps {
  onSubmit: (file: File) => Promise<void>;
  currentSubmission: { image_url: string } | null;
  uploadProgress?: number;
  disabled?: boolean;
}

export const ImageSubmission: React.FC<ImageSubmissionProps> = ({
  onSubmit,
  currentSubmission,
  uploadProgress = 0,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentSubmission?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      return 'Formato no válido. Solo PNG, JPG o WEBP.';
    }

    if (file.size > maxSize) {
      return 'Archivo demasiado grande. Máximo 5 MB.';
    }

    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled || isUploading) return;

      setError(null);
      setSuccess(false);

      // Validar archivo
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      try {
        setIsUploading(true);
        await onSubmit(file);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al subir la imagen'
        );
        setPreviewUrl(currentSubmission?.image_url || null);
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, isUploading, onSubmit, currentSubmission]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]'
              : previewUrl
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-gray-600 bg-gray-800/30 hover:border-emerald-500/50 hover:bg-gray-800/50'
          }
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {previewUrl ? (
          // Preview de l'image
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <p className="text-white text-sm font-medium">
                  {currentSubmission ? 'Reemplazar imagen' : 'Cambiar imagen'}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {success && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">¡Imagen enviada!</span>
              </div>
            )}
          </div>
        ) : (
          // Drop zone vide
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              {isUploading ? (
                <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-emerald-500" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {isUploading
                ? 'Subiendo imagen...'
                : 'Arrastra tu imagen aquí'}
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              o haz clic para seleccionar un archivo
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ImageIcon className="w-4 h-4" />
              <span>PNG, JPG o WEBP • Máximo 5 MB</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message (si pas de preview) */}
      {success && !previewUrl && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-400">
            ¡Imagen enviada correctamente!
          </p>
        </div>
      )}

      {/* Instructions */}
      {!previewUrl && !isUploading && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-300 leading-relaxed">
            <strong>Instrucciones:</strong> Crea tu imagen usando una herramienta
            de IA (como Ideogram o Midjourney), luego arrástrala aquí para
            compartirla con el grupo.
          </p>
        </div>
      )}
    </div>
  );
};
