import supabase, { adminSupabase } from '../config/supabase.js';

export const registerUser = async (email, password, name) => {
  // Sign up the user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name, // Save name to user metadata
      },
    },
  });

  if (error) {
    throw error;
  }
  
  // Optionally: After successful signup, you could also insert the photographer profile 
  // into the 'photographers' table if it isn't handled by a Supabase Database trigger.
  // We'll insert it manually here for completeness.
  // Insert the photographer profile using the admin client to bypass RLS.
  if (data.user) {
    const { error: dbError } = await adminSupabase
      .from('photographers')
      .upsert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name,
        }
      ], { onConflict: 'id' });
    
    if (dbError) {
      console.error('Error inserting into photographers table:', dbError.message);
    }
  }

  return data;
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // Auto-sync the user to the photographers table.
  // This fixes the issue if the user signed up before the ML schema was applied
  // or if their photographer record was somehow deleted.
  // Auto-sync the user to the photographers table using admin client to bypass RLS.
  if (data.user) {
    const { error: dbError } = await adminSupabase
      .from('photographers')
      .upsert([
        {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        }
      ], { onConflict: 'id' });
      
    if (dbError) {
      console.error('Error syncing photographer on login:', dbError.message);
    }
  }

  return data;
};

export const updateUserMetadata = async (userId, metadataUpdates) => {
  // Update the user metadata in Supabase Auth
  const { data, error } = await adminSupabase.auth.admin.updateUserById(userId, {
    user_metadata: metadataUpdates
  });

  if (error) {
    throw error;
  }

  // If name is updated, sync it to the photographers table
  if (metadataUpdates.name) {
    const { error: dbError } = await adminSupabase
      .from('photographers')
      .update({ name: metadataUpdates.name })
      .eq('id', userId);
      
    if (dbError) {
      console.error('Error syncing photographer name on update:', dbError.message);
    }
  }

  return data.user;
};
