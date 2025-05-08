
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MarketplacePlushie } from '@/types/marketplace';

const BrandPage = () => {
  const [products, setProducts] = useState<MarketplacePlushie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace the product data with properly typed objects
    const mockProducts: MarketplacePlushie[] = [
      {
        id: "p1",
        userId: "u1",
        image: "https://images.unsplash.com/photo-1558006510-1e4d1bf38ada",
        title: "Jellycat Bashful Bunny",
        username: "jellycat_official",
        likes: 320,
        comments: 42,
        price: 29.99,
        forSale: true,
        condition: "New",
        description: "The softest bunny you'll ever cuddle with!",
        color: "Beige",
        material: "Plush",
        brand: "Jellycat",
        size: "Medium", // This is now properly typed in MarketplacePlushie
        filling: "Polyester Fiberfill",
        tags: ["bunny", "jellycat", "new"],
        timestamp: new Date().toISOString(),
        species: "Rabbit",
        deliveryCost: 0
      },
      {
        id: "p2",
        userId: "u1",
        image: "https://images.unsplash.com/photo-1545487738-f8fd4de17ee1",
        title: "Jellycat Amuseable Avocado",
        username: "jellycat_official",
        likes: 240,
        comments: 26,
        price: 24.99,
        forSale: true,
        condition: "New",
        description: "This avocado plush is the perfect gift for any food-lover!",
        color: "Green",
        material: "Plush",
        brand: "Jellycat",
        size: "Small", // This is now properly typed
        filling: "Polyester Fiberfill",
        tags: ["food", "jellycat", "avocado"],
        timestamp: new Date().toISOString(),
        species: "Food",
        deliveryCost: 4.99
      },
      {
        id: "p3",
        userId: "u1",
        image: "https://images.unsplash.com/photo-1559762629-ca56f3415103",
        title: "Jellycat Amuseable Cloud",
        username: "jellycat_official",
        likes: 190,
        comments: 18,
        price: 19.99,
        forSale: true,
        condition: "New",
        description: "The sweetest cloud plush with an adorable smiling face.",
        color: "White",
        material: "Plush",
        brand: "Jellycat",
        size: "Small", // This is now properly typed
        filling: "Polyester Fiberfill",
        tags: ["cloud", "jellycat", "cute"],
        timestamp: new Date().toISOString(),
        species: "Object",
        deliveryCost: 4.99
      }
    ];

    setProducts(mockProducts);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Jellycat Official Store</h1>
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-2 rounded-md" />
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-600">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
