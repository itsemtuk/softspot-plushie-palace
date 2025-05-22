
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Package, 
  Tag, 
  Star, 
  PawPrint
} from "lucide-react";
import { brandData, speciesData } from "./data";

interface DesktopNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function DesktopNav({ selectedCategory, onCategoryChange }: DesktopNavProps) {
  // Helper to determine if a category button should have active styling
  const isActive = (category: string) => selectedCategory === category;

  return (
    <div className="hidden lg:flex items-center h-12 space-x-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button 
              variant={isActive("all") ? "default" : "ghost"} 
              className={`flex items-center gap-2 h-12 px-4 ${isActive("all") ? "bg-softspot-500 text-white" : ""}`}
              onClick={() => onCategoryChange("all")}
            >
              <Store className="w-4 h-4" />
              <span>Shop All</span>
            </Button>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-12 bg-transparent hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Featured</span>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="navigation-dropdown">
              <div className="grid w-[400px] gap-2 p-4 bg-white">
                <Link to="/marketplace?featured=new" className="block p-2 hover:bg-gray-50 rounded-md">
                  <div className="font-medium">New Arrivals</div>
                  <div className="text-sm text-muted-foreground">The latest plushies on SoftSpot</div>
                </Link>
                <Link to="/marketplace?featured=trending" className="block p-2 hover:bg-gray-50 rounded-md">
                  <div className="font-medium">Trending</div>
                  <div className="text-sm text-muted-foreground">Popular plushies this week</div>
                </Link>
                <Link to="/marketplace?featured=limited" className="block p-2 hover:bg-gray-50 rounded-md">
                  <div className="font-medium">Limited Editions</div>
                  <div className="text-sm text-muted-foreground">Rare and exclusive plushies</div>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-12 bg-transparent hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Brands</span>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="navigation-dropdown">
              <div className="grid grid-cols-2 w-[400px] gap-2 p-4 bg-white">
                {brandData.map(brand => (
                  <Link 
                    key={brand.id}
                    to={`/brand/${brand.id}`} 
                    className="block p-2 hover:bg-gray-50 rounded-md"
                  >
                    {brand.name}
                  </Link>
                ))}
                <Link to="/brands" className="block p-2 hover:bg-gray-50 rounded-md col-span-2 text-softspot-500 font-medium">
                  View all brands →
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-12 bg-transparent hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <PawPrint className="w-4 h-4" />
                <span>Animals</span>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="navigation-dropdown">
              <div className="grid grid-cols-2 w-[400px] gap-2 p-4 bg-white">
                {speciesData.map(animal => (
                  <Button 
                    key={animal.id}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => onCategoryChange(animal.id)}
                  >
                    {animal.name}
                  </Button>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/marketplace?sale=true">
              <Button variant="ghost" className="flex items-center gap-2 h-12 px-4 text-red-500">
                <Tag className="w-4 h-4" />
                <span>Sale</span>
              </Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default DesktopNav;
