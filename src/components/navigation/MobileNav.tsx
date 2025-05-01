
import { TopNav } from "./mobile/TopNav";
import { BottomNav } from "./mobile/BottomNav";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function MobileNav() {
  const location = useLocation();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isHomepage = location.pathname === '/';
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';
  
  // Check auth status and update when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUserId = localStorage.getItem('currentUserId');
      setIsSignedIn(!!currentUserId);
    };
    
    checkAuthStatus();
    
    // Set up storage event listener to detect auth changes in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUserId') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);
  
  // Hide bottom nav on homepage for non-authenticated users and on auth pages
  const shouldShowBottomNav = !(isAuthPage || (isHomepage && !isSignedIn));

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
