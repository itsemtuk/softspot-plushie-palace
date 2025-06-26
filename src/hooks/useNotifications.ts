
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'mention';
  title: string;
  message: string;
  read: boolean;
  data: any;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      // Get user's Supabase ID first
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .maybeSingle();

      if (!userData) return;

      // Since notifications table might not be in types yet, use raw SQL or fallback
      // For now, let's create mock notifications based on follows and other activities
      const mockNotifications: Notification[] = [];
      
      // Check for recent follows as notifications
      const { data: recentFollows } = await supabase
        .from('followers')
        .select(`
          id,
          created_at,
          follower_id,
          users!followers_follower_id_fkey(username, avatar_url)
        `)
        .eq('following_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentFollows) {
        recentFollows.forEach((follow: any) => {
          const followerUsername = follow.users?.username || 'Someone';
          mockNotifications.push({
            id: `follow_${follow.id}`,
            type: 'follow',
            title: 'New Follower',
            message: `${followerUsername} started following you`,
            read: false,
            data: { follower_id: follow.follower_id },
            created_at: follow.created_at
          });
        });
      }

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // In a real implementation, this would update the database
      // For now, we'll just store in localStorage as fallback
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      readNotifications.push(notificationId);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark notification as read'
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      // Update all notifications to read
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      // Store all as read in localStorage
      const allIds = notifications.map(n => n.id);
      localStorage.setItem('readNotifications', JSON.stringify(allIds));

      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark all notifications as read'
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      
      // Set up real-time subscription for followers (as notification source)
      const channel = supabase
        .channel('user_notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'followers'
        }, () => {
          fetchNotifications();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  // Load read status from localStorage
  useEffect(() => {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    setNotifications(prev => 
      prev.map(n => ({
        ...n,
        read: readNotifications.includes(n.id)
      }))
    );
  }, [notifications.length]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
