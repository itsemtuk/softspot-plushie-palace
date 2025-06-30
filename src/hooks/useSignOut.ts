
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { clearAuthState } from "@/utils/auth/authState";
import { supabase } from "@/utils/supabase/client";

export const useSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const isUsingClerk = localStorage.getItem('usingClerk') === 'true';
      const authProvider = localStorage.getItem('authProvider') || '';
      
      // Sign out from the appropriate provider
      if (isUsingClerk) {
        // Only try to use Clerk if we're actually inside a ClerkProvider
        try {
          const { useClerk } = await import('@clerk/clerk-react');
          // Check if we're in a Clerk context before using the hook
          const clerkInstance = (window as any).__clerk;
          if (clerkInstance) {
            await clerkInstance.signOut();
            console.log("Signed out from Clerk");
          }
        } catch (error) {
          console.warn('Clerk signout failed, continuing with local cleanup:', error);
        }
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
