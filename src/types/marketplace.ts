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

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
  price?: number;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  items: WishlistItem[];
  createdAt: string;
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
  likes: number;
  comments: number;
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
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}
