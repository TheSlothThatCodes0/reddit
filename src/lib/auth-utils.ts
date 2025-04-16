import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getRandomColorForUser } from "./utils";

// Create a Supabase client for auth operations
const getSupabaseClient = () => createClientComponentClient();

/**
 * Ensures the authenticated user exists in the custom users table
 * Call this on app initialization or when authentication changes
 */
export async function syncUserWithDatabase(): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  try {
    // Get the current authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error("No authenticated user found:", error);
      return false;
    }
    
    // Check if user already exists in the users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('userID')
      .eq('email', user.email)
      .maybeSingle();
      
    if (!checkError && existingUser?.userID) {
      console.log("User already exists in database");
      return true;
    }
    
    // Get the next available user ID
    const { data: lastUser, error: idError } = await supabase
      .from('users')
      .select('userID')
      .order('userID', { ascending: false })
      .limit(1)
      .single();
      
    const nextUserID = idError || !lastUser ? 1 : lastUser.userID + 1;
    
    // Create username from email or use a part of the user ID
    let userName = user.email ? user.email.split('@')[0] : `user_${user.id.substring(0, 8)}`;
    
    // In case of duplicate usernames, append a number
    const { data: userCheck } = await supabase
      .from('users')
      .select('count')
      .eq('userName', userName);
      
    if (userCheck && userCheck.length > 0) {
      userName = `${userName}_${Math.floor(Math.random() * 1000)}`;
    }
    
    // Store the user in our custom users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        userName: userName,
        userID: nextUserID,
        email: user.email,
        password: '', // Don't store the actual password
        createdAt: new Date().toISOString(),
        karma: 0,
        displayName: user.user_metadata?.full_name || user.user_metadata?.name || userName
      });
    
    if (insertError) {
      console.error('Error inserting user into database:', insertError);
      return false;
    }
    
    console.log("User successfully synced to database");
    return true;
  } catch (err) {
    console.error("Exception syncing user:", err);
    return false;
  }
}

/**
 * Updates the user's display name, bio, or other profile information
 */
export async function updateUserProfile(
  updates: {
    displayName?: string;
    bio?: string;
    location?: string;
  }
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  try {
    // Get the current user's email
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }
    
    // Update the user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        ...(updates.displayName && { displayName: updates.displayName }),
        ...(updates.bio && { bio: updates.bio }),
        ...(updates.location && { location: updates.location }),
        // Add other fields as needed
      })
      .eq('email', user.email);
      
    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { success: false, error: updateError.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error("Exception updating profile:", err);
    return { success: false, error: "Failed to update profile" };
  }
}
