
import { Link } from "react-router-dom";
import { UserButton } from "./UserButton";
import { CreateButton } from "./CreateButton";
import { NotificationsButton } from "./NotificationsButton";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const NavLinksFixed = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Search Bar */}
      <SearchBar />
      
      {/* Navigation Links */}
      <Link
        to="/feed"
        className="text-gray-700 dark:text-gray-200 hover:text-softspot-600 dark:hover:text-softspot-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Feed
      </Link>
      <Link
        to="/marketplace"
        className="text-gray-700 dark:text-gray-200 hover:text-softspot-600 dark:hover:text-softspot-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Marketplace
      </Link>
      <Link
        to="/messages"
        className="text-gray-700 dark:text-gray-200 hover:text-softspot-600 dark:hover:text-softspot-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Messages
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <NotificationsButton />
        <ThemeToggle />
        <CreateButton />
        <UserButton />
      </div>
    </div>
  );
};
