
import { ExtendedPost, MarketplacePlushie } from "@/types/marketplace";

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

export const validateMarketplacePlushies = (plushies: any[]): MarketplacePlushie[] => {
  if (!Array.isArray(plushies)) {
    console.warn('Plushies is not an array, returning empty array');
    return [];
  }
  
  return plushies.filter(plushie => {
    // Basic validation - must have required fields
    if (!plushie || typeof plushie !== 'object') return false;
    if (!plushie.id || !plushie.title) return false;
    
    return true;
  }).map(plushie => ({
    id: plushie.id || '',
    title: plushie.title || '',
    price: Number(plushie.price) || 0,
    image: plushie.image || '',
    brand: plushie.brand || undefined,
    condition: plushie.condition || undefined,
    description: plushie.description || '',
    tags: Array.isArray(plushie.tags) ? plushie.tags : [],
    likes: Number(plushie.likes) || 0,
    comments: Number(plushie.comments) || 0,
    forSale: Boolean(plushie.forSale),
    userId: plushie.userId || plushie.user_id || '',
    username: plushie.username || 'Anonymous',
    timestamp: plushie.timestamp || plushie.created_at || plushie.createdAt || new Date().toISOString(),
    location: plushie.location || '',
    material: plushie.material || undefined,
    filling: plushie.filling || undefined,
    species: plushie.species || undefined,
    deliveryMethod: plushie.deliveryMethod || undefined,
    deliveryCost: plushie.deliveryCost ? Number(plushie.deliveryCost) : undefined,
    size: plushie.size || undefined,
  }));
};
