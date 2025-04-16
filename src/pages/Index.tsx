
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPlushies } from "@/components/FeaturedPlushies";
import { MarketplacePreview } from "@/components/MarketplacePreview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedPlushies />
        <MarketplacePreview />
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
