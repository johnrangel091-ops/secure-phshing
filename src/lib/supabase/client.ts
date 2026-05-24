import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function readSupabaseEnv(): { url: string; anonKey: string } {
  const url = (
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  ).trim()
  const anonKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim()

  return { url, anonKey }
}

/** true si la app puede conectar con Supabase (variables definidas). */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = readSupabaseEnv()
  return Boolean(url && anonKey)
}

function getSupabaseEnv(): { url: string; anonKey: string } {
  const { url, anonKey } = readSupabaseEnv()

  if (!url || !anonKey) {
    throw new Error(
      'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Configuralas en .env (local) o en Vercel → Settings → Environment Variables.'
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
