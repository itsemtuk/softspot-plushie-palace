import React, { createContext, useContext, useState } from "react";

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;  // Changed from isRead to read to match usage
  type?: "info" | "success" | "warning" | "error";
}

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};
