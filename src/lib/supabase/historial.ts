import { createClient, isSupabaseConfigured } from './client';

export type HistorialRecord = {
  id: number;
  url: string;
  estado: string;
  bloqueado: boolean;
  created_at: string;
};

/** Normaliza IDs de Supabase (bigint puede llegar como string). */
export function normalizeHistorialId(id: number | string): number {
  const parsed = typeof id === 'string' ? parseInt(id, 10) : id;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function historialIdsMatch(
  a: number | string,
  b: number | string
): boolean {
  return normalizeHistorialId(a) === normalizeHistorialId(b);
}

/**
 * Actualiza la columna `bloqueado` en historial_accesos.
 * Devuelve la fila actualizada cuando Supabase confirma el cambio.
 */
export async function setHistorialBloqueado(
  id: number | string,
  bloqueado: boolean
): Promise<{ data: HistorialRecord | null; error: Error | null }> {
  const recordId = normalizeHistorialId(id);

  if (!recordId) {
    return { data: null, error: new Error('ID de historial invalido') };
  }

  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('historial_accesos')
      .update({ bloqueado })
      .eq('id', recordId)
      .select('id, url, estado, bloqueado, created_at')
      .maybeSingle();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return {
        data: null,
        error: new Error(
          'No se pudo actualizar el registro (no existe o sin permisos RLS)'
        ),
      };
    }

    return {
      data: {
        ...data,
        id: normalizeHistorialId(data.id),
        bloqueado: Boolean(data.bloqueado),
      } as HistorialRecord,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/** Desbloquea un acceso: bloqueado = false en Supabase. */
export async function unblockHistorialAcceso(id: number | string) {
  return setHistorialBloqueado(id, false);
}
