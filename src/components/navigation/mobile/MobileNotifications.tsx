
import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: 'follow' | 'offer' | 'like' | 'comment';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

export function MobileNotifications() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getCurrentUserSupabaseId = async () => {
    if (!user?.id) return null;
    
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', user.id)
      .maybeSingle();
    
    return data?.id || null;
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated() || !user) return;
    
    try {
      setLoading(true);
      const supabaseUserId = await getCurrentUserSupabaseId();
      if (!supabaseUserId) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', supabaseUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const transformedNotifications: Notification[] = (data || []).map(notification => ({
        id: notification.id,
        type: notification.type as 'follow' | 'offer' | 'like' | 'comment',
        title: notification.title,
        message: notification.message,
        read: notification.read,
        created_at: notification.created_at,
        data: notification.data
      }));

      setNotifications(transformedNotifications);
      setUnreadCount(transformedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const supabaseUserId = await getCurrentUserSupabaseId();
      if (!supabaseUserId) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', supabaseUserId)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view notifications."
      });
      navigate("/sign-in");
      return;
    }
    
    navigate("/notifications");
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  useEffect(() => {
    if (user && isAuthenticated()) {
      fetchNotifications();
    }
  }, [user]);
  
  if (!isAuthenticated()) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleClick}
        className="relative h-9 w-9"
      >
        <Bell className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleClick}
      className="relative h-9 w-9"
    >
      {unreadCount > 0 ? (
        <BellDot className="h-5 w-5" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
      {unreadCount > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs min-w-[20px] rounded-full"
          variant="destructive"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
