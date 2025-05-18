
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

export const UserMenu = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = 
    isClerkConfigured ? useUser() : { isLoaded: true, isSignedIn: false };
  const navigate = useNavigate();
  
  // Check authentication status when component mounts or updates
  useEffect(() => {
    const checkAuthStatus = () => {
      if (isClerkConfigured) {
        // Wait for Clerk to load
        if (isClerkLoaded) {
          setIsSignedIn(isClerkSignedIn);
          console.log("UserMenu - Clerk auth state:", isClerkSignedIn);
        }
      } else {
        // Use local auth state
        const authState = isAuthenticated();
        setIsSignedIn(authState);
        console.log("UserMenu - Local auth state:", authState);
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
  
  const handleAuthRequiredAction = (action: string, path: string) => {
    console.log(`UserMenu - Auth required action: ${action}, path: ${path}`);
    
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}.`,
      });
      navigate("/sign-in");
      return false;
    }
    
    console.log(`Navigating to: ${path}`);
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

  return (
    <div className="flex items-center space-x-4">
      <CreateButton onCreatePost={() => setIsPostCreationOpen(true)} />
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
  );
};
