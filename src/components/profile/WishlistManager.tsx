import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ShoppingBag } from "lucide-react";

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

interface WishlistManagerProps {
  // Remove wishlist prop as it should be managed internally
}

export const WishlistManager = ({}: WishlistManagerProps) => {
  const [wishlist, setWishlist] = useState<Wishlist>({
    id: 'default-wishlist',
    name: 'My Wishlist',
    items: []
  });

  useEffect(() => {
    // Load wishlist from localStorage or database here
    // For now, let's initialize with some dummy data
    setWishlist({
      id: 'default-wishlist',
      name: 'My Wishlist',
      items: [
        {
          id: 'plushie-1',
          name: 'Cute Plushie',
          imageUrl: '/placeholder.svg',
          price: 25
        },
        {
          id: 'plushie-2',
          name: 'Fluffy Bear',
          imageUrl: '/placeholder.svg',
          price: 30
        }
      ]
    });
  }, []);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlist(prevWishlist => ({
      ...prevWishlist,
      items: prevWishlist.items.filter(item => item.id !== itemId)
    }));
    toast({
      title: "Item removed",
      description: "Item removed from wishlist."
    });
  };

  const handleMoveToCart = (item: WishlistItem) => {
    // Implement logic to move item to cart
    toast({
      title: "Item moved to cart",
      description: `${item.name} moved to cart.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        {wishlist.items.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="grid gap-4">
            {wishlist.items.map(item => (
              <div key={item.id} className="flex items-center justify-between border rounded-md p-4">
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-500">${item.price}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleMoveToCart(item)}>
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveFromWishlist(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
