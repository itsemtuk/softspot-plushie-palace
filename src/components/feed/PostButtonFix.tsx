
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle } from 'lucide-react';
import { useCreatePost } from '@/hooks/use-create-post';

export const CreatePostButton = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePost = async () => {
    console.log('Create post button clicked');
    
    // Check if Clerk is still loading
    if (!isLoaded) {
      toast({
        title: "Loading...",
        description: "Please wait while we load your account information.",
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, redirecting to sign in');
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts.",
      });
      navigate('/sign-in');
      return;
    }

    try {
      setIsCreating(true);
      console.log('Opening post creation dialog for user:', user.id);
      setIsPostCreationOpen(true);
    } catch (error) {
      console.error('Error opening post creation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open post creation. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleCreatePost}
      disabled={isCreating || !isLoaded}
      className="bg-softspot-500 hover:bg-softspot-600 text-white"
    >
      <PlusCircle className="h-4 w-4 mr-2" />
      {isCreating ? "Opening..." : "Create Post"}
    </Button>
  );
};
