
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogIn, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { MobileNotifications } from "./MobileNotifications";
import { MobileThemeToggle } from "@/components/ui/mobile-theme-toggle";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";

export function MobileTopNav() {
  const isSignedIn = isAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleAuthRequiredAction = (action: string, path: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}.`
      });
      navigate("/sign-in");
      return false;
    }
    
    navigate(path);
    return true;
  };

  const handleLogoClick = () => {
    if (isSignedIn) {
      navigate("/feed");
    } else {
      navigate("/");
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-softspot-100 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <button onClick={handleLogoClick} className="flex items-center">
            <Logo />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <MobileThemeToggle />
          
          {isSignedIn ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleAuthRequiredAction("access messages", "/messages")}
                className="h-9 w-9"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleAuthRequiredAction("view wishlist", "/wishlist")}
                className="h-9 w-9"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <MobileNotifications />
            </>
          ) : (
            <Link to="/sign-in">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
