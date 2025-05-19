
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { ThumbsUp } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    setTimeout(() => {
      // Empty array for now - we'll show the empty state
      setNotifications([]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="p-8 bg-white">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <ThumbsUp className="h-12 w-12 text-softspot-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
          <p className="text-gray-500 max-w-md">
            You have no new notifications. We'll let you know when something important happens with your account or content.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <ScrollArea className="h-[400px] p-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 mb-2 rounded-lg border ${
              notification.read ? "bg-white" : "bg-blue-50"
            }`}
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{notification.title}</h3>
              <span className="text-xs text-gray-500">{notification.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};

export default NotificationsTab;
