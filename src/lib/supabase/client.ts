import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Credenciales de Supabase - PhishingSecureJD
// URL del proyecto
const SUPABASE_URL = 'https://saowywuffmsycsciqwka.supabase.co'

// La clave anon se obtiene de las variables de entorno
// Configuradas en v0 Settings > Vars como NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  ''

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  if (!SUPABASE_ANON_KEY) {
    console.error('[v0] Error: SUPABASE_ANON_KEY no esta configurada')
    console.error('[v0] Por favor configura NEXT_PUBLIC_SUPABASE_ANON_KEY en Settings > Vars')
    // Return a dummy client that will fail gracefully
    return createSupabaseClient(SUPABASE_URL, 'placeholder-key-will-fail', {
      auth: {
        persistSession: false,
      },
    })
  }

  supabaseInstance = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

// Export para uso directo
export const supabase = createClient()
