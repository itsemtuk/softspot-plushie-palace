
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/types/marketplace';

// Sample notifications data
const initialNotifications: Notification[] = [
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
  }
];

// Define the context type
interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

// Create the context with a default value
const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {}
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // In a real app, we would fetch notifications from an API here
  useEffect(() => {
    // Fetch notifications logic would go here
    // For now we're using the initialNotifications
  }, []);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Create a custom hook to use the notifications context
export const useNotifications = () => useContext(NotificationsContext);
