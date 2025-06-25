
import { useLocation, Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogIn, Bell, Bookmark, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { MobileNotifications } from "./MobileNotifications";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function TopNav() {
  const isSignedIn = isAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
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

  const navigationItems = [
    { label: "Home", path: "/", icon: "🏠" },
    { label: "Feed", path: "/feed", auth: true, icon: "📰" },
    { label: "Marketplace", path: "/marketplace", icon: "🛍️" },
    { label: "Users", path: "/users", icon: "👥" },
    { label: "About", path: "/about", icon: "ℹ️" },
  ];
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-softspot-100 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <button onClick={handleLogoClick} className="flex items-center">
            <Logo />
          </button>
          
          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Navigation
                </h2>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className="justify-start h-12 text-left"
                    onClick={() => {
                      if (item.auth && !isSignedIn) {
                        handleAuthRequiredAction("access this page", item.path);
                      } else {
                        navigate(item.path);
                      }
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
                
                {isSignedIn && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Account
                      </h3>
                      <Button
                        variant="ghost"
                        className="justify-start h-12 text-left w-full"
                        onClick={() => {
                          navigate("/profile");
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className="mr-3 text-lg">👤</span>
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start h-12 text-left w-full"
                        onClick={() => {
                          navigate("/settings");
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className="mr-3 text-lg">⚙️</span>
                        Settings
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isSignedIn ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleAuthRequiredAction("access messages", "/messages")}
                className="hidden sm:flex"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleAuthRequiredAction("view wishlist", "/wishlist")}
                className="hidden sm:flex"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <MobileNotifications />
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
