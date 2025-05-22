
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { syncClerkUserToSupabase, getSupabaseUserIdFromClerk } from "@/utils/auth/clerkSupabaseSync";
import { toast } from "@/components/ui/use-toast";

export function useClerkSupabaseUser(clerkUser: any | null | undefined) {
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Sync user whenever Clerk user changes
  useEffect(() => {
    const syncUser = async () => {
      if (!clerkUser) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Transform Clerk user to format needed by sync function
        const formattedUser = {
          id: clerkUser.id,
          username: clerkUser.username || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          emailAddresses: clerkUser.emailAddresses?.map(email => ({
            emailAddress: email.emailAddress || ''
          })) || [],
          imageUrl: clerkUser.imageUrl || ''
        };
        
        // Sync user to Supabase
        const syncSuccess = await syncClerkUserToSupabase(formattedUser);
        
        if (syncSuccess) {
          // Get the Supabase user ID
          const supaId = await getSupabaseUserIdFromClerk(clerkUser.id);
          setSupabaseUserId(supaId);
        } else {
          console.warn("User sync completed but may not have been successful");
        }
      } catch (err) {
        console.error("Error in user sync:", err);
        setError(err instanceof Error ? err : new Error("Unknown error during user sync"));
      } finally {
        setIsLoading(false);
      }
    };
    
    syncUser();
  }, [clerkUser?.id]);
  
  return { supabaseUserId, isLoading, error };
}

export default useClerkSupabaseUser;
