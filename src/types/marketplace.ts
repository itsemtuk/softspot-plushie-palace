
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
  likes?: number;
  comments?: number;
  timestamp?: string;
  condition?: string;
  material?: string;
  color?: string;
  filling?: string;
  species?: string;
  brand?: string;
  sold?: boolean;
  deliveryCost?: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text?: string;
  content?: string;
  timestamp?: string;
  createdAt?: string;
  isLiked?: boolean;
  likes: number | { userId: string; }[];
  postId?: string;
  likedBy?: string[];
}

export interface Post {
  id: string;
  userId: string;
  username?: string;
  title?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  tags?: string[];
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
  comments?: number;
  forSale?: boolean;
  price?: number;
}

export interface PlushieBrand {
  id?: string;
  name: string;
  logo: string;
  description?: string;
  founded?: string;
  location?: string;
  website?: string;
  verified?: boolean;
  status?: string;
}

export type MarketplaceFilters = {
  price: [number, number];
  condition: string[];
  material: string[];
  filling: string[];
  species: string[];
  brand: string[];
  color: string[];
  size: string[];
  deliveryMethod: string[];
};

export type ImageUploadResult = {
  success: boolean;
  url?: string;
  error?: string;
  file?: File;
};

export type PlushieCondition = "New" | "Like New" | "Good" | "Used" | "Vintage";
export type PlushieMaterial = "Cotton" | "Polyester" | "Plush" | "Fur" | "Velvet" | "Other";
export type PlushieFilling = "Cotton" | "Polyester" | "Beads" | "Memory Foam" | "Other";
export type PlushieSpecies = "Bear" | "Cat" | "Dog" | "Rabbit" | "Mythical" | "Other";
export type DeliveryMethod = "Shipping" | "Local Pickup" | "Both";
export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";

export interface UserPrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  showCollections: boolean;
  allowMessages: "everyone" | "friends" | "none";
  showOnlineStatus: boolean;
  allowTagging: boolean;
  messagePermission?: "everyone" | "friends" | "none";
  showActivity?: boolean;
  hideFromSearch?: boolean;
  allowComments?: boolean;
  showWishlist?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  collectionsCount: number;
  marketplaceListingsCount: number;
  badges?: Badge[];
  verified?: boolean;
  preferences?: {
    favoriteBrands?: string[];
    favoriteTypes?: string[];
  };
  profileImageUrl?: string; // Added for TradeRequestDialog
  followers?: number; // Added for TradeRequestDialog
}

export interface WishlistItem {
  id: string;
  plushieId: string;
  title: string;
  image: string;
  price: number;
  brand?: string;
  addedDate: string;
  priority: "low" | "medium" | "high";
  notes?: string;
  notifyOnDiscount?: boolean;
  notifyOnAvailability?: boolean;
  name?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  status?: "wanted" | "purchased" | "received";
  currencyCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  privacy?: "public" | "private" | "friends";
}

export type BadgeType = "achievement" | "milestone" | "special";

export interface BadgeCriteria {
  requiresProfilePicture?: boolean;
  requiresCompletedProfile?: boolean;
  requiresPlushiePreferences?: boolean;
  requiresFeedPosts?: number;
  requiresListedItems?: number;
  requiresSoldItems?: number;
  requiresWishlist?: boolean;
  requiresFollowers?: number;
  specialBadgeType?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  earned: boolean;
  earnedAt?: string;
  criteria: BadgeCriteria;
  progress?: number;
  maxProgress?: number;
  type: BadgeType;
  isSpecial?: boolean;
}

export interface ImageEditorOptions {
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowZoom?: boolean;
  allowRotate?: boolean;
  allowFlip?: boolean;
  quality?: number;
}
