-- Migration para agregar soporte de ejemplos de IA en los ejercicios

-- Tabla para almacenar ejemplos de IA de cada ejercicio
CREATE TABLE IF NOT EXISTS public.exercise_ai_examples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por exercise_id
CREATE INDEX IF NOT EXISTS idx_exercise_ai_examples_exercise_id 
  ON public.exercise_ai_examples(exercise_id);

-- Activer Row Level Security (RLS)
ALTER TABLE public.exercise_ai_examples ENABLE ROW LEVEL SECURITY;

-- Política para permitir a todo el mundo leer los ejemplos
CREATE POLICY "Todos pueden leer ejemplos de IA"
  ON public.exercise_ai_examples
  FOR SELECT
  USING (true);

-- Política para permitir a los admins modificar ejemplos
-- En producción, deberías añadir autenticación de admin
CREATE POLICY "Admins pueden modificar ejemplos de IA"
  ON public.exercise_ai_examples
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Función para actualizar el timestamp de updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_exercise_ai_examples_updated_at
  BEFORE UPDATE ON public.exercise_ai_examples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE public.exercise_ai_examples IS 'Almacena ejemplos de IA (imágenes/videos + prompts) para cada ejercicio';
COMMENT ON COLUMN public.exercise_ai_examples.exercise_id IS 'ID del ejercicio (ej: "01", "02", etc.)';
COMMENT ON COLUMN public.exercise_ai_examples.type IS 'Tipo de contenido: image o video';
COMMENT ON COLUMN public.exercise_ai_examples.url IS 'URL del archivo en Supabase Storage o servicio externo';
COMMENT ON COLUMN public.exercise_ai_examples.prompt IS 'Prompt utilizado para generar el contenido';
COMMENT ON COLUMN public.exercise_ai_examples.description IS 'Descripción opcional del ejemplo';

-- Insertar datos placeholder para los 11 ejercicios
INSERT INTO public.exercise_ai_examples (exercise_id, type, url, prompt, description)
VALUES 
  ('01', 'image', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Ejemplo+Ejercicio+01', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('02', 'image', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Ejemplo+Ejercicio+02', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('03', 'video', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Video+Ejercicio+03', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('04', 'video', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Video+Ejercicio+04', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('05', 'image', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Ejemplo+Ejercicio+05', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('07', 'image', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Ejemplo+Ejercicio+07', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('08', 'video', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Video+Ejercicio+08', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('09', 'image', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Ejemplo+Ejercicio+09', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('10', 'video', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Video+Ejercicio+10', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real'),
  ('11', 'video', 'https://via.placeholder.com/1080x1920/1e293b/ffffff?text=Video+Ejercicio+11', 'Prompt pendiente de configurar...', 'Pendiente: Subir imagen/video y agregar prompt real')
ON CONFLICT (exercise_id) DO NOTHING;
