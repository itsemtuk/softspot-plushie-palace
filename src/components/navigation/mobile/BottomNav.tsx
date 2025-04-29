
import { Link } from "react-router-dom";
import { Home, Search, PlusSquare, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostSheet } from "./CreatePostSheet";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";
import { useState, useEffect } from "react";
import { getUserStatus } from "@/utils/storage/localStorageUtils";

export function BottomNav() {
  const [userStatus, setUserStatus] = useState<"online" | "offline" | "away" | "busy">("online");
  const [isSignedIn, setIsSignedIn] = useState(false);
  
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-softspot-100 pb-safe">
      <div className="flex items-center justify-around h-16">
        <Link to="/feed">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/discover">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </Link>
        <CreatePostSheet />
        <Link to="/marketplace">
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/profile" className="relative">
          <Button variant="ghost" size="icon">
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
