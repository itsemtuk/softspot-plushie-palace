
import { useState } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/hooks/use-toast";

export function NotificationsDropdown() {
  const navigate = useNavigate();
  const [notifications] = useState<any[]>([]); // Empty notifications array
  const [unreadCount] = useState(0); // No unread notifications

  if (!isAuthenticated()) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          toast({
            title: "Authentication Required",
            description: "Please sign in to view notifications."
          });
          navigate("/sign-in");
        }}
      >
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          </div>
        </div>
        
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm mt-1">We'll notify you when something happens!</p>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="p-4 text-center">
          <span className="text-softspot-600 hover:text-softspot-700 font-medium">
            View all notifications
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
