
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: "info" | "success" | "warning" | "error";
  userAvatar?: string;
  username?: string;
  link?: string;
  content?: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

// Export the context so it can be imported elsewhere
export const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Safely access useUser with a try/catch to prevent errors
  let username = "Anonymous";
  let userId = "";
  let isLoaded = false;

  try {
    const userHook = useUser();
    const { user, isLoaded: clerkIsLoaded } = userHook || { user: null, isLoaded: false };
    isLoaded = clerkIsLoaded;
    
    useEffect(() => {
      if (isLoaded && user) {
        username = user.username || user.firstName || "Anonymous";
        userId = user.id;
        localStorage.setItem('currentUsername', username);
        localStorage.setItem('currentUserId', userId);
      }
    }, [user, isLoaded]);
  } catch (error) {
    console.warn("ClerkProvider not available, using fallback user data");
    // Fallback to localStorage if Clerk is not available
    username = localStorage.getItem('currentUsername') || "Anonymous";
    userId = localStorage.getItem('currentUserId') || "";
  }

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(7),
      read: false,
      ...notification,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead,
      markAllAsRead, 
      deleteNotification 
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
