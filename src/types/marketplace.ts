export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ImageEditorOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ExtendedPost {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  description?: string;
  tags?: string[];
  timestamp: string;
}

// Add the Comment interface if it doesn't exist
export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes?: { userId: string; username: string }[];
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CNY' | 'INR';

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
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: string;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  description?: string;
  color?: string;
  tags?: string[];
}

export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
export type PlushieMaterial = 'Plush' | 'Cotton' | 'Polyester' | 'Fur' | 'Other';
export type PlushieFilling = 'Cotton' | 'Polyester' | 'Memory Foam' | 'Beans' | 'Other';
export type PlushieSpecies = 'Bear' | 'Rabbit' | 'Cat' | 'Dog' | 'Mythical' | 'Other';
export type DeliveryMethod = 'Shipping' | 'Collection' | 'Both';

export interface MarketplaceFilters {
  material?: PlushieMaterial[];
  filling?: PlushieFilling[];
  species?: PlushieSpecies[];
  brand?: string[];
}

export interface Post {
  id: string;
  userId: string;
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  timestamp: string;
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  websiteUrl?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
}

export interface WishlistItem {
  id: string;
  plushieId: string;
  userId: string;
  maxPrice: number;
  condition: PlushieCondition[];
  notifications: boolean;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
}

export interface UserPrivacySettings {
  profileVisibility: PrivacySetting;
  messagePrivacy: PrivacySetting;
  activityVisibility: PrivacySetting;
}

export type PrivacySetting = 'public' | 'friends' | 'private';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  read: boolean;
  timestamp: string;
}
