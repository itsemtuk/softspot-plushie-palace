
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useClerkSupabaseUser = (clerkUser: any) => {
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

        // First check if user exists with a more robust query
        let { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', clerkUser.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user:', fetchError);
        }

        if (existingUser) {
          console.log('Found existing user:', existingUser.id);
          setSupabaseUserId(existingUser.id);
          setError(null);
          return;
        }

        // User doesn't exist, try to create
        console.log('Creating new user for Clerk ID:', clerkUser.id);
        
        const userData = {
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
          first_name: clerkUser.firstName || null,
          last_name: clerkUser.lastName || null,
          username: clerkUser.username || clerkUser.firstName || 'User',
          avatar_url: clerkUser.imageUrl || null
        };

        // Try to create user with service role bypass using rpc
        const { data: newUser, error: createError } = await supabase.rpc('create_user_safe', {
          user_data: userData
        });

        if (createError) {
          console.error('RPC create user failed:', createError);
          
          // Check if it's a duplicate key error (user already exists)
          if (createError.code === '23505' || createError.message?.includes('duplicate key')) {
            console.log('User already exists, trying alternate fetch...');
            
            // Wait a moment and try fetching again - sometimes there's a timing issue
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Try multiple approaches to fetch the user
            const queries = [
              // Standard query
              supabase.from('users').select('id').eq('clerk_id', clerkUser.id).maybeSingle(),
              // Query with different approach
              supabase.from('users').select('id').ilike('clerk_id', clerkUser.id).maybeSingle(),
            ];

            let foundUser = null;
            for (const query of queries) {
              const { data, error } = await query;
              if (!error && data) {
                foundUser = data;
                break;
              }
            }

            if (foundUser) {
              console.log('Successfully retrieved existing user:', foundUser.id);
              setSupabaseUserId(foundUser.id);
              setError(null);
            } else {
              // User exists but we can't fetch it - this might be an RLS issue
              // For now, we'll continue without the Supabase user ID
              console.warn('User exists in database but cannot be retrieved due to access restrictions');
              setSupabaseUserId(null);
              setError('User sync limited - continuing with reduced functionality');
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
            setError(null);
          } else {
            console.log('User creation returned empty result');
            setSupabaseUserId(null);
            setError('User creation completed but ID not returned');
          }
        }
        
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
