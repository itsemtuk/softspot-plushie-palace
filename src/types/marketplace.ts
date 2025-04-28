export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; // Changed from image to imageUrl
  linkUrl?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'wanted' | 'purchased' | 'received';
  currencyCode: string; // Added to match component usage
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  privacy: 'public' | 'private' | 'friends';
  createdAt: string;
  updatedAt: string; // Added to match component usage
}

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
  condition: string;
  description: string;
  color: string;
  material: string;
  brand?: string;
  size?: string;
  filling?: string;
  tags: string[];
  timestamp: string;
}

export interface Post extends MarketplacePlushie {
  userId: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface ExtendedPost extends Post {
  username: string;
  likes: number;
  comments: number;
}
