
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPlushies } from "@/components/FeaturedPlushies";
import { MarketplacePreview } from "@/components/MarketplacePreview";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/Footer";

const Index = () => {
  const isMobile = useIsMobile();
  const isSignedIn = !!localStorage.getItem('currentUserId');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <Hero />
        <FeaturedPlushies />
        <MarketplacePreview />
        
        {/* Mobile sign-in CTA for non-authenticated users */}
        {isMobile && !isSignedIn && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-softspot-100 dark:border-gray-700 py-4 px-6 flex justify-center z-40 pb-safe transition-colors duration-200">
            <Link to="/sign-in" className="w-full">
              <Button className="w-full bg-softspot-400 hover:bg-softspot-500 text-white">
                Sign in to create content
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
