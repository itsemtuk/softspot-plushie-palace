
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { MobileNotifications } from "./MobileNotifications";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export function TopNav() {
  const isSignedIn = !!localStorage.getItem('currentUserId');
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-softspot-100">
      <div className="flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-2">
          {isSignedIn && (
            <>
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <MobileNotifications />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
