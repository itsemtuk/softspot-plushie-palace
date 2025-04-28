
export interface UserProfile {
  id: string;
  username: string;
  profileImageUrl: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
  avatar: string;
  status?: "online" | "offline" | "away" | "busy";
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes: Array<{ userId: string; username: string }> | number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "like" | "comment" | "follow" | "mention";
  relatedUserId?: string;
  content?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessageThread {
  id: string;
  participants: UserProfile[];
  lastMessage: DirectMessage;
  updatedAt: string;
  unreadCount: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
  price?: number;
  title?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  items: WishlistItem[];
  createdAt: string;
  title?: string;
}

export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface ExtendedPost {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number | Array<{ userId: string; username: string }>;
  comments: number | Comment[];
  description?: string;
  tags?: string[];
  timestamp: string;
  location?: string;
}

export interface Post {
  id: string;
  userId: string;
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  timestamp: string;
  location?: string;
}

export type PlushieCondition = "New" | "Like New" | "Good" | "Fair" | "Poor";
export type PlushieMaterial = "Plush" | "Cotton" | "Polyester" | "Fur" | "Other";
export type PlushieFilling = "Cotton" | "Polyester" | "Memory Foam" | "Beans" | "Other";
export type PlushieSpecies = "Bear" | "Rabbit" | "Cat" | "Dog" | "Mythical" | "Other";
export type DeliveryMethod = "Shipping" | "Collection" | "Both";

export interface MarketplacePlushie {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  description: string;
  condition: PlushieCondition;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: string;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  color: string;
  timestamp: string;
  forSale: boolean;
  tags: string[];
  price?: number;
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
  aspectRatio?: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface MarketplaceFilters {
  condition: PlushieCondition[];
  material: PlushieMaterial[];
  species: PlushieSpecies[];
  brands: string[];
  priceRange: [number, number];
  sortBy: "newest" | "price-low" | "price-high" | "popular";
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  founded: string;
  location: string;
  followersCount: number;
  isFollowing: boolean;
}

export type PrivacySetting = "public" | "followers" | "private";

export interface UserPrivacySettings {
  profileVisibility: PrivacySetting;
  messagePermission: PrivacySetting;
  activityStatus: boolean;
  showWishlist: boolean;
  allowTagging: boolean;
}
