import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./navigation/UserMenu";
import { PostCreationData } from "@/types/core";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "./ModeToggle";

export const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center font-bold text-xl text-softspot-500 dark:text-softspot-400">
          SoftSpot
        </Link>

        {/* Navigation Links (Hidden on Small Screens) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/discover" className="hover:text-softspot-500 dark:hover:text-softspot-400">
            Discover
          </Link>
          <Link to="/marketplace" className="hover:text-softspot-500 dark:hover:text-softspot-400">
            Marketplace
          </Link>
          <Link to="/community" className="hover:text-softspot-500 dark:hover:text-softspot-400">
            Community
          </Link>
        </div>

        {/* User Menu and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <UserMenu />
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger className="outline-none">
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
              <SheetContent side="right" className="w-full sm:w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Explore SoftSpot
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Link to="/discover" className="hover:text-softspot-500 dark:hover:text-softspot-400 block py-2">
                    Discover
                  </Link>
                  <Link to="/marketplace" className="hover:text-softspot-500 dark:hover:text-softspot-400 block py-2">
                    Marketplace
                  </Link>
                  <Link to="/community" className="hover:text-softspot-500 dark:hover:text-softspot-400 block py-2">
                    Community
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};
