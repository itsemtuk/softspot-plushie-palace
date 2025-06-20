
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogIn, Bell, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { MobileNotifications } from "./MobileNotifications";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function TopNav() {
  const isSignedIn = isAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === '/';
  const isSignInPage = location.pathname === '/sign-in';
  
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
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-softspot-100 dark:bg-gray-800/80 dark:border-gray-700">
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
          <ThemeToggle />
          {isSignedIn && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleAuthRequiredAction("access messages", "/messages")}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleAuthRequiredAction("view wishlist", "/wishlist")}
              >
                <Bookmark className="h-5 w-5" />
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
