
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
            console.error('RPC create user failed, trying direct insert:', createError);
            
            // Fallback to direct insert
            const { data: directUser, error: directError } = await supabase
              .from('users')
              .insert([userData])
              .select('id')
              .single();

            if (directError) {
              console.error('Direct insert also failed:', directError);
              throw new Error('User creation blocked by security policy. Please check RLS configuration.');
            }

            console.log('Created user via direct insert:', directUser.id);
            setSupabaseUserId(directUser.id);
          } else {
            console.log('Created user via RPC:', newUser[0]?.id);
            setSupabaseUserId(newUser[0]?.id);
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
