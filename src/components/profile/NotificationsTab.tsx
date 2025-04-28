import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tab } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, ShoppingBag, Heart, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";

type Notification = {
  id: string;
  type: "message" | "like" | "follow" | "comment" | "order" | "system";
  content: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  username?: string;
  userAvatar?: string;
  link?: string;
};

export function NotificationsTab() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "message",
      content: "New message from PlushieLover123",
      timestamp: "2024-03-15T10:30:00Z",
      read: false,
      userId: "user-2",
      username: "PlushieLover123",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      link: "/messages/user-2"
    },
    {
      id: "2",
      type: "like",
      content: "Your post got a like from CuddleBear456",
      timestamp: "2024-03-14T18:45:00Z",
      read: true,
      userId: "user-3",
      username: "CuddleBear456",
      userAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
      link: "/post/123"
    },
    {
      id: "3",
      type: "follow",
      content: "SoftSpotFan followed you",
      timestamp: "2024-03-14T09:12:00Z",
      read: true,
      userId: "user-4",
      username: "SoftSpotFan",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00d5a4ee9ba7",
      link: "/profile/user-4"
    },
    {
      id: "4",
      type: "comment",
      content: "New comment on your listing",
      timestamp: "2024-03-13T22:00:00Z",
      read: false,
      userId: "user-5",
      username: "FuzzyFriend",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      link: "/marketplace/listing-1"
    },
    {
      id: "5",
      type: "order",
      content: "Your plushie has been purchased!",
      timestamp: "2024-03-12T14:55:00Z",
      read: true,
      link: "/marketplace/order-1"
    },
    {
      id: "6",
      type: "system",
      content: "Welcome to SoftSpot! Check out the latest community guidelines.",
      timestamp: "2024-03-10T08:00:00Z",
      read: true,
      link: "/guidelines"
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 rounded-md bg-secondary p-1">
          <Tab
            className={({ selected }) =>
              `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground ${
                selected ? "bg-muted text-foreground" : "text-muted-foreground"
              }`
            }
          >
            All
          </Tab>
          <Tab
            className={({ selected }) =>
              `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground ${
                selected ? "bg-muted text-foreground" : "text-muted-foreground"
              }`
            }
          >
            Unread
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadNotifications.length}
              </Badge>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              <div className="divide-y divide-border rounded-md border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center space-x-4 p-4"
                  >
                    <Avatar>
                      <AvatarImage src={notification.userAvatar} />
                      <AvatarFallback>{notification.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        {notification.content}
                        <a
                          href={notification.link}
                          className="ml-1 font-medium underline underline-offset-4 hover:text-primary"
                        >
                          Learn more
                        </a>
                      </p>
                      <time
                        dateTime={notification.timestamp}
                        className="block text-xs text-muted-foreground"
                      >
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="flex flex-shrink-0 space-x-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            {unreadNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No unread notifications.</p>
            ) : (
              <div className="divide-y divide-border rounded-md border">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center space-x-4 p-4"
                  >
                    <Avatar>
                      <AvatarImage src={notification.userAvatar} />
                      <AvatarFallback>{notification.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        {notification.content}
                        <a
                          href={notification.link}
                          className="ml-1 font-medium underline underline-offset-4 hover:text-primary"
                        >
                          Learn more
                        </a>
                      </p>
                      <time
                        dateTime={notification.timestamp}
                        className="block text-xs text-muted-foreground"
                      >
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="flex flex-shrink-0 space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default NotificationsTab;
