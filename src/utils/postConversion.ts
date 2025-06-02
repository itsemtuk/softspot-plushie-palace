import { Post, ExtendedPost } from "@/types/core";

export const convertPostToExtendedPost = (post: Post): ExtendedPost => {
  return {
    id: post.id || '',
    userId: post.userId || post.user_id || '',
    user_id: post.user_id || post.userId || '',
    username: post.username || 'Unknown User',
    image: post.image || '',
    title: post.title || '',
    description: post.description || '',
    content: post.content || post.description || '',
    tags: post.tags || [],
    likes: post.likes || 0,
    comments: post.comments || 0,
    timestamp: post.timestamp || post.created_at || new Date().toISOString(),
    createdAt: post.createdAt || post.created_at || new Date().toISOString(),
    created_at: post.created_at || post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || post.created_at || new Date().toISOString(),
    location: post.location,
    forSale: post.forSale || false,
    price: post.price,
    brand: post.brand,
    condition: post.condition,
    material: post.material,
    filling: post.filling,
    species: post.species,
    deliveryMethod: post.deliveryMethod,
    deliveryCost: post.deliveryCost,
    size: post.size,
    sold: post.sold,
    color: post.color
  };
};

export const convertPostsToExtendedPosts = (posts: Post[]): ExtendedPost[] => {
  return posts.map(convertPostToExtendedPost);
};
