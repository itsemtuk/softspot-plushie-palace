
import { MarketplacePlushie, ExtendedPost } from '@/types/marketplace';

// Utility function to safely convert values to numbers
export const safeNumber = (value: any, fallback: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  
  return fallback;
};

// Utility function to safely convert values to integers
export const safeInteger = (value: any, fallback: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return Math.floor(value);
  }
  
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
  
  return fallback;
};

// Validate and sanitize marketplace plushie data
export const validateMarketplacePlushie = (data: any): MarketplacePlushie | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  try {
    return {
      id: data.id || `plushie-${Date.now()}`,
      userId: data.userId || data.user_id || '',
      name: data.name || data.title || 'Unnamed Plushie',
      title: data.title || data.name || 'Unnamed Plushie',
      image: data.image || data.imageUrl || '',
      imageUrl: data.imageUrl || data.image || '',
      username: data.username || 'Unknown',
      likes: safeInteger(data.likes),
      comments: safeInteger(data.comments),
      price: safeNumber(data.price),
      forSale: Boolean(data.forSale),
      condition: data.condition || 'Unknown',
      description: data.description || '',
      color: data.color || '',
      material: data.material || '',
      brand: data.brand || '',
      size: data.size || '',
      filling: data.filling || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      timestamp: data.timestamp || new Date().toISOString(),
      species: data.species || '',
      location: data.location || '',
      deliveryCost: safeNumber(data.deliveryCost),
      discount: safeNumber(data.discount),
      originalPrice: data.originalPrice ? safeNumber(data.originalPrice) : undefined
    };
  } catch (error) {
    console.error('Error validating marketplace plushie:', error);
    return null;
  }
};

// Validate and sanitize post data
export const validatePost = (data: any): ExtendedPost | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  try {
    return {
      id: data.id || `post-${Date.now()}`,
      userId: data.userId || data.user_id || '',
      user_id: data.user_id || data.userId || '',
      title: data.title || '',
      description: data.description || data.content || '',
      content: data.content || data.description || '',
      image: data.image || data.imageUrl || '',
      username: data.username || 'Anonymous',
      likes: safeInteger(data.likes),
      comments: safeInteger(data.comments),
      timestamp: data.timestamp || new Date().toISOString(),
      createdAt: data.createdAt || data.created_at || data.timestamp || new Date().toISOString(),
      created_at: data.created_at || data.createdAt || data.timestamp || new Date().toISOString(),
      updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
      tags: Array.isArray(data.tags) ? data.tags : [],
      location: data.location || '',
      forSale: Boolean(data.forSale),
      
      // Optional marketplace fields
      price: data.price ? safeNumber(data.price) : undefined,
      condition: data.condition || undefined,
      color: data.color || undefined,
      material: data.material || undefined,
      brand: data.brand || undefined,
      size: data.size || undefined,
      filling: data.filling || undefined,
      species: data.species || undefined,
      deliveryCost: data.deliveryCost ? safeNumber(data.deliveryCost) : undefined,
      discount: data.discount ? safeNumber(data.discount) : undefined,
      originalPrice: data.originalPrice ? safeNumber(data.originalPrice) : undefined,
      name: data.name || data.title || undefined
    };
  } catch (error) {
    console.error('Error validating post:', error);
    return null;
  }
};

// Validate array of marketplace plushies
export const validateMarketplacePlushies = (data: any[]): MarketplacePlushie[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(validateMarketplacePlushie)
    .filter((item): item is MarketplacePlushie => item !== null);
};

// Validate array of posts
export const validatePosts = (data: any[]): ExtendedPost[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(validatePost)
    .filter((item): item is ExtendedPost => item !== null);
};
