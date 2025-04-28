
export type PlushieCondition = "New" | "Like New" | "Good" | "Fair" | "Poor";
export type PlushieMaterial = "Plush" | "Cotton" | "Polyester" | "Fur" | "Other";
export type PlushieFilling = "Cotton" | "Polyester" | "Memory Foam" | "Beans" | "Other";
export type PlushieSpecies = "Bear" | "Rabbit" | "Cat" | "Dog" | "Mythical" | "Other";
export type DeliveryMethod = "Shipping" | "Collection" | "Both";
export type PrivacySetting = "public" | "followers" | "private";
export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "CNY" | "INR";

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  founded?: string;
  headquarters?: string;
  status?: "active" | "inactive";
  verified?: boolean;
  location?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: DirectMessage;
  unreadCount: number;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio?: string;
  isOnline?: boolean;
  lastActive?: string;
  isFollowing?: boolean;
  followerCount?: number;
  followingCount?: number;
  profileImageUrl?: string;
  followers?: number;
}

export interface ImageEditorOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png';
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface MarketplacePlushie {
  id: string;
  title: string;
  price: number;
  description: string;
  condition: PlushieCondition;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: string;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  color: string;
  image: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
  forSale: boolean;
  tags?: string[];
}

export interface MarketplaceFilters {
  material?: PlushieMaterial[];
  filling?: PlushieFilling[];
  species?: PlushieSpecies[];
  brand?: string[];
  color?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag' | 'message' | 'system';
  relatedPostId?: string;
  relatedUserId?: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  content?: string;
}

export interface Post {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number | Comment[];
  timestamp: string;
  tags?: string[];
}

export interface ExtendedPost extends Post {
  description?: string;
  location?: string;
  likes: number | Array<{userId: string, username: string}>;
  comments: number | Comment[];
}

export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes: { userId: string }[];
}

export interface UserPrivacySettings {
  profileVisibility: PrivacySetting;
  messagePrivacy: PrivacySetting;
  activityVisibility: boolean;
  allowMessages: boolean;
  showActivity: boolean;
  allowTagging: boolean;
  profile: PrivacySetting;
  posts: PrivacySetting;
  wishlist: PrivacySetting;
  marketplace: PrivacySetting;
  messages: PrivacySetting;
}

export interface WishlistItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  condition: PlushieCondition;
  brand?: string;
}

export interface Wishlist {
  id: string;
  title: string;
  items?: WishlistItem[];
  description?: string;
  acceptedConditions: PlushieCondition[];
  isPublic?: boolean;
  userId?: string;
  username?: string;
  createdAt?: string;
}
