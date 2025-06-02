
export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  interests: string[];
  isPrivate: boolean;
  avatar?: string;
  followersCount?: number;
  joinDate?: string;
  followingCount?: number;
  postsCount?: number;
  collectionsCount?: number;
  marketplaceListingsCount?: number;
}

export interface UserPrivacySettings {
  isPrivate: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  allowTradeRequests: boolean;
  // Add missing properties
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  allowFriendRequests: boolean;
  messagePermission: boolean;
  showActivity: boolean;
  hideFromSearch: boolean;
  allowComments: boolean;
  showCollections: boolean;
  showWishlist: boolean;
}

export interface WishlistItem {
  id: string;
  plushieId: string;
  userId: string;
  addedAt: string;
  name?: string;
  title?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  image?: string;
  linkUrl?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'wanted' | 'purchased' | 'received';
  currencyCode?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
  plushie?: {
    id: string;
    name?: string;
    title?: string;
    price: number;
    imageUrl?: string;
    image?: string;
    description: string;
    condition: string;
    material: string;
    species: string;
    size: string;
    filling: string;
    tags: string[];
    location: string;
    forSale: boolean;
    likes: number;
    comments: number;
  };
}

export interface Wishlist {
  id: string;
  userId: string;
  name?: string; // Add name property
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean; // Add isPublic property
}
