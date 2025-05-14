import { createClient } from '@supabase/supabase-js'

export const signInWithGoogle = async () => {
  console.log("Sign in with Google not available in open-source version");
  return { data: null };
};

// implement real auth with supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  // TODO fix email verification
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log('Supabase client configuration after signIn:', {
    supabaseUrl,
    supabaseAnonKey
  })
  return { data, error }
}

export const signOut = async () => {
  console.log('SignOut called in supabase.ts')
  const { error } = await supabase.auth.signOut()
  console.log('Supabase client configuration after signOut:', {
    supabaseUrl,
    supabaseAnonKey
  })
  return { error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const resetPassword = async (email: string) => {
  // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/update-password',
  })
  return { error }
}

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password })
  return { error }
}
