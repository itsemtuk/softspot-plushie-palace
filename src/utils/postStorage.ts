
// Re-export all post-related functions from their new modules
export {
  savePost,
  getPosts,
  getUserPosts,
  addPost,
  updatePost,
  deletePost,
  togglePostLike
} from './posts/postUtils';

export {
  uploadImage,
  deleteImage
} from './storage/imageStorage';

export {
  savePosts,
  getLocalPosts
} from './storage/localStorageUtils';
