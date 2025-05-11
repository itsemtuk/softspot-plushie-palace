
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogIn, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { MobileNotifications } from "./MobileNotifications";

export function TopNav() {
  const isSignedIn = !!localStorage.getItem('currentUserId');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === '/';
  const isSignInPage = location.pathname === '/sign-in';
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-softspot-100">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          {isSignedIn ? (
            <Link to="/feed">
              <Logo />
            </Link>
          ) : (
            <Link to="/">
              <Logo />
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isSignedIn && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <MobileNotifications />
            </>
          )}
          
          {!isSignedIn && isHomepage && !isSignInPage && (
            <Link to="/sign-in">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
