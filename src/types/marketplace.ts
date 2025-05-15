export interface MarketplaceReview {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MarketplacePlushie {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  price: number;
  image: string;
  tags?: string[];
  timestamp: string;
  username?: string;
  likes?: number;
  comments?: number;
  forSale?: boolean;
  condition?: string;
  color?: string;
  material?: string;
  brand?: string;
  filling?: string;
  species?: string;
  location?: string;
  deliveryCost: number;
  discount?: number;
  originalPrice?: number;
  size?: string;
  reviews?: MarketplaceReview[];
}

export interface PostCreationData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  location: string;
}

export interface ExtendedPost extends PostCreationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  username: string;
  forSale?: boolean;
  price?: number;
}
