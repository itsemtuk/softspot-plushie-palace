
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCreatePost } from "@/hooks/use-create-post";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/auth/authState";

export const CreateButton = () => {
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  const isClerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const handleCreatePost = () => {
    console.log("CreateButton: handleCreatePost called");
    
    // Check authentication status
    let userAuthenticated = false;
    let userId = null;

    if (isClerkConfigured) {
      try {
        const { useUser } = require('@clerk/clerk-react');
        const { user, isLoaded } = useUser();
        
        if (!isLoaded) {
          toast({
            title: "Loading...",
            description: "Please wait while we load your account information.",
          });
          return;
        }
        
        userAuthenticated = !!user?.id;
        userId = user?.id;
      } catch (error) {
        console.warn('Clerk not available, checking fallback auth');
        userAuthenticated = isAuthenticated();
      }
    } else {
      userAuthenticated = isAuthenticated();
    }

    if (!userAuthenticated) {
      console.log("User not authenticated, redirecting to sign in");
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts.",
      });
      navigate('/sign-in');
      return;
    }

    console.log("CreateButton: Setting post creation open to true");
    setIsPostCreationOpen(true);
  };

  return (
    <Button 
      onClick={handleCreatePost}
      className="bg-softspot-500 hover:bg-softspot-600 text-white"
      size="sm"
    >
      <PlusCircle className="h-4 w-4 mr-2" />
      Create
    </Button>
  );
};
