export interface ImageUploadResult {
  url: string;
  success: boolean;
  file: File;
  error?: string;
  type?: string;
  name?: string;
}

export interface ExtendedPost {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  description: string;
  tags: string[];
  timestamp: string;
  price?: number;
  forSale?: boolean;
  condition?: string;
  color?: string;
  material?: string;
  location?: string;
  deliveryCost: number;
}

export type PostCreationData = {
  title: string;
  description: string;
  image: string;
  tags?: string[];
  location?: string;
};

export interface ImageEditorOptions {
  aspectRatio?: number;
  minScale?: number;
  maxScale?: number;
  allowRotation?: boolean;
  allowFlip?: boolean;
  allowCrop?: boolean;
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  status?: string;
  verified?: boolean;
  location?: string;
  founded?: string;
}

export interface WishlistItem {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  priority?: number;
  status?: string;
  currencyCode?: string;
  createdAt?: string;
  updatedAt?: string;
  brand?: string;
  image?: string;
}

export interface Wishlist {
  id: string;
  name?: string;
  description?: string;
  items?: WishlistItem[];
}

export interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
}
