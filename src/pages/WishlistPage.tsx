
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import WishlistManager from "@/components/profile/WishlistManager";
import { Wishlist } from "@/types/marketplace";
import { useUser } from "@clerk/clerk-react";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const { user } = useUser();
  
  // Initialize an empty wishlist if none exists
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch the wishlist from an API or local storage
      // For now, we'll create a default empty wishlist
      const defaultWishlist: Wishlist = {
        id: "default-wishlist",
        name: "My Wishlist",
        items: [],
        privacy: "public",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        isPublic: true
      };
      
      setWishlist([defaultWishlist]);
    }
  }, [user]);
  
  const handleUpdateWishlist = (updatedWishlist: Wishlist[]) => {
    setWishlist(updatedWishlist);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlists</h1>
        <WishlistManager wishlist={wishlist} onUpdateWishlist={handleUpdateWishlist} />
      </main>
    </div>
  );
};

export default WishlistPage;
