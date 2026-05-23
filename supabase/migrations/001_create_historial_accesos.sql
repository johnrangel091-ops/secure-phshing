-- =====================================================
-- SQL para crear la tabla historial_accesos en Supabase
-- Ejecuta este script en el SQL Editor de Supabase
-- =====================================================

-- Crear tabla historial_accesos
CREATE TABLE IF NOT EXISTS public.historial_accesos (
  id BIGSERIAL PRIMARY KEY,
  identificacion TEXT,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  correo_electronico TEXT NOT NULL,
  fecha_ingreso TIMESTAMPTZ DEFAULT NOW(),
  url TEXT NOT NULL,
  risk TEXT NOT NULL,
  score INTEGER NOT NULL,
  color TEXT NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.historial_accesos ENABLE ROW LEVEL SECURITY;

-- Politica para que usuarios vean su propio historial
CREATE POLICY "Users can view their own history" 
  ON public.historial_accesos 
  FOR SELECT 
  USING (correo_electronico = auth.jwt() ->> 'email');

-- Politica para que usuarios inserten su propio historial
CREATE POLICY "Users can insert their own history" 
  ON public.historial_accesos 
  FOR INSERT 
  WITH CHECK (correo_electronico = auth.jwt() ->> 'email');

-- Politica para que usuarios actualicen su propio historial
CREATE POLICY "Users can update their own history" 
  ON public.historial_accesos 
  FOR UPDATE 
  USING (correo_electronico = auth.jwt() ->> 'email');

-- Politica para que usuarios eliminen su propio historial
CREATE POLICY "Users can delete their own history" 
  ON public.historial_accesos 
  FOR DELETE 
  USING (correo_electronico = auth.jwt() ->> 'email');

-- Indices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_historial_correo ON public.historial_accesos(correo_electronico);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON public.historial_accesos(fecha_ingreso DESC);
CREATE INDEX IF NOT EXISTS idx_historial_blocked ON public.historial_accesos(is_blocked);
