export interface Plushie {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
}

export interface Post {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  profileImageUrl: string;
  bio: string;
  followers: number;
  following: number;
}

// Add missing types for marketplace functionality
export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
export type PlushieMaterial = 'Cotton' | 'Polyester' | 'Plush' | 'Fur' | 'Velvet' | 'Other';
export type PlushieFilling = 'Cotton' | 'Polyester' | 'Beads' | 'Memory Foam' | 'Other';
export type PlushieSpecies = 'Bear' | 'Cat' | 'Dog' | 'Rabbit' | 'Mythical' | 'Other';
export type PlushieBrand = 'Build-A-Bear' | 'Squishmallows' | 'Jellycat' | 'Care Bears' | 'Disney' | 'Other';

export interface MarketplacePlushie {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price: number;
  forSale: boolean;
  condition: PlushieCondition;
  description: string;
  color: string;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: PlushieBrand;
  deliveryMethod: 'Shipping' | 'Collection' | 'Both';
  deliveryCost: number;
  tags?: string[];
}

export interface MarketplaceFilters {
  color?: string[];
  material?: string[];
  filling?: string[];
  species?: string[];
  brand?: string[];
  priceRange?: [number, number];
  condition?: string[];
  search?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: MarketplacePlushie[];
  createdAt: string;
  updatedAt: string;
  isPrivate?: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  participants: {
    id: string;
    username: string;
    profileImageUrl: string;
  }[];
  lastMessage: DirectMessage;
  unreadCount: number;
}

export type PrivacySetting = 'public' | 'friends' | 'private';

export interface UserPrivacySettings {
  profile: PrivacySetting;
  posts: PrivacySetting;
  wishlist: PrivacySetting;
  marketplace: PrivacySetting;
  messages: PrivacySetting;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'INR';

export type CurrencyRates = Record<Currency, number>;

export type CurrencySymbols = Record<Currency, string>;

export interface ImageUploadResult {
  url: string;
  success: boolean;
  error?: string;
}

export interface ImageEditorOptions {
  aspectRatio?: number;
  minWidth?: number;
  maxWidth?: number;
  quality?: number;
}

export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
}
