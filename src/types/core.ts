
import { Database } from "@/integrations/supabase/types";

export type Post = Database["public"]["Tables"]["posts"]["Row"] & {
  image?: string;
  imageUrl?: string;
  title?: string;
  tags?: string[];
  username?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
  // Add ExtendedPost compatibility fields
  userId?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  forSale?: boolean;
  price?: number;
  brand?: string;
  condition?: string;
  material?: string;
  filling?: string;
  species?: string;
  deliveryMethod?: string;
  deliveryCost?: number;
  size?: string;
  sold?: boolean;
  color?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  text?: string; // Keep for backward compatibility
  content: string; // Add content property
  likes: number;
  timestamp: string;
  isLiked?: boolean; // Add isLiked property
}

export interface ExtendedPost {
  id: string;
  userId: string;
  user_id: string; // Keep both for compatibility
  username: string;
  image: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  createdAt: string;
  created_at: string; // Keep both for compatibility
  updatedAt: string;
  location?: string;
  forSale?: boolean;
  price?: number;
  brand?: string;
  condition?: string;
  material?: string;
  filling?: string;
  species?: string;
  deliveryMethod?: string;
  deliveryCost?: number;
  size?: string;
  sold?: boolean; // Add sold property for badges
  color?: string; // Add color property
  archived?: boolean; // Add archived property for archive feature
}

export type PostCreationData = Omit<ExtendedPost, 'id' | 'userId' | 'username' | 'likes' | 'comments' | 'timestamp' | 'createdAt' | 'updatedAt' | 'user_id' | 'created_at'>;

export type PlushieFilling = 'cotton' | 'polyester' | 'beads' | 'memory-foam' | 'other';
