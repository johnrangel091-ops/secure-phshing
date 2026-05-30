import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient, isSupabaseConfigured } from './client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isPasswordRecovery: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null; needsConfirmation: boolean }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes — including PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true)
        setSession(session)
        setUser(session?.user ?? null)
      } else {
        setIsPasswordRecovery(false)
        setSession(session)
        setUser(session?.user ?? null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string) => {
    const supabase = createClient()
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

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const updatePassword = async (newPassword: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      console.error('[PhishingSecureJD] supabase.auth.updateUser error:', error)
    } else {
      setIsPasswordRecovery(false)
    }
    return { error: error as Error | null }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isPasswordRecovery,
      signInWithPassword,
      signUp,
      signInWithGoogle,
      signOut,
      updatePassword,
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
