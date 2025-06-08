
import { Link } from "react-router-dom";
import { UserMenu } from "./navigation/UserMenu";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/utils/auth/authState";

export const Navbar = () => {
  const isMobile = useIsMobile();
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsSignedIn(isAuthenticated());
    };
    
    checkAuthStatus();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('auth-state-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('auth-state-change', handleAuthChange);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-softspot-600 dark:text-softspot-400">SoftSpot</span>
          <div className="h-6 w-6 rounded-full bg-softspot-200 dark:bg-softspot-800 flex items-center justify-center">
            <span className="text-sm">🧸</span>
          </div>
        </Link>
        
        {!isMobile && (
          <div className="ml-8 flex space-x-6">
            <Link 
              to="/feed" 
              className="text-gray-600 dark:text-gray-300 hover:text-softspot-600 dark:hover:text-softspot-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Feed
            </Link>
            <Link 
              to="/discover" 
              className="text-gray-600 dark:text-gray-300 hover:text-softspot-600 dark:hover:text-softspot-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Discover
            </Link>
            <Link 
              to="/marketplace" 
              className="text-gray-600 dark:text-gray-300 hover:text-softspot-600 dark:hover:text-softspot-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              Marketplace
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isSignedIn ? (
          <UserMenu />
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/sign-in">
              <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
