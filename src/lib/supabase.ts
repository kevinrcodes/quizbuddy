// This file has been emptied to remove Supabase dependencies.
// The open-source version uses local configuration instead.

// Export empty objects to prevent import errors in case any components still reference this file
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: null }),
    exchangeCodeForSession: async () => ({ error: null }),
    signInWithOAuth: async () => ({ data: null, error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => null,
        maybeSingle: async () => null
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => null
        })
      })
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({
        unsubscribe: () => {}
      })
    })
  })
};

export const signInWithGoogle = async () => {
  console.log("Sign in with Google not available in open-source version");
  return { data: null };
};

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabaseClient.auth.getSession()
  return { session, error }
}
