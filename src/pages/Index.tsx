
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPlushies } from "@/components/FeaturedPlushies";
import { MarketplacePreview } from "@/components/MarketplacePreview";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const isSignedIn = !!localStorage.getItem('currentUserId');

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedPlushies />
        <MarketplacePreview />
        
        {/* Mobile sign-in CTA for non-authenticated users */}
        {isMobile && !isSignedIn && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-softspot-100 py-4 px-6 flex justify-center z-40 pb-safe">
            <Link to="/sign-in" className="w-full">
              <Button className="w-full bg-softspot-400 hover:bg-softspot-500 text-white">
                Sign in to create content
              </Button>
            </Link>
          </div>
        )}
        
        <footer className="bg-softspot-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">SoftSpot</h3>
              <p className="text-softspot-200">Your soft spot for plushies</p>
              <p className="mt-8 text-softspot-300 text-sm">© 2025 SoftSpot. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
