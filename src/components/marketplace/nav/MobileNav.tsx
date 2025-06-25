
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Store, Search, ChevronDown, X, ShoppingBag, Tag } from "lucide-react";
import { brandData, speciesData } from "./data";

interface MobileNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MobileNav({ selectedCategory, onCategoryChange }: MobileNavProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const isActive = (category: string) => selectedCategory === category;

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsMenuOpen(false);
  };

  const navigateToSellItem = () => {
    navigate("/marketplace/sell");
    setIsMenuOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between h-12 px-2">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 text-xs h-8 px-2">
              <Store className="w-3 h-3" />
              <span className="text-xs">Menu</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader className="flex flex-row items-center justify-between border-b pb-2">
              <SheetTitle className="text-base">Categories</SheetTitle>
              <SheetClose className="rounded-full h-6 w-6 flex items-center justify-center">
                <X className="h-3 w-3" />
              </SheetClose>
            </SheetHeader>
            
            <div className="py-3 space-y-2 max-h-[65vh] overflow-y-auto">
              <Button 
                variant={isActive("all") ? "default" : "ghost"}
                className={`w-full justify-start text-xs h-8 ${isActive("all") ? "bg-softspot-500" : ""}`}
                onClick={() => handleCategorySelect("all")}
              >
                <ShoppingBag className="mr-2 h-3 w-3" />
                All Items
              </Button>
              
              <div className="border-t pt-2">
                <h3 className="text-xs font-medium text-gray-500 mb-2 px-2">Animals</h3>
                <div className="grid grid-cols-2 gap-1">
                  {speciesData.slice(0, 6).map(animal => (
                    <Button 
                      key={animal.id} 
                      variant={isActive(animal.id) ? "default" : "outline"}
                      className={`justify-start h-7 py-1 px-2 text-xs ${isActive(animal.id) ? "bg-softspot-500" : ""}`}
                      onClick={() => handleCategorySelect(animal.id)}
                    >
                      {animal.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-2">
                <h3 className="text-xs font-medium text-gray-500 mb-2 px-2">Brands</h3>
                <div className="grid grid-cols-2 gap-1">
                  {brandData.slice(0, 4).map(brand => (
                    <Button 
                      key={brand.id} 
                      variant="outline" 
                      asChild
                      className="justify-start h-7 py-1 px-2 text-xs"
                    >
                      <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-2 mt-3">
                <Button 
                  className="w-full bg-softspot-500 hover:bg-softspot-600 text-xs h-8"
                  onClick={navigateToSellItem}
                >
                  <Tag className="mr-2 h-3 w-3" /> 
                  Sell Item
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="h-8 w-8"
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {isSearchVisible && (
        <div className="p-2 border-t">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 text-xs border rounded-full focus:outline-none focus:ring-1 focus:ring-softspot-300 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
