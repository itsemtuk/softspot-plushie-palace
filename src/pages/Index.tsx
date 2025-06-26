
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
          const { useUser } = await import('@clerk/clerk-react');
          // We can't use hooks conditionally, so we'll use a different approach
          // For now, assume not signed in when Clerk is available but we can't check
          setIsSignedIn(false);
        } catch (error) {
          console.error('Error checking Clerk auth:', error);
          setIsSignedIn(false);
        }
      } else {
        // When Clerk is not available, check localStorage for auth status
        const authStatus = localStorage.getItem('authStatus');
        setIsSignedIn(authStatus === 'authenticated');
      }
      setIsLoaded(true);
    };

    checkAuthStatus();
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
