
import { Navbar } from "@/components/Navbar";
import WishlistManager from "@/components/profile/WishlistManager";

const WishlistPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Collections</h1>
          <p className="text-gray-600">Manage your wishlists and liked items</p>
        </div>
        
        <WishlistManager />
      </div>
    </div>
  );
};

export default WishlistPage;
