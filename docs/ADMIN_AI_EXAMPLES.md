# Gestión de Ejemplos de IA desde el Admin Dashboard

## 📋 Descripción

Sistema completo para que el administrador pueda gestionar ejemplos de IA (imágenes/videos + prompts) directamente desde el dashboard, con almacenamiento automático en Supabase.

## 🎯 Funcionalidades

### 1. **Subir archivos**

- Subir imágenes directamente a Supabase Storage
- Subir videos a Supabase Storage
- O usar URLs externas (YouTube, Vimeo, etc.)

### 2. **Editar contenido**

- Cambiar entre tipo imagen/video
- Editar la URL del archivo
- Modificar el prompt utilizado
- Agregar descripción opcional

### 3. **Guardar automáticamente**

- Todos los cambios se guardan en la base de datos
- Los participantes ven los cambios inmediatamente

## 🗄️ Estructura de base de datos

### Tabla: `exercise_ai_examples`

```sql
- id (UUID): Identificador único
- exercise_id (TEXT): ID del ejercicio ("01", "02", etc.)
- type (TEXT): Tipo de contenido ('image' | 'video')
- url (TEXT): URL del archivo o embed
- prompt (TEXT): Prompt utilizado para generar
- description (TEXT): Descripción opcional
- created_at: Fecha de creación
- updated_at: Fecha de última actualización
```

## 📦 Archivos creados/modificados

1. **Base de datos**: `supabase/migrations/002_ai_examples.sql`

   - Tabla para almacenar ejemplos
   - Políticas de seguridad (RLS)
   - Datos placeholder iniciales

2. **Componente Admin**: `src/features/admin/components/ExampleAIManager.tsx`

   - Interfaz para gestionar ejemplos
   - Subida de archivos
   - Edición de prompts

3. **Servicio**: `src/services/aiExamples.ts`
   - Funciones para cargar ejemplos desde Supabase
   - Subir archivos a Storage
   - Guardar cambios

## 🚀 Cómo usar

### Desde el Admin Dashboard:

1. **Acceder a la gestión de ejemplos**:

   ```tsx
   // En tu AdminDashboard, agregar un botón para gestionar ejemplos
   import { ExampleAIManager } from "./ExampleAIManager";

   // Usar el componente:
   <ExampleAIManager
     exerciseId="01"
     exerciseTitle="La Fórmula RCTF — Imagen Básica"
   />;
   ```

2. **Seleccionar tipo**: Imagen o Video

3. **Subir archivo**:

   - Opción A: Hacer clic en "Seleccionar archivo" y subir desde tu computadora
   - Opción B: Pegar una URL externa (YouTube, Vimeo, etc.)

4. **Agregar prompt**: Escribir el prompt que usaste para generar el contenido

5. **Guardar**: Los cambios se guardan en Supabase automáticamente

### Integración con ExerciseViewer:

El componente `ExerciseViewer` ya está configurado para mostrar los ejemplos. Para cargar desde Supabase en lugar de datos locales:

```tsx
import { getExercisesWithAIExamples } from "@/services/aiExamples";

// En tu componente que usa exercises:
const [exercises, setExercises] = useState([]);

useEffect(() => {
  async function loadExercises() {
    const exercisesWithExamples = await getExercisesWithAIExamples();
    setExercises(exercisesWithExamples);
  }
  loadExercises();
}, []);
```

## 📁 Configuración de Supabase Storage

### 1. Crear el bucket en Supabase:

Ve a tu proyecto en Supabase > Storage > Create Bucket:

- Nombre: `workshop-content`
- Public: `true` (para URLs públicas)

### 2. Configurar políticas de almacenamiento:

```sql
-- Permitir lectura pública
CREATE POLICY "Acceso público a archivos"
ON storage.objects FOR SELECT
USING (bucket_id = 'workshop-content');

-- Permitir subida solo a admins (ajustar según tu autenticación)
CREATE POLICY "Admins pueden subir archivos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workshop-content');
```

