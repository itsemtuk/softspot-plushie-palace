
import { useCallback } from "react";
import { ExtendedPost, PostCreationData } from "@/types/core";
import { toast } from "@/components/ui/use-toast";
import { addPost } from "@/utils/posts/postManagement";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";
import { useUser, useAuth } from "@clerk/clerk-react";

export const useFeedPostCreation = (setPosts: React.Dispatch<React.SetStateAction<ExtendedPost[]>>) => {
  const { addOfflinePost } = useOfflinePostOperations();
  const { user } = useUser();
  const { getToken } = useAuth();

  const handlePostCreated = useCallback(async (data: PostCreationData) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      const newPost: ExtendedPost = {
        id: crypto.randomUUID(),
        userId: user.id,
        user_id: user.id,
        username: user.username || user.firstName || "Current User",
        content: data.description,
        image: data.image,
        title: data.title,
        description: data.description,
        tags: data.tags,
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        forSale: false,
      };

      // Get Clerk token for authenticated request
      const token = await getToken({ template: "supabase" });
      
      // Save to Supabase
      const result = await addPost(newPost, token || undefined);
      
      if (result.success) {
        toast({
          title: "Post created!",
          description: "Your post has been added to the feed.",
          duration: 3000,
        });

        setPosts(prevPosts => [newPost, ...prevPosts]);
        await addOfflinePost(newPost);
      } else {
        throw new Error(result.error || "Failed to create post");
      }

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
  }, [addOfflinePost, setPosts, user, getToken]);

  return { handlePostCreated };
};
