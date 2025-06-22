
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const NotificationsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto text-gray-400 mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                We'll notify you when something happens!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
