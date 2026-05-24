-- Esquema alineado con la app (url, estado, bloqueado, correo, usuario_id)
-- Ejecuta este script en Supabase → SQL Editor (borra datos previos de historial_accesos)

DROP POLICY IF EXISTS "Users can view their own history" ON public.historial_accesos;
DROP POLICY IF EXISTS "Users can insert their own history" ON public.historial_accesos;
DROP POLICY IF EXISTS "Users can update their own history" ON public.historial_accesos;
DROP POLICY IF EXISTS "Users can delete their own history" ON public.historial_accesos;
DROP POLICY IF EXISTS "historial_select_own" ON public.historial_accesos;
DROP POLICY IF EXISTS "historial_insert_own" ON public.historial_accesos;
DROP POLICY IF EXISTS "historial_update_own" ON public.historial_accesos;
DROP POLICY IF EXISTS "historial_delete_own" ON public.historial_accesos;

DROP TABLE IF EXISTS public.historial_accesos;

CREATE TABLE public.historial_accesos (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente'
    CHECK (estado IN ('Pendiente', 'Seguro', 'Sospechoso')),
  bloqueado BOOLEAN NOT NULL DEFAULT FALSE,
  correo_electronico TEXT NOT NULL,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historial_usuario ON public.historial_accesos(usuario_id);
CREATE INDEX idx_historial_correo ON public.historial_accesos(correo_electronico);
CREATE INDEX idx_historial_created ON public.historial_accesos(created_at DESC);

ALTER TABLE public.historial_accesos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "historial_select_own"
  ON public.historial_accesos
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "historial_insert_own"
  ON public.historial_accesos
  FOR INSERT
  WITH CHECK (
    auth.uid() = usuario_id
    AND correo_electronico = (auth.jwt() ->> 'email')
  );

CREATE POLICY "historial_update_own"
  ON public.historial_accesos
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "historial_delete_own"
  ON public.historial_accesos
  FOR DELETE
  USING (auth.uid() = usuario_id);
