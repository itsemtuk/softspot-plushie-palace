// Add missing types or correct existing types

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

export type Wishlist = {
  id: string;
  title: string;
  description?: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string; // Adding updatedAt as an optional field
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
};
