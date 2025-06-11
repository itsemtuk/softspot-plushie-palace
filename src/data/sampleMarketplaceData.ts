
import { MarketplacePlushie } from "@/types/marketplace";

export const samplePlushies: MarketplacePlushie[] = [
  {
    id: "1",
    image: "/placeholder.svg",
    imageUrl: "/placeholder.svg",
    title: "Jellycat Bashful Bunny",
    username: "plushielover23",
    userId: "user1",
    likes: 24,
    comments: 8,
    price: 35,
    forSale: true,
    condition: "Like New",
    description: "Adorable cream bunny in perfect condition",
    tags: ["jellycat", "bunny", "cream", "soft"],
    color: "Cream",
    material: "Polyester",
    filling: "Polyester fiberfill",
    species: "Bunny",
    brand: "Jellycat",
    location: "New York",
    deliveryCost: 0,
    discount: 0,
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    image: "/placeholder.svg",
    imageUrl: "/placeholder.svg",
    title: "Squishmallow Axolotl",
    username: "squishfan",
    userId: "user2",
    likes: 18,
    comments: 5,
    price: 22,
    forSale: true,
    condition: "New",
    description: "Brand new pink axolotl squishmallow",
    tags: ["squishmallow", "axolotl", "pink", "new"],
    color: "Pink",
    material: "Polyester",
    filling: "Polyester fiberfill",
    species: "Axolotl",
    brand: "Squishmallows",
    location: "California",
    deliveryCost: 5,
    discount: 10,
    timestamp: "2024-01-14T15:45:00Z"
  }
];
