
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Heart, MessageSquare, ShoppingBag, CheckCircle2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Notification, useNotifications } from "@/contexts/NotificationsContext";
import { formatTimeAgo } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { EmptyContentSection } from "@/components/profile/EmptyContentSection";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationsTab() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [filtered, setFiltered] = useState<Notification[]>([]);
  
  // Filter notifications based on selected tab
  useEffect(() => {
    if (selectedTab === "all") {
      setFiltered(notifications);
    } else if (selectedTab === "unread") {
      setFiltered(notifications.filter(notification => !notification.read));
    } else if (selectedTab === "important") {
      setFiltered(notifications.filter(notification => notification.type === "warning" || notification.type === "error"));
    }
  }, [selectedTab, notifications]);

  const handleClearAll = () => {
    markAllAsRead();
  };
  
  // Group notifications by date (today, yesterday, this week, earlier)
  const groupedNotifications = filtered.reduce(
    (groups: Record<string, Notification[]>, notification) => {
      const date = new Date(notification.timestamp);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      
      let groupName;
      if (date.toDateString() === now.toDateString()) {
        groupName = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupName = "Yesterday";
      } else if (date >= lastWeek) {
        groupName = "This Week";
      } else {
        groupName = "Earlier";
      }
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push(notification);
      return groups;
    },
    {}
  );

  // Provide an icon based on notification type
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="my-4">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5" /> 
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-softspot-100 text-softspot-800">
              {unreadCount} new
            </Badge>
          )}
        </h2>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!unreadCount}
            >
              Mark all as read
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark all as read?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark all unread notifications as read.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tab.Group onChange={(index) => setSelectedTab(["all", "unread", "important"][index])}>
        <Tab.List className="flex space-x-1 border-b mb-4">
          <Tab
            className={({ selected }) =>
              classNames(
                "py-2 px-4 text-sm font-medium border-b-2",
                selected
                  ? "text-softspot-600 border-softspot-500"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              )
            }
          >
            All
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "py-2 px-4 text-sm font-medium border-b-2",
                selected
                  ? "text-softspot-600 border-softspot-500"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              )
            }
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-softspot-100 text-softspot-800">
                {unreadCount}
              </Badge>
            )}
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "py-2 px-4 text-sm font-medium border-b-2",
                selected
                  ? "text-softspot-600 border-softspot-500"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              )
            }
          >
            Important
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          <Tab.Panel>
            {filtered.length === 0 ? (
              <EmptyContentSection
                title="No notifications"
                description="You don't have any notifications yet."
                buttonText="Go to Feed"
                navigateTo="/feed"
              />
            ) : (
              Object.entries(groupedNotifications).map(([date, notifications]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </Tab.Panel>
          
          <Tab.Panel>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">All caught up!</h3>
                <p className="mt-1 text-sm text-gray-500">You have no unread notifications.</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([date, notifications]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </Tab.Panel>
          
          <Tab.Panel>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No important notifications</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any important notifications.</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([date, notifications]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

// Notification item component
function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  // Get icon based on notification type or content
  let icon;
  if (notification.message.includes("liked")) {
    icon = <Heart className="h-5 w-5 text-rose-500" />;
  } else if (notification.message.includes("commented") || notification.message.includes("message")) {
    icon = <MessageSquare className="h-5 w-5 text-blue-500" />;
  } else if (notification.message.includes("purchased") || notification.message.includes("order")) {
    icon = <ShoppingBag className="h-5 w-5 text-green-500" />;
  } else if (notification.type === "warning" || notification.type === "error") {
    icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
  } else {
    icon = <Bell className="h-5 w-5 text-gray-500" />;
  }

  return (
    <Card className={notification.read ? "bg-white" : "bg-softspot-50"}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className="p-2 bg-white rounded-full border">
          {icon}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm">{notification.message}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs px-2 h-7"
                  onClick={() => onMarkRead(notification.id)}
                >
                  Mark read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs px-2 h-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(notification.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
