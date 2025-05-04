
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusCircle } from "lucide-react";
import { UserButton } from "./UserButton";
import { NotificationsButton } from "./NotificationsButton";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/auth/authState";

export const UserMenu = () => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  // Check authentication status when component mounts or updates
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsSignedIn(isAuthenticated());
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
  }, []);
  
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
        onClick={() => handleAuthRequiredAction("create content", "/feed")}
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
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
