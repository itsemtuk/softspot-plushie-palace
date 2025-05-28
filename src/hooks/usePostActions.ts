
import { useUser } from '@clerk/clerk-react';
import { setCurrentUserContext } from '@/utils/supabase/rls';
import { supabase } from '@/utils/supabase/client';
import { ExtendedPost } from '@/types/marketplace';
import { getLocalPosts, savePosts } from '@/utils/storage/localStorageUtils';

export const usePostActions = () => {
  const { user } = useUser();

  const createPost = async (postData: Omit<ExtendedPost, 'id' | 'userId' | 'timestamp' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): Promise<ExtendedPost> => {
    if (!user) throw new Error('Authentication required');
    
    const newPost: ExtendedPost = {
      ...postData,
      id: `post-${Date.now()}`,
      userId: user.id,
      username: user.username || user.firstName || 'User',
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setCurrentUserContext(user.id);
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          id: newPost.id,
          user_id: newPost.userId,
          content: JSON.stringify({
            image: newPost.image,
            title: newPost.title,
            description: newPost.description || '',
            tags: newPost.tags || [],
          }),
          created_at: newPost.timestamp,
        });

      if (error) throw error;
      return newPost;
    } catch (error) {
      console.error('Database insert failed, using localStorage:', error);
      
      // Fallback to localStorage
      const existingPosts = getLocalPosts();
      const updatedPosts = [newPost, ...existingPosts];
      savePosts(updatedPosts);
      
      return newPost;
    }
  };

  const deletePost = async (postId: string): Promise<void> => {
    if (!user) throw new Error('Authentication required');

    try {
      await setCurrentUserContext(user.id);
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Database delete failed, using localStorage:', error);
      
      // Fallback to localStorage
      const existingPosts = getLocalPosts();
      const updatedPosts = existingPosts.filter(post => post.id !== postId);
      savePosts(updatedPosts);
    }
  };

  return { createPost, deletePost };
};
