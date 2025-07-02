
import { supabase } from "../supabase/client";
import { toast } from "@/components/ui/use-toast";

type ClerkUser = {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses?: Array<{ emailAddress: string }>;
  imageUrl?: string;
};

/**
 * Helper function to handle unknown errors
 */
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

/**
 * Syncs Clerk user data to Supabase users table
 */
export const syncClerkUserToSupabase = async (clerkUser: ClerkUser): Promise<boolean> => {
  if (!clerkUser || !clerkUser.id) {
    console.error("No valid Clerk user provided for sync");
    return false;
  }

  try {
    // Prepare user data from Clerk with proper null checks
    const userData = {
      clerk_id: clerkUser.id,
      username: clerkUser.username || clerkUser.firstName || 'User',
      first_name: clerkUser.firstName || null,
      last_name: clerkUser.lastName || null,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
      avatar_url: clerkUser.imageUrl || null,
      updated_at: new Date().toISOString()
    };

    // Attempt to upsert user into Supabase
    const { error } = await supabase
      .from('users')
      .upsert(userData, { 
        onConflict: 'clerk_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error("Supabase user sync error:", error);
      return false;
    }

    console.log("Successfully synced Clerk user to Supabase:", clerkUser.id);
    return true;
  } catch (error) {
    const errorMessage = handleError(error);
    console.error("Failed to sync user to Supabase:", errorMessage);
    return false;
  }
};

/**
 * Get Supabase user ID from Clerk ID
 */
export const getSupabaseUserIdFromClerk = async (clerkId: string): Promise<string | null> => {
  if (!clerkId) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      console.error("Error fetching Supabase user ID:", error);
      return null;
    }

    return (data as any)?.id || null;
  } catch (error) {
    const errorMessage = handleError(error);
    console.error("Failed to get Supabase user ID:", errorMessage);
    return null;
  }
};

/**
 * Fetch user data from Supabase based on Clerk ID
 */
export const fetchUserDataByClerkId = async (clerkId: string): Promise<{ data: any | null; error: string | null }> => {
  if (!clerkId) {
    return { data: null, error: "No Clerk ID provided" };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      const errorMsg = (error as any)?.message || "Unknown error occurred";
      return { data: null, error: errorMsg };
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage = handleError(error);
    console.error("Error fetching user data by Clerk ID:", errorMessage);
    return { data: null, error: errorMessage };
  }
};
