
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlushieCard } from "@/components/PlushieCard";
import { featuredPlushies } from "@/data/plushies";

export function FeaturedPlushies() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Plushies</h2>
          <Link to="/feed">
            <Button variant="outline" className="text-softspot-500 border-softspot-200 hover:bg-softspot-50">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlushies.map((plushie) => (
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
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedPlushies;
