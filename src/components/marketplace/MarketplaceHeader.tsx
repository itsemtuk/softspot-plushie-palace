
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/hooks/use-toast";
import { CurrencySelector } from "./CurrencySelector";

interface MarketplaceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MarketplaceHeader({ searchQuery, onSearchChange }: MarketplaceHeaderProps) {
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

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search plushies..."
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CurrencySelector />
            <Button 
              onClick={handleSellClick}
              className="bg-softspot-500 hover:bg-softspot-600 text-white whitespace-nowrap"
            >
              Sell Your Plushie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
