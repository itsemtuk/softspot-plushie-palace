
import { useState, useEffect } from "react";
import { Heart, Search, Grid3X3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";

interface WishlistItem {
  id: string;
  title: string;
  brand: string;
  image: string;
  price?: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  dateAdded: string;
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    title: "Jellycat Bashful Bunny - Large",
    brand: "Jellycat",
    image: "/placeholder.svg",
    price: 45,
    priority: 'high',
    notes: "Birthday gift for myself",
    dateAdded: "2024-01-15"
  },
  {
    id: "2",
    title: "Squishmallow Axolotl - 16 inch",
    brand: "Squishmallows",
    image: "/placeholder.svg",
    price: 35,
    priority: 'medium',
    dateAdded: "2024-01-10"
  }
];

export default function MobileWishlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = wishlistItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-16 z-40">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-softspot-500" />
              My Wishlist
            </h1>
            <Button size="sm" className="bg-softspot-500 hover:bg-softspot-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="h-10 w-10"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in wishlist
            </p>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Start adding plushies you'd love to have!
              </p>
              <Button className="bg-softspot-500 hover:bg-softspot-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="p-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {item.brand}
                        </p>
                        {item.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-softspot-600">
                              ${item.price}
                            </span>
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {item.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {item.title}
                              </h3>
                              <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.brand}
                            </p>
                            {item.price && (
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-softspot-600">
                                  ${item.price}
                                </span>
                              </div>
                            )}
                            {item.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
