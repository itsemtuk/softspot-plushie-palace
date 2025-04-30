
import { TopNav } from "./mobile/TopNav";
import { BottomNav } from "./mobile/BottomNav";
import { useLocation } from "react-router-dom";

export function MobileNav() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const isSignedIn = !!localStorage.getItem('currentUserId');
  
  // Hide bottom nav on homepage for non-authenticated users
  const shouldShowBottomNav = !(isHomepage && !isSignedIn);

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
