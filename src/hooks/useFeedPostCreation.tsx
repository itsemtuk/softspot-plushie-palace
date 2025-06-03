
import { useCallback } from "react";
import { ExtendedPost, PostCreationData } from "@/types/core";
import { toast } from "@/components/ui/use-toast";
import { savePost } from "@/utils/postStorage";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";

export const useFeedPostCreation = (setPosts: React.Dispatch<React.SetStateAction<ExtendedPost[]>>) => {
  const { addOfflinePost } = useOfflinePostOperations();

  const handlePostCreated = useCallback(async (data: PostCreationData) => {
    try {
      const userId = getCurrentUserId();
      
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to create posts.",
        });
        return Promise.reject(new Error("Authentication required"));
      }

      const newPost: ExtendedPost = {
        ...data,
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        user_id: userId,
        username: 'You',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        content: data.description,
        forSale: false
      };

      toast({
        title: "Post created!",
        description: "Your post has been added to the feed.",
        duration: 3000,
      });

      setPosts(prevPosts => [newPost, ...prevPosts]);

      await Promise.all([
        savePost(newPost),
        addOfflinePost(newPost)
      ]);

      return Promise.resolve();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
      return Promise.reject(error);
    }
  }, [setPosts, addOfflinePost]);

  return { handlePostCreated };
};
