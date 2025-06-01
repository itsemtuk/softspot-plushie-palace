
import { Database } from "@/integrations/supabase/types";

export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  image?: string;
  imageUrl?: string;
  title?: string;
  tags?: string[];
  username?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  text?: string; // Keep for backward compatibility
  content: string; // Add content property
  likes: number;
  timestamp: string;
  isLiked?: boolean; // Add isLiked property
}

export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  interests: string[];
  isPrivate: boolean;
  avatar?: string; // Add avatar property
  followersCount?: number; // Add followersCount property
  joinDate?: string; // Add joinDate property
  followingCount?: number;
  postsCount?: number;
  collectionsCount?: number;
  marketplaceListingsCount?: number;
}

export interface ExtendedPost {
  id: string;
  userId: string;
  user_id: string; // Keep both for compatibility
  username: string;
  image: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  createdAt: string;
  created_at: string; // Keep both for compatibility
  updatedAt: string;
  location?: string;
  forSale?: boolean;
  price?: number;
  brand?: string;
  condition?: string;
  material?: string;
  filling?: string;
  species?: string;
  deliveryMethod?: string;
  deliveryCost?: number;
  size?: string;
  sold?: boolean; // Add sold property for badges
  color?: string; // Add color property
}

export type PostCreationData = Omit<ExtendedPost, 'id' | 'userId' | 'username' | 'likes' | 'comments' | 'timestamp' | 'createdAt' | 'updatedAt' | 'user_id' | 'created_at'>;

// Add missing marketplace types
export interface MarketplacePlushie {
  id: string;
  name?: string; // Add name property
  title: string;
  price: number;
  image: string;
  imageUrl?: string; // Add imageUrl property
  brand?: string;
  condition?: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  forSale: boolean;
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
  color?: string; // Add color property
  discount?: number; // Add discount property
  originalPrice?: number; // Add originalPrice property
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

export interface ImageUploadResult {
  success: boolean;
  url?: string; // Make url optional for error cases
  error?: string;
}

export interface ImageEditorOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

export interface WishlistItem {
  id: string;
  plushieId: string;
  userId: string;
  addedAt: string;
  name?: string; // Add name property
  title?: string; // Add title property
  price?: number; // Add price property
  description?: string; // Add description property
  imageUrl?: string; // Add imageUrl property
  image?: string; // Add image property
  linkUrl?: string; // Add linkUrl property
  priority?: 'low' | 'medium' | 'high'; // Add priority property
  status?: 'wanted' | 'purchased' | 'received'; // Add status property
  currencyCode?: string; // Add currencyCode property
  brand?: string; // Add brand property
  createdAt?: string; // Add createdAt property
  updatedAt?: string; // Add updatedAt property
  plushie?: {
    id: string;
    name?: string;
    title?: string;
    price: number;
    imageUrl?: string;
    image?: string;
    description: string;
    condition: string;
    material: string;
    species: string;
    size: string;
    filling: string;
    tags: string[];
    location: string;
    forSale: boolean;
    likes: number;
    comments: number;
  };
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPrivacySettings {
  isPrivate: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  allowTradeRequests: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
  type: BadgeType;
}

export interface BadgeCriteria {
  requirement: string;
  value: number;
}

export type BadgeType = 'achievement' | 'milestone' | 'special';

export type PlushieFilling = 'cotton' | 'polyester' | 'beads' | 'memory-foam' | 'other';
