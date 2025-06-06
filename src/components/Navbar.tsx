
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserMenu } from "./navigation/UserMenu";
import { SearchBar } from "./navigation/SearchBar";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useCreatePost } from "@/hooks/use-create-post";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { setIsPostCreationOpen } = useCreatePost();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleCreateClick = () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    setIsPostCreationOpen(true);
  };

  // Single create button component to avoid duplication
  const CreateButton = ({ className = "", isFullWidth = false }: { className?: string; isFullWidth?: boolean }) => (
    <Button 
      onClick={handleCreateClick}
      className={`bg-softspot-500 hover:bg-softspot-600 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 ${isFullWidth ? 'w-full' : ''} ${className}`}
      size="sm"
    >
      <PlusCircle className="h-4 w-4 mr-2" />
      Create
    </Button>
  );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center font-bold text-xl text-softspot-500 dark:text-softspot-400">
          SoftSpot
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Navigation Links (Desktop Only) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/feed" className="hover:text-softspot-500 dark:hover:text-softspot-400 transition-colors text-gray-700 dark:text-gray-300">
            Feed
          </Link>
          <Link to="/discover" className="hover:text-softspot-500 dark:hover:text-softspot-400 transition-colors text-gray-700 dark:text-gray-300">
            Discover
          </Link>
          <Link to="/marketplace" className="hover:text-softspot-500 dark:hover:text-softspot-400 transition-colors text-gray-700 dark:text-gray-300">
            Marketplace
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Switch */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>

          {/* Create Button - Desktop Only */}
          {user && (
            <div className="hidden md:block">
              <CreateButton />
            </div>
          )}
          
          <UserMenu />
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-64 bg-white dark:bg-gray-900">
                <SheetHeader>
                  <SheetTitle className="text-gray-900 dark:text-white">Menu</SheetTitle>
                  <SheetDescription className="text-gray-600 dark:text-gray-400">
                    Explore SoftSpot
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {/* Mobile Search */}
                  <div className="md:hidden">
                    <SearchBar />
                  </div>
                  
                  <Link to="/feed" className="hover:text-softspot-500 dark:hover:text-softspot-400 block py-2 text-gray-700 dark:text-gray-300">
                    Feed
                  </Link>
                  <Link to="/discover" className="hover:text-softspot-500 dark:hover:text-softspot-400 block py-2 text-gray-700 dark:text-gray-300">
                    Discover
                  </Link>
                  <Link to="/marketplace" className="hover:text-softspot-500 dark:hover:text-softspot-400 block py-2 text-gray-700 dark:text-gray-300">
                    Marketplace
                  </Link>
                  
                  {/* Create Button for Mobile */}
                  {user && (
                    <div className="py-2">
                      <CreateButton isFullWidth={true} />
                    </div>
                  )}
                  
                  {/* Dark Mode Switch in Mobile Menu */}
                  <div className="flex items-center space-x-2 py-2">
                    <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeChange}
                    />
                    <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};
