
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserButton } from "./UserButton";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { CreateButton } from "./CreateButton";
import { isAuthenticated } from "@/utils/auth/authState";

export const UserMenu = () => {
  const { isSignedIn } = useUser();
  const authenticated = isAuthenticated();

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
      <NotificationsDropdown />
      <UserButton />
    </div>
  );
};
