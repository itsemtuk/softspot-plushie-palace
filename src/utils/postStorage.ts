
// Re-export all post-related functions from their new modules
export {
  getPosts,
  getUserPosts,
  getPostById
} from './posts/postFetch';

export {
  savePost,
  addPost,
  updatePost,
  deletePost
} from './posts/postManagement';

export {
  togglePostLike,
  sharePost,
  likePost,
  likeComment
} from './posts/postInteraction';

export {
  uploadImage,
  deleteImage
} from './storage/imageStorage';

export {
  savePosts,
  getLocalPosts
} from './storage/localStorageUtils';
