
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserButton } from "./UserButton";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { CreateButton } from "./CreateButton";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { isAuthenticated } from "@/utils/auth/authState";

export const UserMenu = () => {
  const { isSignedIn } = useUser();
  const authenticated = isAuthenticated();
  const { theme, setTheme } = useTheme();

  if (!isSignedIn && !authenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/sign-in">
          <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Sign In
          </Button>
        </Link>
        <Link to="/sign-up">
          <Button className="bg-softspot-500 hover:bg-softspot-600 text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <CreateButton />
      
      {/* Messages Button */}
      <Link to="/messages">
        <Button variant="ghost" size="icon" title="Messages">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </Link>
      
      <NotificationsDropdown />
      
      {/* Dark Mode Switch */}
      <div className="flex items-center space-x-1">
        <Sun className="h-4 w-4" />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <Moon className="h-4 w-4" />
      </div>
      
      <UserButton />
    </div>
  );
};
