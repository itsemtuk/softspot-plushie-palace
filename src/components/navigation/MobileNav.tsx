
import { TopNav } from "./mobile/TopNav";
import { BottomNav } from "./mobile/BottomNav";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth/authState";

export function MobileNav() {
  const location = useLocation();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isHomepage = location.pathname === '/';
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';
  
  // Check auth status and update when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      setIsSignedIn(authStatus);
    };
    
    checkAuthStatus();
    
    // Set up storage event listener to detect auth changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUserId' || event.key === 'authStatus') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clerk-auth-change', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clerk-auth-change', checkAuthStatus);
    };
  }, [location.pathname]);
  
  // Hide bottom nav on homepage for non-authenticated users and on auth pages
  const shouldShowBottomNav = isSignedIn && !isAuthPage;

  return (
    <>
      <TopNav />
      {shouldShowBottomNav && <BottomNav />}
      {/* Spacers for fixed navbars */}
      <div className="h-16" /> {/* Top spacer */}
      {shouldShowBottomNav && <div className="h-16 pb-safe" />} {/* Bottom spacer with safe area padding for notched phones */}
    </>
  );
}
