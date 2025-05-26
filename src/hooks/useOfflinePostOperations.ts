
import { useCallback } from 'react';
import { ExtendedPost } from '@/types/marketplace';
import { useSyncManager } from '@/hooks/useSyncManager';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { savePost as savePostToStorage, deletePost as deletePostFromStorage } from '@/utils/posts/postManagement';
import { toast } from '@/hooks/use-toast';

export const useOfflinePostOperations = () => {
  const { isOnline, supabaseConnected } = useConnectionStatus();
  const { addPendingSync } = useSyncManager();

  const savePost = useCallback(async (post: ExtendedPost, isNewPost = false) => {
    // Always save locally first
    const result = await savePostToStorage(post);
    
    if (!result.success) {
      return result;
    }

    // If offline or no connection, queue for sync
    if (!isOnline || !supabaseConnected) {
      addPendingSync({
        id: post.id,
        type: isNewPost ? 'create' : 'update',
        data: post
      });
      
      toast({
        title: isNewPost ? "Post Created" : "Post Updated",
        description: "Changes will sync when you're back online.",
        duration: 3000
      });
    } else {
      toast({
        title: isNewPost ? "Post Created" : "Post Updated",
        description: "Changes synced successfully."
      });
    }

    return result;
  }, [isOnline, supabaseConnected, addPendingSync]);

  const deletePost = useCallback(async (postId: string) => {
    // Always delete locally first
    const result = await deletePostFromStorage(postId);
    
    if (!result.success) {
      return result;
    }

    // If offline or no connection, queue for sync
    if (!isOnline || !supabaseConnected) {
      addPendingSync({
        id: postId,
        type: 'delete'
      });
      
      toast({
        title: "Post Deleted",
        description: "Changes will sync when you're back online.",
        duration: 3000
      });
    } else {
      toast({
        title: "Post Deleted",
        description: "Changes synced successfully."
      });
    }

    return result;
  }, [isOnline, supabaseConnected, addPendingSync]);

  return {
    savePost,
    deletePost
  };
};
