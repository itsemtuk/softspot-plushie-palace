
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { clearAuthState } from "@/utils/auth/authState";
import { supabase } from "@/utils/supabase/client";

export const useSignOut = () => {
  const { signOut: clerkSignOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const isUsingClerk = localStorage.getItem('usingClerk') === 'true';
      const authProvider = localStorage.getItem('authProvider') || '';
      
      // Sign out from the appropriate provider
      if (isUsingClerk) {
        // Call Clerk signOut if available
        await clerkSignOut();
        console.log("Signed out from Clerk");
      } else if (authProvider === 'supabase') {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log("Signed out from Supabase");
      }
      
      // Clear centralized auth state
      await clearAuthState();
      
      // Clear additional user data
      localStorage.removeItem('userAvatarUrl');
      sessionStorage.removeItem('userAvatarUrl');
      
      // Navigate to home page
      navigate("/");
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Still clear local auth state even if provider sign out fails
      await clearAuthState();
      
      navigate("/");
      
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { handleSignOut };
};
