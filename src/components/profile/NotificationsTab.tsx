
import React, { useState } from 'react';
import { 
  Bell, 
  BellOff, 
  Heart, 
  MessageSquare, 
  User, 
  Package,
  Check
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Notification } from '@/types/marketplace';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "follow",
    content: "Sarah started following you",
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    read: false,
    relatedUserId: "user-2"
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "like",
    content: "Mike liked your post",
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    read: false,
    relatedUserId: "user-3",
    relatedItemId: "post-1",
    relatedItemType: "post"
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "comment",
    content: "Emma commented on your post: 'This is so cute!'",
    timestamp: new Date(Date.now() - 1 * 86400000), // 1 day ago
    read: true,
    relatedUserId: "user-4",
    relatedItemId: "post-2",
    relatedItemType: "post"
  },
  {
    id: "notif-4",
    userId: "user-1",
    type: "message",
    content: "You have a new message from Sarah",
    timestamp: new Date(Date.now() - 2 * 86400000), // 2 days ago
    read: true,
    relatedUserId: "user-2",
    relatedItemId: "thread-1",
    relatedItemType: "message"
  },
  {
    id: "notif-5",
    userId: "user-1",
    type: "trade",
    content: "Sarah wants to trade with you",
    timestamp: new Date(Date.now() - 3 * 86400000), // 3 days ago
    read: true,
    relatedUserId: "user-2",
    relatedItemId: "trade-1",
    relatedItemType: "trade"
  },
  {
    id: "notif-6",
    userId: "user-1",
    type: "system",
    content: "Welcome to Plushie Palace! Complete your profile to get started.",
    timestamp: new Date(Date.now() - 7 * 86400000), // 7 days ago
    read: true
  }
];

// Mock users for notifications
const mockUsers = [
  { id: "user-2", name: "Sarah", username: "sarahlovesplushies", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "user-3", name: "Mike", username: "mikeplush", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "user-4", name: "Emma", username: "emmacollects", avatar: "https://i.pravatar.cc/150?img=9" }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'follow':
      return <User className="h-5 w-5 text-blue-500" />;
    case 'like':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'comment':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'trade':
      return <Package className="h-5 w-5 text-amber-500" />;
    case 'system':
      return <Bell className="h-5 w-5 text-gray-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all');
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);
      
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={markAllAsRead}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          Unread
        </Button>
        <Button
          variant={filter === 'follow' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('follow')}
          className={filter === 'follow' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          <User className="h-4 w-4 mr-2" />
          Follows
        </Button>
        <Button
          variant={filter === 'like' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('like')}
          className={filter === 'like' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          <Heart className="h-4 w-4 mr-2" />
          Likes
        </Button>
        <Button
          variant={filter === 'comment' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('comment')}
          className={filter === 'comment' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Comments
        </Button>
        <Button
          variant={filter === 'message' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('message')}
          className={filter === 'message' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
        </Button>
        <Button
          variant={filter === 'trade' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('trade')}
          className={filter === 'trade' ? 'bg-softspot-400 hover:bg-softspot-500' : ''}
        >
          <Package className="h-4 w-4 mr-2" />
          Trades
        </Button>
      </div>
      
      <ScrollArea className="h-[600px]">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map(notification => {
              const relatedUser = notification.relatedUserId 
                ? mockUsers.find(u => u.id === notification.relatedUserId)
                : null;

              return (
                <Card 
                  key={notification.id} 
                  className={`p-4 ${!notification.read ? 'bg-softspot-50' : 'bg-white'}`}
                >
                  <div className="flex items-start gap-3">
                    {relatedUser ? (
                      <Avatar>
                        <AvatarImage src={relatedUser.avatar} alt={relatedUser.name} />
                        <AvatarFallback>{relatedUser.name[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive" 
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <BellOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              When you have new notifications, they will appear here.
            </p>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationsTab;
