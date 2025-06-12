
import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'sale';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}

export function NotificationsDropdown() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) return;

    // Simulate some notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        title: 'New Like',
        message: 'Sarah liked your post about the cute teddy bear',
        timestamp: '2 minutes ago',
        read: false
      },
      {
        id: '2',
        type: 'comment',
        title: 'New Comment',
        message: 'Mike commented on your Jellycat collection',
        timestamp: '1 hour ago',
        read: false
      },
      {
        id: '3',
        type: 'follow',
        title: 'New Follower',
        message: 'Emma started following you',
        timestamp: '3 hours ago',
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => prev > 0 ? prev - 1 : 0);

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigate('/messages');
        break;
      case 'like':
      case 'comment':
        navigate('/feed');
        break;
      case 'follow':
        navigate('/profile');
        break;
      default:
        navigate('/notifications');
    }
  };

  const handleViewAll = () => {
    navigate('/notifications');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (!isAuthenticated()) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          toast({
            title: "Authentication Required",
            description: "Please sign in to view notifications."
          });
          navigate("/sign-in");
        }}
      >
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <DropdownMenuHeader className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllRead}
                className="text-softspot-600 hover:text-softspot-700"
              >
                Mark all read
              </Button>
            )}
          </div>
        </DropdownMenuHeader>
        
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleViewAll} className="p-4 text-center">
          <span className="text-softspot-600 hover:text-softspot-700 font-medium">
            View all notifications
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
