import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplacePlushie } from "@/types/marketplace";

const BrandPage = () => {
  const { brandId } = useParams<{ brandId: string }>();

  // Mock data for plushies (replace with actual data fetching)
  const mockPlushies: MarketplacePlushie[] = [
    {
      id: "1",
      userId: "user1",
      image: "https://example.com/plushie1.jpg",
      title: "Vintage Bear",
      username: "plushielover",
      likes: 42,
      comments: 12,
      price: 49.99,
      forSale: true,
      condition: "Like New",
      description: "A beautiful vintage teddy bear",
      color: "Brown",
      material: "Plush",
      brand: "TeddyCo",
      size: "Medium",
      filling: "Cotton",
      tags: ["vintage", "bear", "collectible"],
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      userId: "user2",
      image: "https://example.com/plushie2.jpg",
      title: "Rainbow Unicorn",
      username: "unicornfan",
      likes: 68,
      comments: 22,
      price: 59.99,
      forSale: true,
      condition: "New",
      description: "A magical rainbow unicorn plushie",
      color: "Rainbow",
      material: "Polyester",
      brand: "UnicornWorld",
      size: "Small",
      filling: "Fiberfill",
      tags: ["unicorn", "rainbow", "magical"],
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      userId: "user3",
      image: "https://example.com/plushie3.jpg",
      title: "Giant Panda",
      username: "pandamania",
      likes: 120,
      comments: 45,
      price: 79.99,
      forSale: true,
      condition: "Used",
      description: "A huge and cuddly panda plushie",
      color: "Black and White",
      material: "Fleece",
      brand: "PandaParadise",
      size: "Large",
      filling: "Foam",
      tags: ["panda", "giant", "cuddly"],
      timestamp: new Date().toISOString(),
    },
  ];

  // Filter plushies by brand (case-insensitive)
  const filteredPlushies = mockPlushies.filter(
    (plushie) => plushie.brand?.toLowerCase() === brandId?.toLowerCase()
  );

  if (!brandId) {
    return <div>Error: No brand ID provided.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">
        {brandId} Plushies
      </h1>
      {filteredPlushies.length === 0 ? (
        <p>No plushies found for this brand.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlushies.map((plushie) => (
            <Card key={plushie.id}>
              <CardHeader>
                <CardTitle>{plushie.title}</CardTitle>
                <CardDescription>
                  By {plushie.username}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                <img
                  src={plushie.image}
                  alt={plushie.title}
                  className="w-full h-48 object-cover mb-2 rounded-md"
                />
                <p>{plushie.description}</p>
                <div className="mt-2">
                  {plushie.tags.map((tag) => (
                    <Badge key={tag} className="mr-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandPage;
