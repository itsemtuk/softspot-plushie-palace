export type ImageUploadResult = {
  url?: string;
  success: boolean;
  error?: string;
};

export type ImageEditorOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
};

export type PostCreationData = {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
};

// Use string literals for the enum values to make them more flexible
export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor' | string;
export type PlushieMaterial = 'Plush' | 'Cotton' | 'Polyester' | 'Fur' | string;
export type PlushieFilling = 'Cotton' | 'Polyester' | 'Memory Foam' | string;
export type PlushieSpecies = 'Bear' | 'Rabbit' | 'Cat' | 'Dog' | 'Mythical' | string;

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | string;

export type PrivacySetting = 'public' | 'private' | 'friends' | string;

export type MarketplacePlushie = {
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
  brand: string;
  deliveryMethod: 'Shipping' | 'Collection';
  deliveryCost: number;
  tags: string[];
};

export type MarketplaceFilters = {
  color?: string[];
  material?: string[];
  filling?: string[];
  species?: string[];
  brand?: string[];
  condition?: PlushieCondition[];
  priceRange?: [number, number];
};

export type UserProfile = {
  id: string;
  username: string;
  profileImageUrl?: string;
  bio?: string;
  followers: number;
  following: number;
};

export type DirectMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
};

export type MessageThread = {
  id: string;
  participants: string[];
  lastMessage?: DirectMessage;
  updatedAt: string;
  unreadCount: number;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'trade';
  content: string;
  read: boolean;
  timestamp: string;
  relatedUserId?: string;
  relatedPostId?: string;
};

export type Post = {
  id: string;
  userId: string;
  image: string;
  caption?: string;
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  tags?: string[];
};

export type PlushieBrand = {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  featured: boolean;
};

export type UserPrivacySettings = {
  profileVisibility: PrivacySetting;
  allowMessages: boolean;
  showActivity: boolean;
  allowTagging: boolean;
};

// Update WishlistItem to include name instead of title
export type WishlistItem = {
  id: string;
  name: string; // Changed from title to match the error
  brand?: string;
  image?: string;
  price?: number;
  currency?: Currency;
  condition?: PlushieCondition;
  url?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  material?: PlushieMaterial;
  filling?: PlushieFilling;
  species?: PlushieSpecies;
};

// Update Wishlist type to include userId
export type Wishlist = {
  id: string;
  userId: string; // Added to match the error
  title: string;
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
};
