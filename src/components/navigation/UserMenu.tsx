import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bookmark } from "lucide-react";
import { UserButton } from "./UserButton";
import { NotificationsButton } from "./NotificationsButton";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/auth/authState";
import { useUser } from '@clerk/clerk-react';
import { CreateButton } from "./CreateButton";
import { useCreatePost } from "@/hooks/use-create-post";
import PostCreationFlow from "../post/PostCreationFlow";
import { addPost } from "@/utils/posts/postManagement";
import { PostCreationData, ExtendedPost } from "@/types/core";

export const UserMenu = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user } = 
    isClerkConfigured ? useUser() : { isLoaded: true, isSignedIn: false, user: null };
  const navigate = useNavigate();
  
  // Check authentication status when component mounts or updates
  useEffect(() => {
    const checkAuthStatus = () => {
      if (isClerkConfigured) {
        // Wait for Clerk to load
        if (isClerkLoaded) {
          setIsSignedIn(isClerkSignedIn);
        }
      } else {
        // Use local auth state
        const authState = isAuthenticated();
        setIsSignedIn(authState);
      }
    };
    
    // Check initial status
    checkAuthStatus();
    
    // Set up storage event listener to detect auth changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authStatus' || event.key === 'currentUserId') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clerk-auth-change', checkAuthStatus);
    
    // Check auth status periodically
    const intervalId = setInterval(checkAuthStatus, 3000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clerk-auth-change', checkAuthStatus);
      clearInterval(intervalId);
    };
  }, [isClerkConfigured, isClerkLoaded, isClerkSignedIn]);

  const handlePostCreated = async (data: PostCreationData) => {
    try {
      // Create the post using the utility function
      const username = user?.username || user?.firstName || "Anonymous";
      const userId = user?.id || localStorage.getItem('currentUserId');
      
      await addPost({
        ...data,
        id: `post-${Date.now()}`,
        userId: userId as string,
        user_id: userId as string,
        username: username as string,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        content: data.description,
        forSale: false
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating post:", error);
      return Promise.reject(error);
    }
  };
  
  const handleAuthRequiredAction = (action: string, path: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}.`,
      });
      navigate("/sign-in");
      return false;
    }
    
    navigate(path);
    return true;
  };

  // Show loading state while Clerk is loading
  if (isClerkConfigured && !isClerkLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/sign-in">
          <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const mockPost: ExtendedPost = {
    id: 'mock-post-1',
    userId: 'mock-user',
    user_id: 'mock-user', // Added for compatibility
    username: 'CurrentUser',
    content: 'Check out my new plushie collection!', // Added required content field
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    title: 'My Plushie Collection',
    description: 'Just added some new friends to my collection!',
    tags: ['collection', 'plushies', 'cute'],
    likes: 15,
    comments: 3,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(), // Added for compatibility
    updatedAt: new Date().toISOString(),
    location: 'New York, NY',
    forSale: false // Added required forSale field
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <CreateButton />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleAuthRequiredAction("access messages", "/messages")}
          className="hover:bg-softspot-100"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleAuthRequiredAction("view wishlist", "/wishlist")}
          className="hover:bg-softspot-100"
        >
          <Bookmark className="h-5 w-5" />
        </Button>
        <NotificationsButton />
        <div className="relative">
          <UserButton />
        </div>
      </div>
      
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={onClosePostCreation}
        onPostCreated={handlePostCreated}
      />
    </>
  );
};
