
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, Bookmark, Search } from "lucide-react";

export const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  const links = [
    { name: "Feed", path: "/feed", icon: <Home className="h-4 w-4 mr-1.5" /> },
    { name: "Marketplace", path: "/marketplace", icon: <ShoppingBag className="h-4 w-4 mr-1.5" /> },
    { name: "Discover", path: "/discover", icon: <Search className="h-4 w-4 mr-1.5" /> },
  ];

  return (
    <nav className="flex items-center space-x-1">
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={cn(
            "flex items-center text-sm px-3 py-2 rounded-md",
            isActive(link.path)
              ? "bg-softspot-100 text-softspot-700 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
    </nav>
  );
};
