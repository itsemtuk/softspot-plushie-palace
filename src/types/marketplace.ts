
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
  condition?: string;
  description?: string;
  color?: string;
  material?: string;
  brand?: string;
  size?: string;
  filling?: string;
  tags?: string[];
  timestamp: string;
  species?: string;
  location?: string;
  deliveryCost: number;
  discount?: number;
  originalPrice?: number | null;
}

export interface MarketplaceFilters {
  color?: string[];
  material?: string[];
  filling?: string[];
  species?: string[];
  brands?: string[];
  condition?: string[];
}

export interface ImageUploadResult {
  url: string;
  success?: boolean;
  error?: string;
  file?: File;
  type?: string;
  name?: string;
}

// Additional interfaces needed for the application
export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY";

export interface ExtendedPost extends MarketplacePlushie {
  likedBy?: string[];
  commentCount?: number;
  viewCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface PostCreationData {
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  location?: string;
  price?: number;
  forSale?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  location?: string;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
  lastUpdated: string;
}

export interface WishlistItem {
  id: string;
  plushieId: string;
  dateAdded: string;
}

export interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface UserPrivacySettings {
  userId: string;
  privateAccount: boolean;
  hideFromSearch: boolean;
  showActivityStatus: boolean;
  showCollectionPublicly: boolean;
  showWishlistPublicly: boolean;
}

export interface ImageEditorOptions {
  aspectRatio?: number;
  crop?: boolean;
  rotate?: boolean;
  flip?: boolean;
  filters?: boolean;
}

export enum PlushieCondition {
  NEW_WITH_TAGS = "New with tags",
  NEW_WITHOUT_TAGS = "New without tags",
  LIKE_NEW = "Like new",
  GOOD = "Good",
  FAIR = "Fair",
  WELL_LOVED = "Well loved"
}

export enum PlushieMaterial {
  PLUSH = "Plush",
  MINKY = "Minky",
  FLEECE = "Fleece",
  COTTON = "Cotton",
  ACRYLIC = "Acrylic",
  FUR = "Fur",
  OTHER = "Other"
}

export enum PlushieFilling {
  POLYESTER = "Polyester",
  COTTON = "Cotton",
  BEANS = "Beans",
  PELLETS = "Pellets",
  FOAM = "Foam",
  MEMORY_FOAM = "Memory foam",
  OTHER = "Other"
}

export enum PlushieSpecies {
  BEAR = "Bear",
  BUNNY = "Bunny",
  CAT = "Cat",
  DOG = "Dog",
  DRAGON = "Dragon",
  UNICORN = "Unicorn",
  FOX = "Fox",
  PANDA = "Panda",
  DINOSAUR = "Dinosaur",
  OTHER = "Other"
}

export enum DeliveryMethod {
  STANDARD = "Standard shipping",
  EXPRESS = "Express shipping",
  INTERNATIONAL = "International shipping",
  LOCAL_PICKUP = "Local pickup",
  FREE = "Free shipping"
}

export interface PlushieBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  featured: boolean;
  products: MarketplacePlushie[];
}
