/**
 * @file features/admin/components/ExampleAIManager.tsx
 * @description Gestión de ejemplos de IA (imágenes/videos + prompts) para cada ejercicio
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/services/supabase";
import { Upload, Save, Image, Video, Loader2, Check, X } from "lucide-react";

interface AIExample {
  id: string;
  exercise_id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  description?: string;
}

interface ExampleAIManagerProps {
  exerciseId: string;
  exerciseTitle: string;
  onClose?: () => void;
}

export const ExampleAIManager: React.FC<ExampleAIManagerProps> = ({
  exerciseId,
  exerciseTitle,
  onClose,
}) => {
  const [example, setExample] = useState<AIExample | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Cargar el ejemplo actual
  useEffect(() => {
    loadExample();
  }, [exerciseId]);

  const loadExample = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("exercise_ai_examples")
        .select("*")
        .eq("exercise_id", exerciseId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setExample(data);
      } else {
        // Crear uno nuevo si no existe
        setExample({
          id: "",
          exercise_id: exerciseId,
          type: "image",
          url: "",
          prompt: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error al cargar ejemplo:", error);
      showMessage("error", "Error al cargar el ejemplo");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      showMessage("success", "Subiendo archivo...");

      // Determinar el tipo según la extensión
      const fileType = file.type.startsWith("video/") ? "video" : "image";
      const fileExt = file.name.split(".").pop();
      const fileName = `${exerciseId}-${Date.now()}.${fileExt}`;
      const filePath = `ai-examples/${fileName}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("workshop-content")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obtener la URL pública
      const { data: urlData } = supabase.storage
        .from("workshop-content")
        .getPublicUrl(filePath);

      if (example) {
        setExample({
          ...example,
          type: fileType,
          url: urlData.publicUrl,
        });
      }

      showMessage("success", "¡Archivo subido correctamente!");
    } catch (error) {
      console.error("Error al subir archivo:", error);
      showMessage("error", "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!example || !example.url || !example.prompt) {
      showMessage("error", "Por favor completa la URL y el prompt");
      return;
    }

    try {
      setSaving(true);

      if (example.id) {
        // Actualizar existente
        const { error } = await supabase
          .from("exercise_ai_examples")
          .update({
            type: example.type,
            url: example.url,
            prompt: example.prompt,
            description: example.description,
          })
          .eq("id", example.id);

        if (error) throw error;
      } else {
        // Crear nuevo
        const { data, error } = await supabase
          .from("exercise_ai_examples")
          .insert({
            exercise_id: example.exercise_id,
            type: example.type,
            url: example.url,
            prompt: example.prompt,
            description: example.description,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setExample(data);
      }

      showMessage("success", "¡Ejemplo guardado correctamente!");

      // Recargar los datos después de 1 segundo
      setTimeout(() => {
        loadExample();
      }, 1000);
    } catch (error) {
      console.error("Error al guardar:", error);
      showMessage("error", "Error al guardar el ejemplo");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🎨</span>
            Gestionar Ejemplo de IA
          </h3>
          <p className="text-slate-400 mt-1">
            Ejercicio {exerciseId}: {exerciseTitle}
          </p>
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      {/* Mensaje de estado */}
      {message && (
        <Card
          className={`p-4 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check className="text-emerald-400" size={20} />
            ) : (
              <X className="text-red-400" size={20} />
            )}
            <span
              className={
                message.type === "success" ? "text-emerald-400" : "text-red-400"
              }
            >
              {message.text}
            </span>
          </div>
        </Card>
      )}

      {/* Tipo de contenido */}
      <Card className="bg-slate-800/40 border-slate-700/50 p-6">
        <label className="block text-white font-bold mb-3">
          Tipo de contenido
        </label>
        <div className="flex gap-4">
          <Button
            onClick={() => example && setExample({ ...example, type: "image" })}
            className={`flex items-center gap-2 ${
              example?.type === "image"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <Image size={20} />
            Imagen
          </Button>
          <Button
            onClick={() => example && setExample({ ...example, type: "video" })}
            className={`flex items-center gap-2 ${
              example?.type === "video"
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <Video size={20} />
            Video
          </Button>
        </div>
      </Card>

      {/* Subir archivo */}
      <Card className="bg-slate-800/40 border-slate-700/50 p-6">
        <label className="block text-white font-bold mb-3">
          Subir {example?.type === "image" ? "imagen" : "video"}
        </label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg cursor-pointer transition-all">
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Seleccionar archivo
                  </>
                )}
              </div>
              <input
                type="file"
                accept={example?.type === "image" ? "image/*" : "video/*"}
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-slate-400 text-sm">
            O ingresa una URL externa (YouTube, Vimeo, etc.)
          </p>
        </div>
      </Card>

      {/* URL */}
      <Card className="bg-slate-800/40 border-slate-700/50 p-6">
        <label className="block text-white font-bold mb-3">
          URL del archivo
        </label>
        <Input
          type="text"
          value={example?.url || ""}
          onChange={(e) =>
            example && setExample({ ...example, url: e.target.value })
          }
          placeholder="https://ejemplo.com/imagen.jpg o https://youtube.com/..."
          className="w-full bg-slate-900 border-slate-700 text-white"
        />
        {example?.url && (
          <div className="mt-4">
            {example.type === "image" ? (
              <img
                src={example.url}
                alt="Preview"
                className="w-full max-w-md rounded-lg border border-slate-700"
              />
            ) : (
              <video
                src={example.url}
                controls
                className="w-full max-w-md rounded-lg border border-slate-700"
              />
            )}
          </div>
        )}
      </Card>

      {/* Prompt */}
      <Card className="bg-slate-800/40 border-slate-700/50 p-6">
        <label className="block text-white font-bold mb-3">
          Prompt utilizado para generar el contenido
        </label>
        <textarea
          value={example?.prompt || ""}
          onChange={(e) =>
            example && setExample({ ...example, prompt: e.target.value })
          }
          placeholder="Escribe aquí el prompt que usaste para generar esta imagen o video..."
          className="w-full h-48 bg-slate-900 border border-slate-700 text-white rounded-lg p-4 font-mono text-sm resize-none"
        />
      </Card>

      {/* Descripción opcional */}
      <Card className="bg-slate-800/40 border-slate-700/50 p-6">
        <label className="block text-white font-bold mb-3">
          Descripción (opcional)
        </label>
        <textarea
          value={example?.description || ""}
          onChange={(e) =>
            example && setExample({ ...example, description: e.target.value })
          }
          placeholder="Descripción adicional del ejemplo..."
          className="w-full h-24 bg-slate-900 border border-slate-700 text-white rounded-lg p-4 resize-none"
        />
      </Card>

      {/* Botón guardar */}
      <div className="flex justify-end gap-4">
        {onClose && (
          <Button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white"
          >
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={saving || !example?.url || !example?.prompt}
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
