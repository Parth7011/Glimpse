import supabase from '../config/supabase.js';

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
  if (data.user) {
    const { error: dbError } = await supabase
      .from('photographers')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name,
        }
      ]);
    
    // Ignore error if RLS or triggers already inserted it
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
  if (data.user) {
    const { error: dbError } = await supabase
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
