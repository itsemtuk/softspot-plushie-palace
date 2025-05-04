
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { clearAuthState } from "@/utils/auth/authState";

export const useSignOut = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Call Clerk signOut if available
      await signOut();
      
      // Clear centralized auth state
      clearAuthState();
      
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Still clear local auth state even if Clerk fails
      clearAuthState();
      
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { handleSignOut };
};
