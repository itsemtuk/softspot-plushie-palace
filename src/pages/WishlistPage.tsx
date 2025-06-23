import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/components/ui/spinner";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  available: boolean;
}

const WishlistPage = () => {
  const { user, isLoaded } = useUser();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // TODO: Implement actual wishlist fetching from Supabase
      setTimeout(() => {
        setWishlistItems([]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoaded]);

  if (!isLoaded || isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                My Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-500 dark:text-gray-400">
                Sign in to save your favorite plushies to your wishlist.
              </p>
              <Link to="/sign-in">
                <Button className="w-full bg-softspot-500 hover:bg-softspot-600">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Keep track of plushies you want to buy
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start browsing the marketplace to find plushies you love!
              </p>
            </div>
            <div className="space-y-2">
              <Link to="/marketplace" className="block">
                <Button className="w-full bg-softspot-500 hover:bg-softspot-600">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link to="/search" className="block">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Plushies
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
