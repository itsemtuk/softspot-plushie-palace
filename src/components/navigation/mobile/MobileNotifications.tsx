
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "@/lib/utils";
import { useNotifications } from "@/contexts/NotificationsContext";

export function MobileNotifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-softspot-500"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <ScrollArea className="h-80">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 border-b flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${
                !notification.isRead ? 'bg-softspot-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <Avatar>
                <AvatarImage 
                  src={`https://i.pravatar.cc/150?img=${notification.id}`}
                />
                <AvatarFallback>
                  {notification.message.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(new Date(notification.timestamp))}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            className="w-full text-softspot-500 text-sm"
            onClick={() => navigate('/notifications')}
          >
            See all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
