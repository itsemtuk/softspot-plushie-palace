
import { useState, useEffect } from 'react';
import { User } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const useClerkSupabaseUser = (clerkUser: User | null | undefined) => {
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!clerkUser?.id) {
        setSupabaseUserId(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Syncing Clerk user:', clerkUser.id);

        // First check if user exists
        let { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkUser.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching user:', fetchError);
          throw fetchError;
        }

        if (existingUser) {
          console.log('Found existing user:', existingUser.id);
          setSupabaseUserId(existingUser.id);
        } else {
          // Create new user
          console.log('Creating new user for Clerk ID:', clerkUser.id);
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              clerk_id: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || null,
              first_name: clerkUser.firstName || null,
              last_name: clerkUser.lastName || null,
              username: clerkUser.username || null,
              avatar_url: clerkUser.imageUrl || null
            })
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating user:', createError);
            throw createError;
          }

          console.log('Created new user:', newUser.id);
          setSupabaseUserId(newUser.id);
        }
        
        setError(null);
      } catch (err) {
        console.error('User sync error:', err);
        setError(err instanceof Error ? err.message : 'Failed to sync user');
        setSupabaseUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [clerkUser?.id]);

  return { supabaseUserId, isLoading, error };
};
