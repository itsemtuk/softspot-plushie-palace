
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-softspot-50 to-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Your soft spot</span>
              <span className="block text-softspot-500">for plushies</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Discover your perfect cuddly companion on SoftSpot. Connect with like-minded individuals, share your collection, and find your new favorite fuzzy friend.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <Link to="/feed">
                <Button className="px-6 py-6 text-lg bg-softspot-400 hover:bg-softspot-500 text-white">
                  Explore plushies <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="ml-4 px-6 py-6 text-lg text-softspot-500 border-softspot-200 hover:bg-softspot-50">
                  Browse marketplace
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg overflow-hidden">
              <div className="relative flex space-x-4">
                <div className="w-1/2 space-y-4">
                  <div className="h-40 bg-softspot-200 rounded-lg overflow-hidden plushie-shadow animate-float">
                    <img src="https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&q=80&w=1972" alt="Teddy Bear" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-56 bg-softspot-100 rounded-lg overflow-hidden plushie-shadow animate-bounce-slow" style={{ animationDelay: "0.5s" }}>
                    <img src="https://images.unsplash.com/photo-1535982368253-05d640fe0755?auto=format&fit=crop&q=80&w=1974" alt="Elephant Plushie" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="w-1/2 space-y-4 mt-8">
                  <div className="h-56 bg-softspot-100 rounded-lg overflow-hidden plushie-shadow animate-bounce-slow" style={{ animationDelay: "1s" }}>
                    <img src="https://images.unsplash.com/photo-1559454403-b8fb88521729?auto=format&fit=crop&q=80&w=1973" alt="Panda Plushie" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-40 bg-softspot-200 rounded-lg overflow-hidden plushie-shadow animate-float" style={{ animationDelay: "0.25s" }}>
                    <img src="https://images.unsplash.com/photo-1584155828260-3f126cfcfb45?auto=format&fit=crop&q=80&w=1974" alt="Unicorn Plushie" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
