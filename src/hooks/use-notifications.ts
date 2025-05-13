
import { useContext, useState, useEffect } from 'react';
import { NotificationsContext } from '@/contexts/NotificationsContext';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/components/ui/use-toast';

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};

// Custom hook for syncing notifications with Clerk
export const useClerkNotifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (user) {
      // Load notifications from Clerk metadata
      const loadNotifications = async () => {
        try {
          const userNotifications = user.unsafeMetadata?.notifications as any[] || [];
          setNotifications(userNotifications);
          
          // Calculate unread count
          const unread = userNotifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error("Error loading notifications:", error);
        }
      };
      
      loadNotifications();
    }
  }, [user]);
  
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      // Update local state
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
      
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Sync with Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive"
      });
    }
  };
  
  const markAllAsRead = async () => {
    if (!user || !notifications.length) return;
    
    try {
      // Update all notifications to read
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      // Sync with Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive"
      });
    }
  };
  
  const clearNotifications = async () => {
    if (!user) return;
    
    try {
      setNotifications([]);
      setUnreadCount(0);
      
      // Sync with Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: []
        }
      });
      
      toast({
        title: "Success",
        description: "All notifications cleared",
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast({
        title: "Error", 
        description: "Failed to clear notifications",
        variant: "destructive"
      });
    }
  };
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};
