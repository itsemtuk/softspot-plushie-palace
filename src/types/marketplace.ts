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
  discount?: number;
  originalPrice?: number;
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
  name: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  priority?: "high" | "medium" | "low" | number;
  status?: "wanted" | "purchased" | "received" | string;
  currencyCode?: string;
  createdAt?: string;
  updatedAt?: string;
  brand?: string;
  image?: string;
}

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  items?: WishlistItem[];
  privacy?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  userId?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  profileImageUrl?: string;
  followers?: number;
  isFollowing?: boolean;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
  tags?: string[];
  image?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
  isLiked?: boolean;
  likes: number | any[];
}

export interface MarketplaceFilters {
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  color?: string[];
  brands?: string[];
  material?: string[];
  filling?: string[];
  species?: string[];
  sorting?: string;
  inStock?: boolean;
  freeShipping?: boolean;
  hasOffers?: boolean;
  searchTerm?: string;
}

export interface MarketplacePlushie extends ExtendedPost {
  deliveryMethod?: DeliveryMethod;
  filling?: PlushieFilling;
  species?: PlushieSpecies;
  brand?: string;
  discount?: number;
  originalPrice?: number;
  size?: string; // Adding this missing property
}

export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
export type PlushieMaterial = 'Cotton' | 'Plush' | 'Fleece' | 'Polyester' | 'Minky' | 'Other';
export type PlushieFilling = 'Polyester Fiberfill' | 'Cotton' | 'Memory Foam' | 'Beans' | 'Other' | string;
export type PlushieSpecies = 'Bear' | 'Cat' | 'Dog' | 'Rabbit' | 'Dinosaur' | 'Dragon' | 'Fox' | 'Panda' | 'Character' | 'Other' | 'Food' | 'Object' | string;
export type DeliveryMethod = 'Shipping' | 'Local Pickup' | 'Both';

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  value: boolean;
}

export interface UserPrivacySettings {
  privateProfile: boolean;
  hideFromSearch: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  allowComments: boolean;
  showWishlist: boolean;
  showCollection: boolean;
  profileVisibility?: string;
  messagePermission?: string;
  showActivity?: boolean;
  allowTagging?: boolean;
}
