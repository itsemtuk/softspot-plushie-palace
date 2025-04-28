
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'wanted' | 'purchased' | 'received';
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
  brand?: string;
  image?: string; // Added for WishlistManager
}

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  privacy: 'public' | 'private' | 'friends';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  title?: string;
  isPublic?: boolean; // Added for WishlistManager
}

export interface MarketplacePlushie {
  id: string;
  userId: string;
  image: string;
  title: string;
  username: string;
  likes: number;
  comments: number;
  price: number;
  forSale: boolean;
  condition: string;
  description: string;
  color: string;
  material: string;
  brand?: string;
  size?: string;
  filling?: string;
  tags: string[];
  timestamp: string;
  species?: string;
  location?: string;
  deliveryCost?: number;
  deliveryMethod?: string; // Added for TradeRequestDialog
}

export interface Post extends MarketplacePlushie {
  userId: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface ExtendedPost extends Post {
  username: string;
  likes: number;
  comments: number;
}

// Additional types for post creation
export interface PostCreationData {
  image: string;
  title: string;
  description?: string;
  location?: string;
  tags?: string[];
}

// Types for image upload
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

// Types for comments
export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes?: { userId: string; }[];
  isLiked?: boolean; // Added for PostCommentItem
}

// Types for plushie attributes
export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
export type PlushieMaterial = 'Plush' | 'Cotton' | 'Polyester' | 'Fur' | 'Other';
export type PlushieFilling = 'Cotton' | 'Polyester' | 'Memory Foam' | 'Beans' | 'Other';
export type PlushieSpecies = 'Bear' | 'Rabbit' | 'Cat' | 'Dog' | 'Mythical' | 'Other';
export type DeliveryMethod = 'Shipping' | 'Collection' | 'Both';

// Currency type for international currency support
export type Currency = 
  'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CNY' | 'INR';

// Marketplace filters
export interface MarketplaceFilters {
  material?: string[];
  filling?: string[];
  brands?: string[];
  color?: string[];
  species?: string[];
}

// Brand types
export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  location?: string;
  founded?: string;
  verified: boolean;
  status: 'online' | 'offline' | 'away' | 'busy' | 'active';
}

// User profile
export interface UserProfile {
  id: string;
  username: string;
  profileImageUrl: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
  avatar: string;
}

// Messaging types
export interface DirectMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  recipientId?: string; // Added to fix DirectMessaging component
  isRead?: boolean; // Added for backward compatibility
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  lastMessage: DirectMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt?: string; // Added for DirectMessaging component
}

export interface UpdatedMessageThread extends Omit<MessageThread, 'participants'> {
  participants: UserProfile[];
  updatedAt: string; // Explicitly added for UpdatedMessageThread
}

// Privacy settings
export type PrivacySetting = 'everyone' | 'friends' | 'none' | 'public' | 'followers' | 'private';

export interface UserPrivacySettings {
  profileVisibility: PrivacySetting;
  postComments: PrivacySetting;
  messagePrivacy: PrivacySetting; // Added for PrivacySettings component
  messagePermission?: PrivacySetting; // Added for PrivacySettings component
  showActivity?: boolean; // Added for PrivacySettings component
  allowTagging?: boolean; // Added for PrivacySettings component
  activityVisibility?: boolean; // For backward compatibility
  allowMessages?: boolean; // For backward compatibility
  profile?: PrivacySetting; // For backward compatibility
  posts?: PrivacySetting; // For backward compatibility
  wishlist?: PrivacySetting; // For backward compatibility
  marketplace?: PrivacySetting; // For backward compatibility
  messages?: PrivacySetting; // For backward compatibility
}
