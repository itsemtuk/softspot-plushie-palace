
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCreatePost } from "@/hooks/use-create-post";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const CreateButton = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();

  const handleCreatePost = () => {
    console.log("CreateButton: handleCreatePost called");
    
    if (!isLoaded) {
      toast({
        title: "Loading...",
        description: "Please wait while we load your account information.",
      });
      return;
    }

    if (!user?.id) {
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
