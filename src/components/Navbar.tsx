import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Logo } from "@/components/navigation/Logo";
import { NavLinks } from "@/components/navigation/NavLinks";
import { SearchBar } from "@/components/navigation/SearchBar";
import { UserMenu } from "@/components/navigation/UserMenu";
import { ConnectionStatusIndicator } from "@/components/ui/connection-status";
import { isAuthenticated } from "@/utils/auth/authState";
import { OfflineNotification } from "@/components/ui/offline-notification";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(isAuthenticated());

  // Update auth status whenever it changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      console.log("Navbar: Auth status checked:", authStatus);
      setIsSignedIn(authStatus);
    };
    
    // Check on mount
    checkAuthStatus();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'currentUserId' || e.key === 'authStatus') {
        checkAuthStatus();
      }
    });
    
    // Check auth status periodically (every 5 seconds)
    const intervalId = setInterval(checkAuthStatus, 5000);
    
    return () => {
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      clearInterval(intervalId);
    };
  }, []);

  // Handle post creation
  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    console.log("New post created:", postData);
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    return Promise.resolve();
  };

  if (isMobile) {
    return <MobileNav />;
  }

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-softspot-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavLinks />
              <SearchBar />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Enhanced offline notification */}
      <OfflineNotification />
      
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </>
  );
}

export default Navbar;
