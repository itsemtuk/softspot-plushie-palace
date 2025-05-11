
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationsContext";

export function MobileNotifications() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationsClick}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-softspot-500"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
}
