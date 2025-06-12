
import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";

export function MobileNotifications() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated()) return;

    // Simulate unread count for demo
    setUnreadCount(2);
  }, []);

  const handleClick = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view notifications."
      });
      navigate("/sign-in");
      return;
    }
    
    navigate("/notifications");
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleClick}
      className="relative"
    >
      {unreadCount > 0 ? (
        <BellDot className="h-5 w-5" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
      {unreadCount > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
          variant="destructive"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
