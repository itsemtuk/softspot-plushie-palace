export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  location?: string; // Added location property
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
  likes: number | { userId: string; username: string }[];
  comments: number | Comment[];
  description?: string;
  tags?: string[];
  timestamp: string;
}

// Comment interface updated to match PostCommentItem requirements
export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  text?: string; // Added for compatibility with PostCommentItem
  timestamp?: string; // Added for compatibility with PostCommentItem
  isLiked?: boolean; // Added for compatibility with PostCommentItem
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
  color?: string[]; // Added color property
}

export interface Post {
  id: string;
  userId: string;
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  timestamp: string;
  username?: string;
  likes?: number | { userId: string; username: string }[];
  comments?: number | Comment[];
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string; // Added website property
  websiteUrl?: string;
  instagram?: string; // Added Instagram property
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId?: string;
  content: string;
  timestamp: string | Date;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participants: UserProfile[];
  lastMessage: DirectMessage;
  unreadCount: number;
  updatedAt?: Date | string; // Added updatedAt property
}

export interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  interests?: string[];
  avatar?: string;
  profileImageUrl?: string; // Added for compatibility
  followers?: number; // Added followers count
  following?: number; // Added following count
}

export interface WishlistItem {
  id: string;
  plushieId: string;
  userId: string;
  maxPrice: number;
  condition: PlushieCondition[];
  notifications: boolean;
  name?: string;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
  id?: string;
  title?: string;
  description?: string;
}

export interface UserPrivacySettings {
  profileVisibility: PrivacySetting;
  messagePrivacy: PrivacySetting;
  activityVisibility: PrivacySetting;
  allowMessages?: boolean;
  showActivity?: boolean;
  allowTagging?: boolean;
  profile?: PrivacySetting;
  posts?: PrivacySetting; 
  wishlist?: PrivacySetting;
  marketplace?: PrivacySetting;
  messages?: PrivacySetting;
}

export type PrivacySetting = 'public' | 'friends' | 'private';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  read: boolean;
  timestamp: string;
  relatedUserId?: string;
}
