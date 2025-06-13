
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Package, Heart, TrendingUp, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface MarketplaceNavigationProps {
  onFilterToggle: () => void;
}

export function MarketplaceNavigation({ onFilterToggle }: MarketplaceNavigationProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Items", count: "15,000+" },
    { id: "trending", label: "Trending", count: "850", icon: TrendingUp },
    { id: "new", label: "New Arrivals", count: "120" },
    { id: "sale", label: "On Sale", count: "340" },
  ];

  const brands = [
    { id: "jellycat", label: "Jellycat", path: "/marketplace/brands/jellycat" },
    { id: "squishmallows", label: "Squishmallows", path: "/marketplace/brands/squishmallows" },
    { id: "pokemon", label: "Pokemon", path: "/marketplace/brands/pokemon" },
    { id: "sanrio", label: "Sanrio", path: "/marketplace/brands/sanrio" },
    { id: "disney", label: "Disney", path: "/marketplace/brands/disney" },
    { id: "build-a-bear", label: "Build-a-Bear", path: "/marketplace/brands/build-a-bear" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Categories */}
          <div className="flex items-center space-x-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-softspot-100 text-softspot-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category.icon && <category.icon className="h-4 w-4" />}
                <span className="font-medium">{category.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Brands Dropdown */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Brands</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand.id}
                    onClick={() => navigate(brand.path)}
                    className="cursor-pointer"
                  >
                    {brand.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={onFilterToggle}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
