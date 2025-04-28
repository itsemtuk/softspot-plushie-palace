export type PlushieCondition = "New" | "Like New" | "Good" | "Fair" | "Poor";
export type PlushieMaterial = "Plush" | "Cotton" | "Polyester" | "Fur" | "Other";
export type PlushieFilling = "Cotton" | "Polyester" | "Memory Foam" | "Beans" | "Other";
export type PlushieSpecies = "Bear" | "Rabbit" | "Cat" | "Dog" | "Mythical" | "Other";
export type DeliveryMethod = "Shipping" | "Collection" | "Both";
export type PrivacySetting = "public" | "followers" | "private";

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
}

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
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags?: string[];
}

export interface ExtendedPost extends Post {
  description?: string;
  location?: string;
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
}

export interface Wishlist {
  id: string;
  title: string;
  items?: WishlistItem[];
  description?: string;
  acceptedConditions: PlushieCondition[];
  isPublic?: boolean; // Add this field
  userId?: string;
  username?: string;
}
