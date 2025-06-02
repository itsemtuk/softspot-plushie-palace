import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { Link } from 'react-router-dom';
import { WishlistManager } from "@/components/profile/WishlistManager";

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
  const [wishlist, setWishlist] = useState<Wishlist>({
    id: 'default',
    name: 'My Wishlist',
    items: [
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
    ],
  });

  useEffect(() => {
    // Load wishlist from local storage or database here
    // For now, we'll just use the default wishlist
  }, []);

  const handleCreateNewWishlist = () => {
    // Implement create new wishlist logic here
    alert('Create new wishlist');
  };

  const handleRenameWishlist = () => {
    // Implement rename wishlist logic here
    alert('Rename wishlist');
  };

  const handleDeleteWishlist = () => {
    // Implement delete wishlist logic here
    alert('Delete wishlist');
  };

  const handleMoveItemToAnotherWishlist = (itemId: string) => {
    // Implement move item to another wishlist logic here
    alert(`Move item ${itemId} to another wishlist`);
  };

  const handleShareWishlist = () => {
    // Implement share wishlist logic here
    alert('Share wishlist');
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlist(prevWishlist => ({
      ...prevWishlist,
      items: prevWishlist.items.filter(item => item.id !== itemId)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-gray-600">Here are the plushies you're dreaming of.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map(item => (
            <Card key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold text-gray-800">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">${item.price.toFixed(2)}</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleRemoveFromWishlist(item.id)}>
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
        
        <WishlistManager />
      </main>
    </div>
  );
};

export default WishlistPage;
