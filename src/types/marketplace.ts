
export interface MarketplacePlushie {
  id: string;
  name: string;
  title?: string; // Added for compatibility
  price: number;
  imageUrl: string;
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
  updatedAt: string;
  location: string;
  forSale: boolean;
  condition?: string;
  material?: string;
  color?: string;
  deliveryCost?: number;
  price?: number; // Added for marketplace posts
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
}

export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  title?: string;
  image?: string;
  likes?: number;
  comments?: number;
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface MarketplaceFilters {
  brand?: string;
  condition?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  material?: string;
  size?: string;
  color?: string;
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
}
