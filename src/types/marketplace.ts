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
  // Add ExtendedPost compatibility fields
  userId?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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
  sold?: boolean;
  color?: string;
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
  avatar?: string;
  followersCount?: number;
  joinDate?: string;
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

export interface ImageUploadResult {
  success: boolean;
  url?: string;
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
  name?: string;
  title?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  image?: string;
  linkUrl?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'wanted' | 'purchased' | 'received';
  currencyCode?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
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
  name?: string; // Add name property
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean; // Add isPublic property
}

export interface UserPrivacySettings {
  isPrivate: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  allowTradeRequests: boolean;
  // Add missing properties
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  allowFriendRequests: boolean;
  messagePermission: boolean;
  showActivity: boolean;
  hideFromSearch: boolean;
  allowComments: boolean;
  showCollections: boolean;
  showWishlist: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
  type: BadgeType;
  earned?: boolean; // Add earned property
  progress?: number; // Add progress property
  earnedAt?: string; // Add earnedAt property
}

export interface BadgeCriteria {
  requirement: string;
  value: number;
  type?: string;
  threshold?: number;
  description?: string; // Add description property
  requiresProfilePicture?: boolean;
  requiresPlushiePreferences?: boolean;
  requiresCompletedProfile?: boolean;
  requiresFeedPosts?: number;
  requiresListedItems?: number;
  requiresSoldItems?: number;
  requiresWishlist?: boolean;
  requiresFollowers?: number;
  specialBadgeType?: string;
}

export type BadgeType = 'achievement' | 'milestone' | 'special';

export type PlushieFilling = 'cotton' | 'polyester' | 'beads' | 'memory-foam' | 'other';
