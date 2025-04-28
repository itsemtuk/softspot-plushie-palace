import React from 'react';
import { Navbar } from "@/components/Navbar";
import WishlistManager from "@/components/profile/WishlistManager";

const WishlistPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlists</h1>
        <WishlistManager />
      </main>
    </div>
  );
};

export default WishlistPage;
