import { ExtendedPost } from '@/types/core';

interface RawPost {
  id: string;
  user_id: string;
  title?: string | null;
  content: string;
  description?: string | null;
  image?: string | null;
  created_at: string;
  updated_at?: string | null;
  for_sale?: boolean | null;
  archived?: boolean | null;
  [key: string]: any;
}

interface UserInfo {
  username?: string | null;
  first_name?: string | null;
  avatar_url?: string | null;
  [key: string]: any;
}

interface FormatOptions {
  forSale?: boolean;
  defaultUsername?: string;
}

export function formatPost(
  post: RawPost, 
  userInfo?: UserInfo, 
  options: FormatOptions = {}
): ExtendedPost {
  const {
    forSale = Boolean(post.for_sale),
    defaultUsername = 'User'
  } = options;

  return {
    id: post.id,
    userId: post.user_id,
    user_id: post.user_id,
    username: userInfo?.username || userInfo?.first_name || defaultUsername,
    image: post.image || '',
    title: post.title || '',
    description: post.description || '',
    content: post.content,
    tags: [],
    likes: 0,
    comments: 0,
    timestamp: post.created_at,
    createdAt: post.created_at,
    created_at: post.created_at,
    updatedAt: post.updated_at || post.created_at,
    location: '',
    forSale,
    sold: false,
    archived: Boolean(post.archived)
  };
}

export function formatFeedPost(post: RawPost, userInfo?: UserInfo): ExtendedPost {
  return formatPost(post, userInfo, { forSale: false });
}

export function formatMarketplacePost(post: RawPost, userInfo?: UserInfo): ExtendedPost {
  return formatPost(post, userInfo, { forSale: true });
}