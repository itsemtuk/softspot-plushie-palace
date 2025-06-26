
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Heart, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { WishlistItem } from "@/types/user";

const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    plushieId: "jellycat-bunny",
    userId: "user1",
    addedAt: "2024-01-15",
    title: "Jellycat Bashful Bunny",
    price: 25,
    description: "Soft and cuddly bunny plushie",
    imageUrl: "/placeholder.svg",
    priority: "high",
    status: "wanted",
    brand: "Jellycat"
  },
  {
    id: "2", 
    plushieId: "pokemon-pikachu",
    userId: "user1",
    addedAt: "2024-01-10",
    title: "Pokémon Pikachu Plush",
    price: 18,
    description: "Official Pokémon Center plushie",
    imageUrl: "/placeholder.svg",
    priority: "medium",
    status: "wanted",
    brand: "Pokémon"
  }
];

export default function MobileWishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading wishlist items
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist."
    });
  };

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
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              size="icon"
              className="bg-softspot-500 hover:bg-softspot-600 h-10 w-10"
              onClick={() => navigate('/marketplace')}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Start adding plushies you love to keep track of them!
              </p>
              <Button
                onClick={() => navigate('/marketplace')}
                className="bg-softspot-500 hover:bg-softspot-600"
              >
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromWishlist(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-softspot-600">
                            ${item.price}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority || 'medium')}`}>
                            {item.priority} priority
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-softspot-600 border-softspot-200 hover:bg-softspot-50"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}
