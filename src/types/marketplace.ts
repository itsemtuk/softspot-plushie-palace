
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
export type DeliveryMethod = 'Shipping' | 'Collection' | 'Both'; // Added "Both" as a valid option

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
  deliveryMethod: DeliveryMethod;
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
  recipientId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
};

export type MessageThread = {
  id: string;
  participants: UserProfile[];
  lastMessage?: DirectMessage;
  updatedAt: Date;
  unreadCount: number;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'trade' | 'system';
  content: string;
  read: boolean;
  timestamp: Date;
  relatedUserId?: string;
  relatedPostId?: string;
  relatedItemId?: string; 
  relatedItemType?: string;
};

// Update Post type to include title and username directly
export type Post = {
  id: string;
  userId: string;
  image: string;
  title?: string; // Added title as optional
  username?: string; // Added username as optional
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
  profile?: PrivacySetting;
  posts?: PrivacySetting;
  wishlist?: PrivacySetting;
  marketplace?: PrivacySetting;
  messages?: PrivacySetting;
};

export type WishlistItem = {
  id: string;
  name: string;
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
  title?: string; // Added for backward compatibility
};

export type Wishlist = {
  id: string;
  userId: string;
  title: string; // Keeping title as required
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
  name?: string; // Added for backward compatibility
};
