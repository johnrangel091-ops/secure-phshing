import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// CREDENCIALES SUPABASE — Pega aquí tus datos del panel de Supabase
// (Project Settings → API → Project URL y anon public key)
// =============================================================================

// ▼ Pega tu SUPABASE_URL aquí (ej: https://xxxxxxxx.supabase.co)
export const SUPABASE_URL = '';

// ▼ Pega tu SUPABASE_ANON_KEY aquí (clave "anon" / "public")
export const SUPABASE_ANON_KEY = '';

// =============================================================================

function getSupabaseCredentials() {
  const url = (
    SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  ).trim();

  const anonKey = (
    SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim();

  return { url, anonKey };
}

export function checkSupabaseConfigured() {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

/** true si hay URL y anon key (archivo o variables .env) */
export let isSupabaseConfigured = checkSupabaseConfigured();

let supabaseInstance = null;

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    console.warn(
      '[Supabase] Sin credenciales. Completa SUPABASE_URL y SUPABASE_ANON_KEY en supabaseClient.js o usa un archivo .env'
    );
    isSupabaseConfigured = false;
    supabaseInstance = createMockClient();
    return supabaseInstance;
  }

  isSupabaseConfigured = true;
  supabaseInstance = createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseInstance;
}

function createMockClient() {
  const emptyResult = { data: [], error: null };

  const selectChain = {
    order: () => Promise.resolve(emptyResult),
    eq: () => selectChain,
    neq: () => selectChain,
    single: () =>
      Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    maybeSingle: () =>
      Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
    then: (resolve) => resolve(emptyResult),
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback) => {
        if (typeof callback === 'function') {
          setTimeout(() => callback('SIGNED_OUT', null), 0);
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Supabase no configurado' },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: 'Supabase no configurado' },
      }),
      signInWithOAuth: async () => ({
        error: { message: 'Supabase no configurado' },
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => selectChain,
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
        }),
      }),
      update: (values) => ({
        eq: (_column, id) => ({
          select: () => ({
            maybeSingle: async () => ({
              data: {
                id,
                url: '',
                estado: 'Seguro',
                bloqueado: values?.bloqueado ?? false,
                created_at: new Date().toISOString(),
              },
              error: null,
            }),
          }),
        }),
      }),
      delete: () => ({
        neq: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
      }),
    }),
  };
}

// --- Historial (historial_accesos) ---

export function normalizeHistorialId(id) {
  const parsed = typeof id === 'string' ? parseInt(id, 10) : id;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function historialIdsMatch(a, b) {
  return normalizeHistorialId(a) === normalizeHistorialId(b);
}

const HISTORIAL_COLUMNS = 'id, url, estado, bloqueado, created_at';

/** Carga todo el historial ordenado por fecha descendente. */
export async function fetchHistorialAccesos() {
  if (!checkSupabaseConfigured()) {
    return { data: [], error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_accesos')
    .select(HISTORIAL_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error };
  }

  return {
    data: (data ?? []).map((row) => ({
      ...row,
      id: normalizeHistorialId(row.id),
      bloqueado: Boolean(row.bloqueado),
    })),
    error: null,
  };
}

/** Guarda un nuevo analisis en historial_accesos. */
export async function insertHistorialAcceso({ url, estado, bloqueado = false }) {
  if (!checkSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase no configurado' } };
  }

  const supabase = createClient();
  return supabase
    .from('historial_accesos')
    .insert({ url, estado, bloqueado })
    .select(HISTORIAL_COLUMNS)
    .single();
}

/** Actualiza bloqueado por ID. */
export async function setHistorialBloqueado(id, bloqueado) {
  const recordId = normalizeHistorialId(id);

  if (!recordId) {
    return { data: null, error: new Error('ID de historial invalido') };
  }

  if (!checkSupabaseConfigured()) {
    return { data: null, error: null };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_accesos')
    .update({ bloqueado })
    .eq('id', recordId)
    .select(HISTORIAL_COLUMNS)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return {
      data: null,
      error: new Error('No se pudo actualizar el registro (no existe o sin permisos RLS)'),
    };
  }

  return {
    data: {
      ...data,
      id: normalizeHistorialId(data.id),
      bloqueado: Boolean(data.bloqueado),
    },
    error: null,
  };
}

/** Desbloquea: bloqueado = false */
export async function unblockHistorialAcceso(id) {
  return setHistorialBloqueado(id, false);
}

/** Bloquea: bloqueado = true */
export async function blockHistorialAcceso(id) {
  return setHistorialBloqueado(id, true);
}
