import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getSession, signIn, signOut, signUp, resetPassword, updatePassword } from '../lib/supabase'

interface AuthContextType {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
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
    resetPassword: async (email: string) => {
      const { error } = await resetPassword(email)
      return { error }
    },
    updatePassword: async (password: string) => {
      const { error } = await updatePassword(password)
      if (!error) {
        const { session: newSession } = await getSession()
        setSession(newSession)
      }
      return { error }
    }
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