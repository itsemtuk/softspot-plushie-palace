
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogIn, Bell, Bookmark, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { MobileNotifications } from "./MobileNotifications";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function TopNav() {
  const isSignedIn = isAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-softspot-100 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <button onClick={handleLogoClick}>
            <Logo />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isSignedIn ? (
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
              
              {/* Hamburger Menu for signed-in users */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-6">
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => handleNavigation("/feed")}
                    >
                      Feed
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => handleNavigation("/marketplace")}
                    >
                      Marketplace
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => handleNavigation("/profile")}
                    >
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => handleNavigation("/settings")}
                    >
                      Settings
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
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
