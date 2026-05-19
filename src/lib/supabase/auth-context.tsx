import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient, isSupabaseConfigured } from './client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  isDemoMode: boolean
  enterDemoMode: () => void
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null; needsConfirmation: boolean }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for when Supabase is not configured
const DEMO_USER: User = {
  id: 'demo-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@phishingsecurejd.com',
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { name: 'Usuario Demo' },
} as User

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [configured] = useState(() => isSupabaseConfigured())
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // If Supabase is not configured, stop loading and run in demo mode
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    const supabase = createClient()
    if (!supabase) {
      return { error: new Error('Supabase not configured. Please set environment variables.') }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string) => {
    const supabase = createClient()
    if (!supabase) {
      return { error: new Error('Supabase not configured. Please set environment variables.'), needsConfirmation: false }
    }
    const redirectUrl = import.meta.env.VITE_DEV_SUPABASE_REDIRECT_URL || 
      import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      `${window.location.origin}/auth/callback`
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    
    // Check if email confirmation is required
    const needsConfirmation = !error && data.user && !data.session
    
    return { error: error as Error | null, needsConfirmation: !!needsConfirmation }
  }

  const signInWithGoogle = async () => {
    const supabase = createClient()
    if (!supabase) {
      return { error: new Error('Supabase not configured. Please set environment variables.') }
    }
    const redirectUrl = import.meta.env.VITE_DEV_SUPABASE_REDIRECT_URL || 
      import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
      `${window.location.origin}/auth/callback`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
    return { error: error as Error | null }
  }

  const enterDemoMode = () => {
    setUser(DEMO_USER)
    setIsDemoMode(true)
    setIsLoading(false)
  }

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null)
      setSession(null)
      setIsDemoMode(false)
      return
    }
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isConfigured: configured,
      isDemoMode,
      enterDemoMode,
      signInWithPassword,
      signUp,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
