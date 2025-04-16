
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlushieCard } from "@/components/PlushieCard";
import { marketplacePlushies } from "@/data/plushies";

export function MarketplacePreview() {
  // Only show first 3 for preview
  const previewItems = marketplacePlushies.slice(0, 3);
  
  return (
    <section className="py-12 bg-gradient-to-b from-white to-softspot-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-softspot-100 rounded-full mb-4">
            <ShoppingBag className="h-6 w-6 text-softspot-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your New Cuddly Friend</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Our marketplace makes it easy to buy, sell, and trade pre-loved plushies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewItems.map((plushie) => (
            <PlushieCard 
              key={plushie.id}
              id={plushie.id}
              image={plushie.image}
              title={plushie.title}
              username={plushie.username}
              likes={plushie.likes}
              comments={plushie.comments}
              price={plushie.price}
              forSale={plushie.forSale}
              variant="marketplace"
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/marketplace">
            <Button className="px-6 py-6 bg-softspot-400 hover:bg-softspot-500 text-white">
              Explore marketplace <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MarketplacePreview;
