export interface MarketplacePlushie {
  id: string;
  name?: string; // Made optional for compatibility
  title?: string; // Added for compatibility
  price: number;
  imageUrl?: string; // Made optional for compatibility
  image?: string; // Added for compatibility
  description: string;
  condition: string;
  material: string;
  color?: string;
  deliveryCost?: number;
  userId?: string;
  username?: string; // Added for user display
  timestamp?: string;
  brand?: string; // Added for brand information
  originalPrice?: number; // Added for discount calculations
  discount?: number; // Added for discount functionality
  reviews?: Array<{ rating: number; comment: string }>; // Added for reviews
  species?: string; // Added for plushie categorization
  size?: string; // Added for size information
  filling?: string; // Added for material details
  tags?: string[]; // Added for tagging
  location?: string; // Added for location-based features
  forSale?: boolean; // Added for marketplace functionality
  likes?: number; // Added for social features
  comments?: number; // Added for social features
  deliveryMethod?: string; // Added for delivery method
}

/**
 * Extended post interface used throughout the application
 * @property {string} id - Unique post identifier (UUID format)
 * @property {string} userId - Clerk user ID who created the post
 * @property {string} username - Display name of the post creator
 * @property {string} content - Main post content/description
 * @property {string} image - Image URL or data URL for the post
 * @property {string} title - Post title
 * @property {string} [description] - Optional additional description
 * @property {string[]} [tags] - Optional array of tags for categorization
 * @property {number} likes - Number of likes the post has received
 * @property {number} comments - Number of comments on the post
 * @property {string} timestamp - ISO timestamp when post was created
 * @property {string} createdAt - ISO timestamp for database created_at
 * @property {string} updatedAt - ISO timestamp for database updated_at
 * @property {string} location - Location where the post was created
 * @property {boolean} forSale - Whether the item in the post is for sale
 * @property {string} [condition] - Condition of the item (for marketplace listings)
 * @property {string} [material] - Material of the item (for plushies)
 * @property {string} [color] - Color of the item
 * @property {number} [deliveryCost] - Cost of delivery for marketplace items
 * @property {number} [price] - Price of the item if for sale
 */
export interface ExtendedPost {
  id: string;
  userId: string;
  user_id: string; // Added for compatibility
  username: string;
  content: string;
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  likes: number;
  comments: number;
  timestamp: string;
  createdAt: string;
  created_at: string; // Added for compatibility
  updatedAt: string;
  location: string;
  forSale: boolean;
  condition?: string;
  material?: string;
  color?: string;
  deliveryCost?: number;
  price?: number; // Added for marketplace posts
  sold?: boolean; // Added for marketplace functionality
}

export interface PostCreationData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  location: string;
}

export interface PostSummary {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

// Additional interfaces that were missing
export interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  timestamp: string;
  postId: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  title?: string;
  image?: string;
  imageUrl?: string;
  likes?: number;
  comments?: number;
  tags?: string[];
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  status?: string;
  verified?: boolean;
  location?: string;
  founded?: string;
}

export interface MarketplaceFilters {
  brand?: string[];
  condition?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  material?: string[];
  size?: string[];
  color?: string[];
  filling?: string[];
  species?: string[];
  price?: [number, number];
  deliveryMethod?: string[];
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  followersCount?: number;
  followingCount?: number; // Added missing property
  postsCount?: number; // Added missing property
  collectionsCount?: number; // Added missing property
  marketplaceListingsCount?: number; // Added missing property
}

// Enum types for form validation
export type PlushieCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type PlushieMaterial = 'plush' | 'cotton' | 'polyester' | 'wool' | 'synthetic' | 'other';
export type PlushieFilling = 'polyester' | 'cotton' | 'memory-foam' | 'beans' | 'other';
export type PlushieSpecies = 'bear' | 'cat' | 'dog' | 'rabbit' | 'unicorn' | 'dragon' | 'other';
export type DeliveryMethod = 'shipping' | 'pickup' | 'both';

// Image upload result interface
export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Image editor options interface
export interface ImageEditorOptions {
  crop?: boolean;
  resize?: boolean;
  filters?: boolean;
  quality?: number;
}

// Badge interface with required properties
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  imagePath?: string; // Added missing property
  progress?: number; // Added missing property
  criteria?: BadgeCriteria; // Added missing property
  isSpecial?: boolean; // Added missing property
  type?: BadgeType; // Added type property
}

// Badge-related types
export type BadgeType = 'social' | 'collection' | 'marketplace' | 'engagement' | 'achievement' | 'milestone' | 'special';

export interface BadgeCriteria {
  type: BadgeType;
  threshold: number;
  description: string;
  requiresProfilePicture?: boolean;
  requiresPlushiePreferences?: boolean;
  requiresCompletedProfile?: boolean;
  requiresFeedPosts?: number;
  requiresListedItems?: number;
  requiresSoldItems?: number;
  requiresWishlist?: boolean;
  requiresFollowers?: number;
  specialBadgeType?: string;
}

// Wishlist interfaces
export interface WishlistItem {
  id: string;
  plushieId: string;
  userId: string;
  addedAt: string;
  name?: string; // Added missing property
  title?: string; // Added missing property
  price?: number; // Added missing property
  description?: string; // Added missing property
  imageUrl?: string; // Added missing property
  image?: string; // Added missing property
  linkUrl?: string; // Added missing property
  priority?: 'low' | 'medium' | 'high'; // Added missing property
  status?: 'wanted' | 'purchased' | 'received'; // Added missing property
  currencyCode?: string; // Added missing property
  brand?: string; // Added missing property
  createdAt?: string; // Added missing property
  updatedAt?: string; // Added missing property
  plushie: MarketplacePlushie;
}

export interface Wishlist {
  id: string;
  userId: string;
  name?: string; // Added missing property
  description?: string; // Added missing property
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
  privacy?: 'public' | 'private' | 'friends'; // Added missing property
  isPublic?: boolean; // Added missing property
}

// User privacy settings
export interface UserPrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  allowFriendRequests: boolean;
  messagePermission?: boolean; // Added missing property
  showActivity?: boolean; // Added missing property
  hideFromSearch?: boolean; // Added missing property
  allowComments?: boolean; // Added missing property
  showCollections?: boolean; // Added missing property
  showWishlist?: boolean; // Added missing property
}
