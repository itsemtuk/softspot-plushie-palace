
export type PlushieCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
export type PlushieSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';
export type PlushieMaterial = 'Cotton' | 'Polyester' | 'Plush' | 'Fur' | 'Velvet' | 'Other';
export type PlushieFilling = 'Cotton' | 'Polyester' | 'Beads' | 'Memory Foam' | 'Other';
export type PlushieSpecies = 'Bear' | 'Cat' | 'Dog' | 'Rabbit' | 'Mythical' | 'Other';
export type PlushieBrand = 'Build-A-Bear' | 'Squishmallows' | 'Jellycat' | 'Care Bears' | 'Disney' | 'Other';

// Define the filter types
export interface MarketplaceFilters {
  color?: string[];
  material?: PlushieMaterial[];
  filling?: PlushieFilling[];
  species?: PlushieSpecies[];
  brand?: PlushieBrand[];
}

export interface MarketplacePlushie {
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
  size?: PlushieSize;
  material: PlushieMaterial;
  filling: PlushieFilling;
  species: PlushieSpecies;
  brand: PlushieBrand;
  deliveryMethod?: 'Shipping' | 'Collection' | 'Both';
  deliveryCost?: number;
  tags?: string[];
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';
export type PrivacySetting = 'Public' | 'Followers' | 'Private';

export interface UserPrivacySettings {
  profileVisibility: PrivacySetting;
  postsVisibility: PrivacySetting;
  listingsVisibility: PrivacySetting;
  allowMessages: 'Everyone' | 'Followers' | 'Nobody';
  showActivity: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface TradeRequest {
  id: string;
  senderId: string;
  recipientId: string;
  senderPlushie: MarketplacePlushie;
  requestMessage: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  timestamp: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  plushies: MarketplacePlushie[];
  isPrivate: boolean;
}
