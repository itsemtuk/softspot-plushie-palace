
export interface MarketplacePlushie {
  id: string;
  name?: string;
  title: string;
  price: number;
  image: string;
  imageUrl?: string;
  brand?: string;
  condition?: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  forSale: boolean; // Required property
  userId: string;
  username: string;
  timestamp: string;
  location?: string;
  material?: string;
  filling?: string;
  species?: string;
  deliveryMethod?: string;
  deliveryCost?: number;
  size?: string;
  color?: string;
  discount?: number;
  originalPrice?: number;
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  location?: string;
  founded?: string;
  verified?: boolean;
  status?: "online" | "offline" | "active";
}

export interface MarketplaceFilters {
  brands: string[];
  conditions: string[];
  materials: string[];
  fillings: string[];
  species: string[];
  sizes: string[];
  deliveryMethods: string[];
  brand: string[];
  condition: string[];
  material: string[];
  filling: string[];
  color: string[];
  size: string[];
  deliveryMethod: string[];
  price?: [number, number];
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}
