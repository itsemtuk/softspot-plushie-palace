import { useState } from "react";
import { Heart, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wishlist } from "@/types/user";
import MainLayout from "@/components/layout/MainLayout";
import { WishlistManager } from "@/components/profile/WishlistManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data for demonstration
  const mockWishlists: Wishlist[] = [
    {
      id: "1",
      userId: "user123",
      name: "My Plushie Wishlist",
      items: [
        {
          id: "item1",
          plushieId: "plush1",
          userId: "user123",
          addedAt: "2023-01-01",
          name: "Jellycat Dragon",
          title: "Jellycat Dragon",
          price: 30,
          description: "A cute green dragon from Jellycat.",
          imageUrl: "https://example.com/jellycat-dragon.jpg",
          priority: "high",
          status: "wanted",
        },
        {
          id: "item2",
          plushieId: "plush2",
          userId: "user123",
          addedAt: "2023-02-15",
          name: "Squishmallow Axolotl",
          title: "Squishmallow Axolotl",
          price: 20,
          description: "A pink axolotl Squishmallow.",
          imageUrl: "https://example.com/squishmallow-axolotl.jpg",
          priority: "medium",
          status: "wanted",
        },
      ],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      isPublic: true,
    },
    {
      id: "2",
      userId: "user123",
      name: "Birthday Wishlist",
      items: [
        {
          id: "item3",
          plushieId: "plush3",
          userId: "user123",
          addedAt: "2023-03-10",
          name: "Build-A-Bear Pikachu",
          title: "Build-A-Bear Pikachu",
          price: 40,
          description: "A Pikachu from Build-A-Bear.",
          imageUrl: "https://example.com/build-a-bear-pikachu.jpg",
          priority: "high",
          status: "wanted",
        },
      ],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      isPublic: false,
    },
  ];

  // Simulate fetching wishlists from an API
  useState(() => {
    setWishlists(mockWishlists);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Wishlists</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Wishlist
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="relative w-1/2">
            <Input
              type="search"
              placeholder="Search wishlists..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button
            variant="outline"
            onClick={toggleFilter}
            className="space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {wishlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlists.map((wishlist) => (
              <Card key={wishlist.id}>
                <CardHeader>
                  <CardTitle>{wishlist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <WishlistManager wishlist={wishlist} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Heart className="inline-block h-6 w-6 mr-2" />
              No wishlists found. Create one to start saving your favorite
              items!
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
