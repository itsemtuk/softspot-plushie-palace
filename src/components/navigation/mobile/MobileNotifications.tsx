
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
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
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
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-softspot-500 mx-auto"></div>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                  !notification.read ? 'bg-softspot-50 dark:bg-softspot-900/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-softspot-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                We'll notify you when something happens!
              </p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              className="w-full text-softspot-500 text-sm"
              onClick={handleClick}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
