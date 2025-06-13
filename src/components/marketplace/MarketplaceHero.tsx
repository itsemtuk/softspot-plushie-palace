
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Package, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/hooks/use-toast";

export function MarketplaceHero() {
  const navigate = useNavigate();

  const handleSellClick = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell items."
      });
      navigate('/sign-in');
      return;
    }
    navigate('/sell');
  };

  const stats = [
    { icon: Users, label: "Active Sellers", value: "2,500+" },
    { icon: Package, label: "Listed Items", value: "15,000+" },
    { icon: TrendingUp, label: "Sold This Month", value: "850+" },
    { icon: Star, label: "Average Rating", value: "4.9" }
  ];

  return (
    <div className="bg-gradient-to-r from-softspot-500 to-purple-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            SoftSpot Marketplace
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            The world's largest community for plushie enthusiasts
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleSellClick}
              size="lg"
              className="bg-white text-softspot-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Start Selling Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-softspot-600 px-8 py-3"
            >
              Browse Collection
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur border-white/20 text-center p-4">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-white" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
