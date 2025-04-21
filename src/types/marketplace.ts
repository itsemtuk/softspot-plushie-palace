
export interface ImageUploadResult {
  url?: string;
  success: boolean;
  error?: string;
}

export interface ImageEditorOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
}

export interface PlushieItem {
  id: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price?: number;
  forSale?: boolean;
  timestamp?: string;
  tags: string[];
}

// Message types for DMs and notifications
export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participants: UserProfile[];
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  profileImageUrl: string;
  bio: string;
  followers: number;
  following: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  timestamp: Date;
  read: boolean;
  relatedUserId?: string;
  relatedItemId?: string;
  relatedItemType?: string;
}

// Types required for marketplace components
export interface MarketplacePlushie {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  seller: UserProfile;
  condition: PlushieCondition;
  brand: string;
  tags: string[];
  timestamp: string;
  likes: number;
  comments: number;
}

export interface MarketplaceFilters {
  search: string;
  minPrice: number;
  maxPrice: number;
  brands: string[];
  conditions: PlushieCondition[];
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popularity';
  species: string[];
}

export enum PlushieCondition {
  New = 'New',
  LikeNew = 'Like New',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor'
}

export enum PlushieMaterial {
  Cotton = 'Cotton',
  Polyester = 'Polyester',
  Plush = 'Plush',
  Velour = 'Velour',
  Minky = 'Minky'
}

export enum PlushieFilling {
  PolyesterFiber = 'Polyester Fiber',
  Cotton = 'Cotton',
  Beans = 'Beans',
  Memory = 'Memory Foam'
}

export enum PlushieSpecies {
  Bear = 'Bear',
  Cat = 'Cat',
  Dog = 'Dog',
  Unicorn = 'Unicorn',
  Dragon = 'Dragon',
  Rabbit = 'Rabbit'
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
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
  tags: string[];
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  createdAt: Date;
  items: MarketplacePlushie[];
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface UserPrivacySettings {
  id: string;
  userId: string;
  profileVisibility: PrivacySetting;
  messagePermissions: PrivacySetting;
  wishlistVisibility: PrivacySetting;
  activityVisibility: PrivacySetting;
}

export enum PrivacySetting {
  Public = 'public',
  FriendsOnly = 'friends-only',
  Private = 'private'
}
