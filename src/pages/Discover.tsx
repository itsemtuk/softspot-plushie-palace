
import MainLayout from "@/components/layout/MainLayout";
import { SearchSystem } from "@/components/search/SearchSystem";
import { FeaturedPlushies } from "@/components/FeaturedPlushies";
import { TrendingCarousel } from "@/components/marketplace/TrendingCarousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Star } from "lucide-react";

const Discover = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-softspot-100 dark:bg-softspot-900/20 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-softspot-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Discover Amazing Plushies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find your next cuddly companion from our community of plushie lovers
          </p>
        </div>
        
        {/* Search System */}
        <div className="mb-12">
          <SearchSystem />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link to="/marketplace" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 group-hover:border-softspot-300">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-softspot-500 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Trending Now</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Discover what's popular in the marketplace</p>
            </div>
          </Link>
          
          <Link to="/marketplace?featured=new" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 group-hover:border-softspot-300">
              <div className="flex items-center mb-3">
                <Star className="h-5 w-5 text-softspot-500 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">New Arrivals</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Check out the latest plushies added</p>
            </div>
          </Link>
          
          <Link to="/marketplace/sell" className="group">
            <div className="bg-softspot-50 dark:bg-softspot-900/20 rounded-lg p-6 border border-softspot-200 dark:border-softspot-700 hover:shadow-lg transition-all duration-200 group-hover:border-softspot-300">
              <div className="flex items-center mb-3">
                <Sparkles className="h-5 w-5 text-softspot-500 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sell Yours</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">List your plushies for sale or trade</p>
            </div>
          </Link>
        </div>

        {/* Featured Content */}
        <FeaturedPlushies />
      </div>
    </MainLayout>
  );
};

export default Discover;
