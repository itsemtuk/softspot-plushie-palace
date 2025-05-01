
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostSheet } from "./CreatePostSheet";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";
import { useState, useEffect } from "react";
import { getUserStatus } from "@/utils/storage/localStorageUtils";

export function BottomNav() {
  const [userStatus, setUserStatus] = useState<"online" | "offline" | "away" | "busy">("online");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const location = useLocation();
  
  // Get status from local storage
  useEffect(() => {
    const checkUserStatus = () => {
      const status = getUserStatus();
      setUserStatus(status);
      setIsSignedIn(!!localStorage.getItem('currentUserId'));
    };
    
    // Initial check
    checkUserStatus();
    
    // Check for status changes periodically
    const intervalId = setInterval(checkUserStatus, 2000);
    
    // Update on localStorage changes
    const handleStorageChange = () => {
      checkUserStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper to determine active state
  const isActive = (path: string) => {
    if (path === '/feed' && location.pathname === '/feed') return true;
    if (path === '/discover' && location.pathname === '/discover') return true;
    if (path === '/marketplace' && location.pathname.includes('/marketplace')) return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-softspot-100 pb-safe">
      <div className="flex items-center justify-around h-16">
        <Link to="/feed">
          <Button 
            variant={isActive('/feed') ? "default" : "ghost"} 
            size="icon"
            className={isActive('/feed') ? "bg-softspot-100 text-softspot-700" : ""}
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/discover">
          <Button 
            variant={isActive('/discover') ? "default" : "ghost"} 
            size="icon"
            className={isActive('/discover') ? "bg-softspot-100 text-softspot-700" : ""}
          >
            <Search className="h-5 w-5" />
          </Button>
        </Link>
        <CreatePostSheet />
        <Link to="/marketplace">
          <Button 
            variant={isActive('/marketplace') ? "default" : "ghost"} 
            size="icon"
            className={isActive('/marketplace') ? "bg-softspot-100 text-softspot-700" : ""}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/profile" className="relative">
          <Button 
            variant={isActive('/profile') ? "default" : "ghost"} 
            size="icon"
            className={isActive('/profile') ? "bg-softspot-100 text-softspot-700" : ""}
          >
            <User className="h-5 w-5" />
          </Button>
          {isSignedIn && (
            <UserStatusBadge 
              status={userStatus}
              className="absolute -bottom-1 -right-1"
              size="sm"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
