
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tab } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, ShoppingBag, Heart, MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { useNotifications, useClerkNotifications } from "@/hooks/use-notifications";

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
  const { notifications, markAsRead, clearNotifications, unreadCount } = useClerkNotifications();

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Notifications</h2>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearNotifications}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
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
              <div className="p-12 flex flex-col items-center justify-center text-center border rounded-md">
                <div className="bg-gray-50 rounded-full p-4 mb-4">
                  <ThumbsUp className="h-12 w-12 text-softspot-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-gray-500">You have no notifications.</p>
              </div>
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
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="ml-1 font-medium underline underline-offset-4 hover:text-primary"
                          >
                            Learn more
                          </a>
                        )}
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
                        onClick={() => markAsRead(notification.id)}
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
              <div className="p-12 flex flex-col items-center justify-center text-center border rounded-md">
                <div className="bg-gray-50 rounded-full p-4 mb-4">
                  <ThumbsUp className="h-12 w-12 text-softspot-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                <p className="text-gray-500">You have no unread notifications.</p>
              </div>
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
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="ml-1 font-medium underline underline-offset-4 hover:text-primary"
                          >
                            Learn more
                          </a>
                        )}
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
