import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ChevronDown,
  PawPrint
} from "lucide-react";

interface MarketplaceNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MarketplaceNav({ selectedCategory, onCategoryChange }: MarketplaceNavProps) {
  const brands = [
    { id: "build-a-bear", name: "Build-A-Bear Workshop" },
    { id: "squishmallows", name: "Squishmallows" },
    { id: "jellycat", name: "Jellycat" },
    { id: "gund", name: "GUND" },
    { id: "ty", name: "Ty" },
  ];
  
  const species = [
    { id: "bear", name: "Bears" },
    { id: "cat", name: "Cats" },
    { id: "dog", name: "Dogs" },
    { id: "rabbit", name: "Rabbits" },
    { id: "dragon", name: "Dragons" },
    { id: "unicorn", name: "Unicorns" },
  ];

  // Helper to determine if a category button should have active styling
  const isActive = (category: string) => selectedCategory === category;

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center h-12 space-x-8">
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
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-2 p-4">
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
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 w-[400px] gap-2 p-4">
                    {brands.map(brand => (
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
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 w-[400px] gap-2 p-4">
                    {species.map(animal => (
                      <Button 
                        key={animal.id}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => onCategoryChange(animal.id)}
                      >
                        {animal.name}
                      </Button>
                    ))}
                    <Link to="/animals" className="block p-2 hover:bg-gray-50 rounded-md col-span-2 text-softspot-500 font-medium">
                      View all animals →
                    </Link>
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
        
        <div className="flex lg:hidden items-center h-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-screen max-w-xs">
              <DropdownMenuItem 
                className={isActive("all") ? "bg-softspot-100" : ""}
                onClick={() => onCategoryChange("all")}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <Store className="w-4 h-4" />
                  <span>Shop All</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs text-gray-500">Featured</div>
              <DropdownMenuItem asChild>
                <Link to="/marketplace?featured=new">New Arrivals</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/marketplace?featured=trending">Trending</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/marketplace?featured=limited">Limited Editions</Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs text-gray-500">Brands</div>
              {brands.map(brand => (
                <DropdownMenuItem key={brand.id} asChild>
                  <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs text-gray-500">Animals</div>
              {species.map(animal => (
                <DropdownMenuItem 
                  key={animal.id} 
                  className={isActive(animal.id) ? "bg-softspot-100" : ""}
                  onClick={() => onCategoryChange(animal.id)}
                >
                  {animal.name}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/marketplace?sale=true" className="text-red-500">Sale Items</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceNav;
