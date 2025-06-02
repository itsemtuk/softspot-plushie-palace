
// Re-export all post-related functions from their new modules
export {
  getPosts,
  getAllPosts,
  fetchPosts
} from './posts/postFetch';

export {
  savePost,
  addPost,
  updatePost,
  deletePost
} from './posts/postManagement';

export {
  uploadImage,
  deleteImage
} from './storage/imageStorage';

export {
  savePosts,
  getLocalPosts,
  saveMarketplaceListings,
  getMarketplaceListings,
  setCurrentUserId,
  getCurrentUserId
} from './storage/localStorageUtils';
