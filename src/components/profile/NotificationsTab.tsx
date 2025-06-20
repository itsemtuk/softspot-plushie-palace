
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  user: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: 'PlushieLover23',
    content: 'liked your post',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: '2',
    type: 'follow',
    user: 'CuddlyCollector',
    content: 'started following you',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: '3',
    type: 'comment',
    user: 'SoftToyFan',
    content: 'commented on your post: "So cute!"',
    timestamp: '3 days ago',
    read: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'comment':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export default function NotificationsTab() {
  return (
    <div className="space-y-4">
      {mockNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No notifications yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            When someone likes or comments on your posts, you'll see it here.
          </p>
        </div>
      ) : (
        mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
              !notification.read
                ? 'bg-softspot-50 dark:bg-softspot-900/20 border-softspot-200 dark:border-softspot-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <span className="font-medium">{notification.user}</span> {notification.content}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {notification.timestamp}
              </p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-softspot-500 rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
