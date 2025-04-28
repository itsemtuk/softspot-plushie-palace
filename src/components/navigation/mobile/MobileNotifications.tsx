
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "@/lib/utils";

// Mock notifications data
const notifications = [
  {
    id: "notif-1",
    content: "Sarah started following you",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
    user: {
      name: "Sarah",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: "notif-2",
    content: "Mike liked your post",
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    user: {
      name: "Mike",
      avatar: "https://i.pravatar.cc/150?img=12"
    }
  }
];

export function MobileNotifications() {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

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
}
