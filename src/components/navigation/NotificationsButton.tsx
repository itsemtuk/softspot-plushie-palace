
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "@/lib/utils";

interface Notification {
  id: string;
  content: string;
  timestamp: Date;
  read: boolean;
  user: {
    name: string;
    avatar: string;
  };
}

interface NotificationsButtonProps {
  notifications: Notification[];
  unreadCount: number;
}

export const NotificationsButton = ({ notifications, unreadCount }: NotificationsButtonProps) => {
  const navigate = useNavigate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
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
                !notification.read ? 'bg-softspot-50' : ''
              }`}
            >
              <Avatar>
                <AvatarImage src={notification.user.avatar} />
                <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{notification.content}</p>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(notification.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            className="w-full text-softspot-500 text-sm"
            onClick={() => navigate('/settings?tab=notifications')}
          >
            See all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
