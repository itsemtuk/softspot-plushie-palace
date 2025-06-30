
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserButton } from "./UserButton";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { CreateButton } from "./CreateButton";
import { MessageSquare } from "lucide-react";
import { isAuthenticated } from "@/utils/auth/authState";

export const UserMenu = () => {
  const authenticated = isAuthenticated();
  const isClerkConfigured = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Check Clerk auth status if available and properly configured
  let isClerkSignedIn = false;
  if (isClerkConfigured) {
    try {
      // Check if Clerk is actually available in the window
      const clerkInstance = (window as any).__clerk;
      if (clerkInstance && clerkInstance.user) {
        isClerkSignedIn = true;
      }
    } catch (error) {
      console.warn('Clerk not available:', error);
      isClerkSignedIn = false;
    }
  }

  const isUserAuthenticated = isClerkSignedIn || authenticated;

  if (!isUserAuthenticated) {
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
      {/* Messages Button */}
      <Link to="/messages">
        <Button variant="ghost" size="icon" title="Messages">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </Link>
      
      <NotificationsDropdown />
      <CreateButton />
      <UserButton />
    </div>
  );
};
