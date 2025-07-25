import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get the next available user ID
async function getNextUserID() {
  const { data, error } = await supabase
    .from('users')
    .select('userID')
    .order('userID', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Error fetching last user ID:', error);
    return 1; // Default to 1 if there's an error
  }
  
  return data && data.length > 0 ? data[0].userID + 1 : 1;
}

// Helper function to create a user in the custom users table
async function createUserRecord(email: string, userName?: string) {
  // Extract username from email if not provided
  if (!userName) {
    userName = email.split('@')[0];
  }
  
  // Get the next available user ID
  const nextUserID = await getNextUserID();
  
  // Store the user in our custom users table
  const { data, error } = await supabase
    .from('users')
    .insert({
      userName: userName,
      userID: nextUserID,
      email: email,
      password: '', // Don't store the actual password, it's handled by Supabase Auth
      createdAt: new Date().toISOString(),
      karma: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error inserting user into database:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
}

export async function signUp(email: string, password: string) {
  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) {
    return { data: null, error: authError };
  }

  // Extract username from email (before the @)
  const userName = email.split('@')[0];
  
  // Get the next available user ID
  const nextUserID = await getNextUserID();
  
  // Store the user in our custom users table
  const { error: dbError } = await supabase
    .from('users')
    .insert({
      userName: userName,
      userID: nextUserID,
      email: email,
      password: '', // Don't store the actual password, it's handled by Supabase Auth
      createdAt: new Date().toISOString(),
      karma: 0
    });
  
  if (dbError) {
    console.error('Error inserting user into database:', dbError);
    // We created the auth user but failed to create our custom user
    // In a production app, you might want to delete the auth user or implement a retry mechanism
  }
  
  return { data: authData, error: authError || dbError };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authData.user) {
    return { user: null, error: authError };
  }
  
  // Get user details from our custom users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', authData.user.email)
    .single();
  
  if (userError) {
    console.error('Error fetching user data:', userError);
    // Fall back to auth user data
    return { 
      user: { 
        ...authData.user,
        userName: authData.user.email?.split('@')[0] || 'User'
      }, 
      error: null 
    };
  }
  
  // Combine auth and custom user data
  return { 
    user: { 
      ...authData.user,
      ...userData
    }, 
    error: null 
  };
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
 * Handle auth state change and ensure user exists in custom table
 * Call this function when your app initializes
 */
export function setupAuthSync() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    // When a user signs in or is updated
    if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
      const { email } = session.user;
      
      if (!email) return; // Skip if no email
      
      // Check if user exists in custom table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      // If user doesn't exist in our custom table, create them
      if (!existingUser) {
        // Get user name from provider data if available
        let userName;
        if (session.user.user_metadata?.full_name) {
          userName = session.user.user_metadata.full_name;
        } else if (session.user.user_metadata?.name) {
          userName = session.user.user_metadata.name;
        }
        
        await createUserRecord(email, userName);
      }
    }
  });
}
