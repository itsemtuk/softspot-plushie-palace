
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { UserButton } from "./UserButton";
import { useUser } from "@clerk/clerk-react";
import { UserStatusBadge } from "@/components/messaging/UserStatusBadge";
import { useState, useEffect } from "react";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";

export const UserMenu = () => {
  const { user } = useUser();
  const [userStatus, setUserStatusState] = useState<"online" | "offline" | "away" | "busy">("online");
  
  // Get status from local storage or Clerk metadata
  useEffect(() => {
    if (user) {
      const status = getUserStatus();
      setUserStatusState(status);
      
      // Ensure status is saved to local storage consistently
      setUserStatus(status);
      
      // Check for status changes periodically
      const intervalId = setInterval(() => {
        const currentStatus = getUserStatus();
        if (currentStatus !== userStatus) {
          setUserStatusState(currentStatus);
        }
      }, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [user, userStatus]);

  return (
    <div className="flex items-center space-x-2">
      <Link to="/messages">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </Link>
      <div className="relative">
        <UserButton />
        <UserStatusBadge 
          status={userStatus}
          className="absolute -bottom-1 -right-1"
          size="sm"
        />
      </div>
    </div>
  );
};
