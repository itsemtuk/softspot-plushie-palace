
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from 'react-router-dom';
import { WishlistManager } from "@/components/profile/WishlistManager";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useUser } from "@clerk/clerk-react";

interface WishlistItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
}

const WishlistPage = () => {
  const isMobile = useIsMobile();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Wishlist>({
    id: 'default',
    name: 'My Wishlist',
    items: [],
  });

  useEffect(() => {
    // Wait for user to load first
    if (!isLoaded) return;
    
    // Simulate loading wishlist data
    const loadWishlist = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, load some sample data
      const sampleItems = [
        {
          id: '1',
          name: 'Jellycat Bartholomew Bear',
          imageUrl: '/assets/plushies/jellycat-bear.jpg',
          price: 30
        },
        {
          id: '2',
          name: 'Squishmallow Archie',
          imageUrl: '/assets/plushies/archie-squishmallow.jpg',
          price: 20
        },
      ];
      
      setWishlist(prev => ({ ...prev, items: sampleItems }));
      setIsLoading(false);
    };

    loadWishlist();
  }, [isLoaded]);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlist(prevWishlist => ({
      ...prevWishlist,
      items: prevWishlist.items.filter(item => item.id !== itemId)
    }));
  };

  // Show loading while Clerk is initializing
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {isMobile ? <MobileNav /> : <Navbar />}
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="py-20" />
        </main>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {isMobile ? <MobileNav /> : <Navbar />}
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sign in to view your wishlist</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create an account to save your favorite plushies!
            </p>
            <Link to="/sign-in">
              <Button className="bg-softspot-500 hover:bg-softspot-600 text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Here are the plushies you're dreaming of.</p>
        </div>
        
        {wishlist.items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start browsing and add plushies you love to your wishlist!
            </p>
            <Link to="/marketplace">
              <Button className="bg-softspot-500 hover:bg-softspot-600 text-white">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.items.map(item => (
              <Card key={item.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">${item.price.toFixed(2)}</span>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Remove
                      </Button>
                      <Link to="/checkout">
                        <Button size="sm" className="bg-softspot-500 hover:bg-softspot-600 text-white">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <WishlistManager />
      </main>
    </div>
  );
};

export default WishlistPage;
