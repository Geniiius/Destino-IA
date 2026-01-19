# Funcionalidad "Ver ejemplo"

## Descripción

Se ha implementado una nueva funcionalidad que permite a los participantes visualizar ejemplos generados con IA durante los ejercicios. Al hacer clic en el botón naranja "Ver ejemplo", se abre un modal que muestra:

- Una imagen o video generado con IA
- El prompt exacto que se utilizó para generarlo
- Una descripción opcional del ejemplo

## Componentes modificados

### 1. Tipo de datos: `Exercise` interface

**Archivo**: `src/data/exercises.ts`

Se agregó el campo opcional `aiExample` a la interfaz `Exercise`:

```typescript
aiExample?: {
  type: 'image' | 'video';  // Tipo de contenido
  url: string;               // URL de la imagen o video
  prompt: string;            // Prompt utilizado para generar el contenido
  description?: string;      // Descripción opcional del ejemplo
};
```

### 2. Componente: `ExerciseViewer`

**Archivo**: `src/features/workshop/components/ExerciseViewer.tsx`

#### Cambios realizados:

1. **Imports añadidos**:

   - `X` y `Play` de `lucide-react` para iconos del modal

2. **Estado nuevo**:

   - `showExample`: Controla la visibilidad del modal

3. **Botón "Ver ejemplo"**:

   - Aparece después del header del ejercicio
   - Color naranja (`bg-orange-500`)
   - Solo se muestra si el ejercicio tiene `aiExample` definido

4. **Modal de ejemplo**:
   - Fondo oscuro con blur
   - Muestra imagen o video según el tipo
   - Muestra el prompt utilizado con opción de copiar
   - Botón de cerrar en la esquina superior derecha

## Cómo agregar ejemplos a los ejercicios

Para agregar un ejemplo de IA a un ejercicio, añade el campo `aiExample` en el objeto del ejercicio:

```typescript
{
  id: "01",
  title: "La Fórmula RCTF — Imagen Básica",
  // ... otros campos del ejercicio ...
  aiExample: {
    type: 'image',
    url: 'https://ejemplo.com/imagen.jpg',
    prompt: `Rol: Fotógrafo profesional...

Contexto: Escena al atardecer...

Tarea: Capturar una imagen...

Formato: Vertical 9:16, alta resolución...`,
    description: 'Este es un ejemplo de imagen generada con IA usando RCTF.'
  }
}
```

### Para videos:

```typescript
aiExample: {
  type: 'video',
  url: 'https://ejemplo.com/video.mp4',
  prompt: 'Prompt utilizado para el video...',
  description: 'Descripción opcional del video'
}
```

## Integración con base de datos

Cuando se conecte el proyecto a la base de datos:

1. Las URLs de `aiExample.url` deben apuntar a los archivos almacenados en el storage
2. Cada ejercicio debe tener su ejemplo específico relacionado
3. Se puede usar Supabase Storage para almacenar las imágenes/videos
4. El campo `prompt` debe contener el prompt exacto que se utilizó

### Estructura sugerida en Supabase:

```sql
-- Agregar columnas a la tabla exercises
ALTER TABLE exercises ADD COLUMN ai_example_type TEXT;
ALTER TABLE exercises ADD COLUMN ai_example_url TEXT;
ALTER TABLE exercises ADD COLUMN ai_example_prompt TEXT;
ALTER TABLE exercises ADD COLUMN ai_example_description TEXT;
```

### Ejemplo de consulta:

```typescript
const { data: exercise } = await supabase
  .from("exercises")
  .select("*")
  .eq("id", exerciseId)
  .single();

// Mapear a la estructura de Exercise
const mappedExercise: Exercise = {
  ...exercise,
  aiExample: exercise.ai_example_url
    ? {
        type: exercise.ai_example_type as "image" | "video",
        url: exercise.ai_example_url,
        prompt: exercise.ai_example_prompt,
        description: exercise.ai_example_description,
      }
    : undefined,
};
```

## Características del modal

- ✅ Responsive: Se adapta a diferentes tamaños de pantalla
- ✅ Scroll: Si el contenido es largo, tiene scroll interno
- ✅ Cierre: Se puede cerrar haciendo clic fuera del modal o en el botón X
- ✅ Copia: Botón para copiar el prompt al portapapeles
- ✅ Video player: Controles nativos para reproducir videos
- ✅ Animaciones: Transiciones suaves al abrir/cerrar

## Ejemplo en producción

El primer ejercicio ("La Fórmula RCTF — Imagen Básica") ya tiene un ejemplo configurado para demostración. Al iniciar ese ejercicio, verás el botón "Ver ejemplo" que muestra una imagen de paisaje con su prompt correspondiente.

## Notas técnicas

- El botón solo aparece si `exercise.aiExample` está definido
- El modal usa `z-50` para aparecer por encima de otros elementos
- Las imágenes se muestran con `w-full h-auto` para mantener proporciones
- Los videos usan el elemento nativo `<video>` con controles
- El prompt se muestra en un bloque `<pre>` con formato de código
