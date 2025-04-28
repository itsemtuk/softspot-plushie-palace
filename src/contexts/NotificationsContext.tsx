import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from '@/types/marketplace';
import { formatTimeAgo } from '@/lib/utils';

// Create sample notifications for demonstration
const initialNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'like',
    content: 'Someone liked your post',
    read: false,
    timestamp: new Date().toISOString(),
    relatedUserId: 'user-2'
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'comment',
    content: 'Someone commented on your post',
    read: false,
    timestamp: new Date().toISOString(),
    relatedUserId: 'user-3'
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'follow',
    content: 'Someone started following you',
    read: true,
    timestamp: new Date().toISOString(),
    relatedUserId: 'user-4'
  }
];

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextProps => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