## 🎬 Recomendaciones para videos

### Opción 1: YouTube (Recomendado)

- Gratis e ilimitado
- Videos "No listados" (solo accesibles con el link)
- Excelente velocidad de carga
- URL de embed: `https://www.youtube.com/embed/VIDEO_ID`

**Ejemplo**:

```typescript
{
  type: 'video',
  url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  prompt: '...',
  description: '...'
}
```

### Opción 2: Supabase Storage

- Para videos cortos (< 50 MB)
- Usa el plan gratuito de Supabase
- Perfecto para demos cortas

### Opción 3: Cloudinary

- 25 GB gratis
- Optimización automática
- Buena para imágenes + videos

## 🔧 Integrar en AdminDashboard existente

Agrega una nueva pestaña o sección en tu `AdminDashboard.tsx`:

```tsx
import { ExampleAIManager } from "./ExampleAIManager";
import { useState } from "react";

function AdminDashboard() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  return (
    <div>
      {/* Tu dashboard existente */}

      {/* Nueva sección para gestionar ejemplos */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Gestionar Ejemplos de IA
        </h2>

        {/* Lista de ejercicios */}
        <div className="grid grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-white"
            >
              <div className="text-2xl mb-2">{exercise.emoji}</div>
              <div className="font-bold">Ejercicio {exercise.id}</div>
              <div className="text-sm text-slate-400">{exercise.title}</div>
            </button>
          ))}
        </div>

        {/* Modal para editar */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-8">
              <ExampleAIManager
                exerciseId={selectedExercise}
                exerciseTitle={
                  exercises.find((e) => e.id === selectedExercise)?.title || ""
                }
                onClose={() => setSelectedExercise(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## ✅ Checklist de implementación

- [ ] Ejecutar migración SQL en Supabase (`002_ai_examples.sql`)
- [ ] Crear bucket `workshop-content` en Supabase Storage
- [ ] Configurar políticas de seguridad en Storage
- [ ] Agregar `ExampleAIManager` al AdminDashboard
- [ ] Probar subida de imagen
- [ ] Probar subida de video
- [ ] Probar URL externa (YouTube)
- [ ] Verificar que los participantes ven los cambios

## 🎨 Ejemplo completo de flujo

1. **Admin sube imagen**:

   - Selecciona ejercicio 01
   - Hace clic en "Seleccionar archivo"
   - Sube imagen de paisaje (2 MB)
   - Escribe el prompt RCTF usado
   - Guarda

2. **Sistema procesa**:

   - Sube imagen a Supabase Storage
   - Genera URL pública: `https://xxx.supabase.co/storage/v1/object/public/workshop-content/ai-examples/01-1234567890.jpg`
   - Guarda en base de datos

3. **Participante ve**:
   - Abre ejercicio 01
   - Ve botón naranja "Ver ejemplo"
   - Hace clic
   - Ve la imagen + el prompt

## 🔐 Seguridad

Para producción, deberías agregar autenticación de admin:

```sql
-- Solo admins pueden modificar ejemplos
CREATE POLICY "Solo admins modifican ejemplos"
ON exercise_ai_examples FOR ALL
USING (
  auth.role() = 'authenticated'
  AND auth.jwt() ->> 'role' = 'admin'
);
```

## 📊 Monitoreo

Ver uso de almacenamiento en Supabase:

- Dashboard > Storage > workshop-content
- Ver espacio usado / disponible
- Eliminar archivos antiguos si es necesario

## 🆘 Troubleshooting

### Error: "Cannot upload file"

- Verifica que el bucket existe
- Verifica políticas de Storage
- Verifica tamaño del archivo (max 50 MB en plan gratuito)

### Error: "Cannot save to database"

- Verifica que la tabla existe
- Verifica las políticas RLS
- Revisa la consola de Supabase para errores

### Los participantes no ven los cambios

- Verifica que `getExercisesWithAIExamples()` se llama al cargar
- Verifica que el `exercise_id` coincide
- Revisa la consola del navegador para errores
