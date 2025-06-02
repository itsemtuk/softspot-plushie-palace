
import { ExtendedPost } from "@/types/core";

const POSTS_STORAGE_KEY = 'offline_posts';
const USER_ID_KEY = 'current_user_id';
const MARKETPLACE_STORAGE_KEY = 'marketplace_listings';

export const savePosts = (posts: ExtendedPost[]): void => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to localStorage:', error);
  }
};

export const getLocalPosts = (): ExtendedPost[] => {
  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading posts from localStorage:', error);
    return [];
  }
};

export const saveMarketplaceListings = (listings: ExtendedPost[]): void => {
  try {
    localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(listings));
  } catch (error) {
    console.error('Error saving marketplace listings to localStorage:', error);
  }
};

export const getMarketplaceListings = (): ExtendedPost[] => {
  try {
    const stored = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading marketplace listings from localStorage:', error);
    return [];
  }
};

export const setCurrentUserId = (userId: string): void => {
  try {
    localStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error saving user ID to localStorage:', error);
  }
};

export const getCurrentUserId = (): string | null => {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error reading user ID from localStorage:', error);
    return null;
  }
};
