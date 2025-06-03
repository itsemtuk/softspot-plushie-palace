
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Star, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

export const MarketplaceHeader = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSellClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell your plushies."
      });
      navigate('/sign-in');
      return;
    }
    navigate('/sell');
  };

  return (
    <div className="bg-gradient-to-r from-softspot-500 to-softspot-600 text-white py-12 rounded-2xl mb-8 mx-4">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">SoftSpot Marketplace</h1>
            <p className="text-lg opacity-90 mb-4">
              Discover, collect, and trade amazing plushies from our community
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>10,000+ Members</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                <span>4.9 Rating</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Growing Daily</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button 
              onClick={handleSellClick}
              className="bg-white text-softspot-600 hover:bg-gray-50 rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Sell Your Plushie
            </Button>
            <p className="text-sm opacity-75 mt-2">List your items in minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
