import { ExtendedPost } from "@/types/marketplace";

export const validatePosts = (posts: any[]): ExtendedPost[] => {
  if (!Array.isArray(posts)) {
    console.warn('Posts is not an array, returning empty array');
    return [];
  }
  
  return posts.filter(post => {
    // Basic validation - must have required fields
    if (!post || typeof post !== 'object') return false;
    if (!post.id || !post.title) return false;
    
    return true;
  }).map(post => ({
    id: post.id || '',
    userId: post.userId || post.user_id || '',
    user_id: post.user_id || post.userId || '',
    username: post.username || 'Anonymous',
    image: post.image || '',
    title: post.title || '',
    description: post.description || post.content || '',
    content: post.content || post.description || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes: Number(post.likes) || 0,
    comments: Number(post.comments) || 0,
    timestamp: post.timestamp || post.created_at || post.createdAt || new Date().toISOString(),
    createdAt: post.createdAt || post.created_at || post.timestamp || new Date().toISOString(),
    created_at: post.created_at || post.createdAt || post.timestamp || new Date().toISOString(),
    updatedAt: post.updatedAt || post.updated_at || post.createdAt || post.created_at || new Date().toISOString(),
    location: post.location || '',
    forSale: Boolean(post.forSale),
    price: post.price ? Number(post.price) : undefined,
    brand: post.brand || undefined,
    condition: post.condition || undefined,
    material: post.material || undefined,
    filling: post.filling || undefined,
    species: post.species || undefined,
    deliveryMethod: post.deliveryMethod || undefined,
    deliveryCost: post.deliveryCost ? Number(post.deliveryCost) : undefined,
    size: post.size || undefined,
  }));
};
