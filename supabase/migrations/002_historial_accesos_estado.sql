-- Esquema simplificado: url, estado, bloqueado, created_at
-- Ejecutar solo si tu tabla aun usa el esquema anterior

ALTER TABLE IF EXISTS public.historial_accesos
  ADD COLUMN IF NOT EXISTS estado TEXT,
  ADD COLUMN IF NOT EXISTS bloqueado BOOLEAN DEFAULT FALSE;

-- Opcional: migrar datos legacy si existen columnas risk / is_blocked
UPDATE public.historial_accesos
SET estado = CASE
  WHEN risk IN ('Seguro', 'Bajo') THEN 'Seguro'
  WHEN risk IN ('Medio', 'Alto', 'Critico') THEN 'Sospechoso'
  ELSE 'Pendiente'
END
WHERE estado IS NULL AND risk IS NOT NULL;

UPDATE public.historial_accesos
SET bloqueado = COALESCE(is_blocked, false)
WHERE bloqueado IS NULL AND is_blocked IS NOT NULL;
