
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPlushies } from "@/components/FeaturedPlushies";
import { MarketplacePreview } from "@/components/MarketplacePreview";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/Footer";
import { QuickActionsFAB } from "@/components/navigation/mobile/QuickActionsFAB";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth/authState";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if Clerk is available
  const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isClerkAvailable) {
        try {
          // Check if we're in a Clerk context
          const clerkInstance = (window as any).__clerk;
          if (clerkInstance && clerkInstance.user) {
            setIsSignedIn(true);
          } else {
            // Fall back to centralized auth state
            setIsSignedIn(isAuthenticated());
          }
        } catch (error) {
          console.error('Error checking Clerk auth, using fallback:', error);
          setIsSignedIn(isAuthenticated());
        }
      } else {
        // When Clerk is not available, check localStorage for auth status
        setIsSignedIn(isAuthenticated());
      }
      setIsLoaded(true);
    };

    checkAuthStatus();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('auth-state-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('auth-state-change', handleAuthChange);
    };
  }, [isClerkAvailable]);

  // Redirect signed-in mobile users to feed
  useEffect(() => {
    if (isLoaded && isSignedIn && isMobile) {
      navigate("/feed");
    }
  }, [isLoaded, isSignedIn, isMobile, navigate]);

  // Don't render anything for signed-in mobile users while redirecting
  if (isMobile && isSignedIn && isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Hero />
        <FeaturedPlushies />
        <MarketplacePreview />
        
        {/* Mobile sign-in CTA for non-authenticated users */}
        {isMobile && !isSignedIn && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-softspot-100 dark:border-gray-700 py-4 px-6 flex justify-center z-40 pb-safe transition-colors duration-200">
            <Link to="/sign-in" className="w-full">
              <Button className="w-full bg-softspot-400 hover:bg-softspot-500 text-white">
                Sign in to explore SoftSpot
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      {/* Quick Actions FAB for mobile users */}
      {isMobile && isSignedIn && <QuickActionsFAB />}
      
      <Footer />
    </div>
  );
};

export default Index;
