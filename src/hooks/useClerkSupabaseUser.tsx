
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
        setSupabaseUserId(null);
        setError(null);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Make sure we have all required user properties with fallbacks
        const formattedUser = {
          id: clerkUser.id || '',
          username: clerkUser.username || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          emailAddresses: clerkUser.emailAddresses?.map((email: any) => ({
            emailAddress: email?.emailAddress || ''
          })) || [],
          imageUrl: clerkUser.imageUrl || ''
        };
        
        // Sync user to Supabase - this returns a boolean
        const syncResult = await syncClerkUserToSupabase(formattedUser);
        
        if (!syncResult) {
          console.warn("User sync failed, but continuing");
          // Don't treat this as a fatal error - continue with null supabaseUserId
          setSupabaseUserId(null);
        } else {
          console.log("User sync successful");
          // Try to get the Supabase user ID after successful sync
          const supaId = await getSupabaseUserIdFromClerk(clerkUser.id);
          setSupabaseUserId(supaId);
        }
      } catch (err) {
        console.error("Error in user sync:", err);
        setError(err instanceof Error ? err : new Error("Unknown error during user sync"));
        setSupabaseUserId(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    syncUser();
  }, [clerkUser?.id]);
  
  return { supabaseUserId, isLoading, error };
}

export default useClerkSupabaseUser;
