import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getSession, signIn, signOut, signUp } from '../lib/supabase'

interface AuthContextType {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getSession().then(({ session }) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  const value = {
    session,
    loading,
    signIn: async (email: string, password: string) => {
      const { error } = await signIn(email, password)
      if (!error) {
        const { session: newSession } = await getSession()
        setSession(newSession)
      }
      return { error }
    },
    signUp: async (email: string, password: string) => {
      const { error } = await signUp(email, password)
      return { error }
    },
    signOut: async () => {
      const { error } = await signOut()
      if (!error) {
        setSession(null)
      }
      return { error }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 