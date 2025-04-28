
import { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "message" | "system";
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  postId?: string;
}

export interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      message: "SoftSpotLover liked your post",
      timestamp: new Date().toISOString(),
      read: false,
      userId: "user-2",
      postId: "post-1"
    },
    {
      id: "2",
      type: "comment",
      message: "PlushieCollector commented on your post",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      userId: "user-3",
      postId: "post-1"
    },
    {
      id: "3",
      type: "follow",
      message: "JellycatFan started following you",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      userId: "user-4"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        addNotification, 
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
