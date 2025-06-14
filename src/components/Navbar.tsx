
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNav } from "./navigation/MobileNav";
import { UserMenu } from "./navigation/UserMenu";
import { SearchBar } from "./navigation/SearchBar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavLinks } from "./navigation/NavLinks";

export const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-gray-900 dark:text-gray-100">
          SoftSpot
        </Link>

        {/* Mobile Navigation */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-64 bg-white dark:bg-gray-800">
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</SheetTitle>
                <SheetDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Explore SoftSpot
                </SheetDescription>
              </SheetHeader>
              <MobileNav />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation Links */}
            <NavLinks />
            
            {/* Search Bar */}
            <SearchBar />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu (includes notifications) */}
            <UserMenu />
          </div>
        )}
      </div>
    </div>
  );
};
