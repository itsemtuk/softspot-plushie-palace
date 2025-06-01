import { Database } from "@/integrations/supabase/types";

export type Post = Database["public"]["Tables"]["posts"]["Row"]

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  interests: string[];
  isPrivate: boolean;
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
  brand?: string; // Add missing brand property
  condition?: string;
  material?: string;
  filling?: string;
  species?: string;
  deliveryMethod?: string;
  deliveryCost?: number;
  size?: string;
}

export type PostCreationData = Omit<ExtendedPost, 'id' | 'userId' | 'username' | 'likes' | 'comments' | 'timestamp' | 'createdAt' | 'updatedAt' | 'user_id' | 'created_at'>;
