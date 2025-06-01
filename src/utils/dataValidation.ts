
import { ExtendedPost, MarketplacePlushie } from "@/types/marketplace";

export const validatePosts = (posts: any[]): ExtendedPost[] => {
  if (!Array.isArray(posts)) {
    console.warn('validatePosts: Expected array, got:', typeof posts);
    return [];
  }

  return posts.filter(post => {
    if (!post || typeof post !== 'object') {
      console.warn('validatePosts: Invalid post object:', post);
      return false;
    }
    return true;
  }).map(post => ({
    id: post.id || `post-${Date.now()}-${Math.random()}`,
    userId: post.userId || post.user_id || 'unknown',
    user_id: post.user_id || post.userId || 'unknown',
    username: post.username || 'Unknown User',
    image: post.image || '',
    title: post.title || '',
    description: post.description || '',
    content: post.content || post.description || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes: Number(post.likes) || 0,
    comments: Number(post.comments) || 0,
    timestamp: post.timestamp || post.created_at || new Date().toISOString(),
    createdAt: post.createdAt || post.created_at || new Date().toISOString(),
    created_at: post.created_at || post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || post.created_at || new Date().toISOString(),
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
    sold: Boolean(post.sold),
    color: post.color || undefined
  }));
};

export const validateMarketplacePlushies = (plushies: any[]): MarketplacePlushie[] => {
  if (!Array.isArray(plushies)) {
    console.warn('validateMarketplacePlushies: Expected array, got:', typeof plushies);
    return [];
  }

  return plushies.filter(plushie => {
    if (!plushie || typeof plushie !== 'object') {
      console.warn('validateMarketplacePlushies: Invalid plushie object:', plushie);
      return false;
    }
    return true;
  }).map(plushie => ({
    id: plushie.id || `plushie-${Date.now()}-${Math.random()}`,
    name: plushie.name || plushie.title || '',
    title: plushie.title || plushie.name || '',
    price: Number(plushie.price) || 0,
    image: plushie.image || plushie.imageUrl || '',
    imageUrl: plushie.imageUrl || plushie.image || '',
    brand: plushie.brand || '',
    condition: plushie.condition || '',
    description: plushie.description || '',
    tags: Array.isArray(plushie.tags) ? plushie.tags : [],
    likes: Number(plushie.likes) || 0,
    comments: Number(plushie.comments) || 0,
    forSale: Boolean(plushie.forSale),
    userId: plushie.userId || plushie.user_id || 'unknown',
    username: plushie.username || 'Unknown User',
    timestamp: plushie.timestamp || plushie.created_at || new Date().toISOString(),
    location: plushie.location || '',
    material: plushie.material || '',
    filling: plushie.filling || '',
    species: plushie.species || '',
    deliveryMethod: plushie.deliveryMethod || '',
    deliveryCost: plushie.deliveryCost ? Number(plushie.deliveryCost) : undefined,
    size: plushie.size || '',
    color: plushie.color || '',
    discount: plushie.discount ? Number(plushie.discount) : undefined,
    originalPrice: plushie.originalPrice ? Number(plushie.originalPrice) : undefined
  }));
};
