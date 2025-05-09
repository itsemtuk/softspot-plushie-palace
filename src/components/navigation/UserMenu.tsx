
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { UserButton } from "./UserButton";
import { NotificationsButton } from "./NotificationsButton";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated, getCurrentUser } from "@/utils/auth/authState";
import { useUser } from '@clerk/clerk-react';

export const UserMenu = () => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = 
    isClerkConfigured ? useUser() : { isLoaded: true, isSignedIn: false };
  
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
        setIsSignedIn(isAuthenticated());
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
    
    // Also check auth status periodically to handle issues across tabs
    const interval = setInterval(checkAuthStatus, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isClerkConfigured, isClerkLoaded, isClerkSignedIn]);
  
  const handleAuthRequiredAction = (action: string, path: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}.`,
      });
      navigate("/sign-in");
      return false;
    }
    
    // Use setTimeout to break current execution context and ensure navigation happens
    setTimeout(() => {
      navigate(path);
    }, 0);
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
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => handleAuthRequiredAction("access messages", "/messages")}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      <NotificationsButton />
      <div className="relative">
        <UserButton />
      </div>
    </div>
  );
};
