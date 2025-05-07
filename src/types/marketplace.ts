
export interface MarketplacePlushie {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price: number;
  forSale: boolean;
  condition?: string;
  description?: string;
  color?: string;
  material?: string;
  brand?: string;
  size?: string;
  filling?: string;
  tags?: string[];
  timestamp: string;
  species?: string;
  location?: string;
  deliveryCost: number;
  discount?: number;
  originalPrice?: number | null;
}

export interface MarketplaceFilters {
  color?: string[];
  material?: string[];
  filling?: string[];
  species?: string[];
  brands?: string[];
  condition?: string[];
}

export interface ImageUploadResult {
  url: string;
  file?: File;
  type?: string;
}
