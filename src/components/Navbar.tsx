
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
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

        {isMobile ? (
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu */}
            <UserMenu />
          </div>
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
