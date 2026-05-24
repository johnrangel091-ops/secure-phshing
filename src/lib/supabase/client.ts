import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    throw new Error(
      'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y reinicia el servidor (pnpm dev).'
    )
  }

  return { url, anonKey }
}

export function createClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const { url, anonKey } = getSupabaseEnv()

  supabaseInstance = createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseInstance
}
