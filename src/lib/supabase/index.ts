import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export function getSupabaseClient() {
  return supabase;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (err) {
    console.error("Error during sign in:", err);
    return { data: null, error: err };
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { data, error };
  } catch (err) {
    console.error("Error during sign up:", err);
    return { data: null, error: err };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error("Error during sign out:", err);
    return { error: err };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    return { data, error };
  } catch (err) {
    console.error("Error during Google sign in:", err);
    return { data: null, error: "Failed to sign in with Google" };
  }
}

/**
 * Get the current logged in user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user, error: null };
  } catch (err) {
    console.error("Error getting current user:", err);
    return { user: null, error: "Failed to get user information" };
  }
}