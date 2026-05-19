import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

// Flag to track if we're using a real Supabase connection
export let isSupabaseConfigured = false

export function createClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing, return a mock client that won't crash the app
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Running in local-only mode.')
    isSupabaseConfigured = false
    
    // Return a mock client that allows the UI to load with local data
    const mockClient = {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (_event: string, callback: (event: string, session: null) => void) => {
          // Simulate auth ready state
          setTimeout(() => callback('SIGNED_OUT', null), 0)
          return { data: { subscription: { unsubscribe: () => {} } } }
        },
        signInWithPassword: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase no configurado. Ejecutando en modo local.' } 
        }),
        signUp: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase no configurado. Ejecutando en modo local.' } 
        }),
        signInWithOAuth: async () => ({ 
          error: { message: 'Supabase no configurado. Ejecutando en modo local.' } 
        }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: { message: 'Supabase no configurado' } }),
        update: () => ({ data: null, error: { message: 'Supabase no configurado' } }),
        delete: () => ({ data: null, error: { message: 'Supabase no configurado' } }),
      }),
    } as unknown as SupabaseClient
    
    supabaseInstance = mockClient
    return mockClient
  }

  isSupabaseConfigured = true
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseInstance
}
