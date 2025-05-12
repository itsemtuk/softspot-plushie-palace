
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
import { Store, Search, ChevronDown, X, ShoppingBag, Tag, Percent } from "lucide-react";
import { brandData, speciesData } from "./data";

interface MobileNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MobileNav({ selectedCategory, onCategoryChange }: MobileNavProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Helper to determine if a category button should have active styling
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
      <div className="flex items-center justify-between h-12">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span>Shop</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="flex flex-row items-center justify-between border-b pb-2">
              <SheetTitle className="text-xl">Shop Categories</SheetTitle>
              <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
                <X className="h-4 w-4" />
              </SheetClose>
            </SheetHeader>
            
            <div className="py-4 space-y-4">
              <Button 
                variant={isActive("all") ? "default" : "ghost"}
                className={`w-full justify-start ${isActive("all") ? "bg-softspot-500" : ""}`}
                onClick={() => handleCategorySelect("all")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop All
              </Button>
              
              <div className="border-t pt-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Featured</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild className="justify-start h-auto py-3">
                    <Link to="/marketplace?featured=new">New Arrivals</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto py-3">
                    <Link to="/marketplace?featured=trending">Trending</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto py-3">
                    <Link to="/marketplace?featured=limited">Limited Editions</Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start h-auto py-3 text-red-500">
                    <Link to="/marketplace?sale=true">Sale Items</Link>
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Animals</h3>
                <div className="grid grid-cols-2 gap-2">
                  {speciesData.map(animal => (
                    <Button 
                      key={animal.id} 
                      variant={isActive(animal.id) ? "default" : "outline"}
                      className={`justify-start h-auto py-3 ${isActive(animal.id) ? "bg-softspot-500" : ""}`}
                      onClick={() => handleCategorySelect(animal.id)}
                    >
                      {animal.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Brands</h3>
                <div className="grid grid-cols-2 gap-2">
                  {brandData.map(brand => (
                    <Button 
                      key={brand.id} 
                      variant="outline" 
                      asChild
                      className="justify-start h-auto py-3"
                    >
                      <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Button 
                  className="w-full bg-softspot-500 hover:bg-softspot-600"
                  onClick={navigateToSellItem}
                >
                  <Tag className="mr-2 h-4 w-4" /> 
                  Sell a Plushie
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(!isSearchVisible)}>
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {isSearchVisible && (
        <div className="p-2 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plushies..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-softspot-300 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
