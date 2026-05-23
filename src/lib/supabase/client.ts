/**
 * Reexporta el cliente principal definido en supabaseClient.js
 * (credenciales, createClient e historial).
 */
export {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  createClient,
  isSupabaseConfigured,
  checkSupabaseConfigured,
  normalizeHistorialId,
  historialIdsMatch,
  fetchHistorialAccesos,
  insertHistorialAcceso,
  setHistorialBloqueado,
  unblockHistorialAcceso,
  blockHistorialAcceso,
} from './supabaseClient.js';
