
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const useClerkSupabaseUser = (clerkUser: ReturnType<typeof useUser>['user']) => {
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
          // Create new user with service role bypass
          console.log('Creating new user for Clerk ID:', clerkUser.id);
          
          const userData = {
            clerk_id: clerkUser.id,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
            first_name: clerkUser.firstName || null,
            last_name: clerkUser.lastName || null,
            username: clerkUser.username || clerkUser.firstName || 'User',
            avatar_url: clerkUser.imageUrl || null
          };

          // Try to create user with explicit RLS bypass using rpc
          const { data: newUser, error: createError } = await supabase.rpc('create_user_safe', {
            user_data: userData
          });

          if (createError) {
            console.error('RPC create user failed:', createError);
            
            // Check if it's a duplicate key error (user already exists)
            if (createError.code === '23505' || createError.message?.includes('duplicate key')) {
              console.log('User already exists, fetching existing user...');
              
              // Try to fetch the existing user
              const { data: existingUser, error: refetchError } = await supabase
                .from('users')
                .select('id')
                .eq('clerk_id', clerkUser.id)
                .maybeSingle();

              if (refetchError) {
                console.error('Error refetching user:', refetchError);
                throw new Error('User exists but could not be retrieved');
              }

              if (existingUser) {
                console.log('Successfully retrieved existing user:', existingUser.id);
                setSupabaseUserId(existingUser.id);
              } else {
                throw new Error('User should exist but was not found');
              }
            } else {
              // For other errors, this is a real failure
              throw new Error('User creation failed: ' + createError.message);
            }
          } else {
            // User creation succeeded
            if (newUser && Array.isArray(newUser) && newUser.length > 0 && newUser[0]?.id) {
              console.log('Created user via RPC:', newUser[0].id);
              setSupabaseUserId(newUser[0].id);
            } else {
              throw new Error('User creation returned invalid data');
            }
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('User sync error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync user';
        setError(errorMessage);
        setSupabaseUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [clerkUser?.id, clerkUser?.emailAddresses, clerkUser?.firstName, clerkUser?.lastName, clerkUser?.username, clerkUser?.imageUrl]);

  return { supabaseUserId, isLoading, error };
};
