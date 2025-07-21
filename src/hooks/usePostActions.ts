
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { getSupabaseUserId } from "@/utils/userSync";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ExtendedPost } from "@/types/core";
import { deletePost, updatePost, archivePost } from "@/utils/posts/postManagement";
import { useAuth } from "@clerk/clerk-react";

export const usePostActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleEditPost = useCallback(
    (post: ExtendedPost) => {
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to edit posts.",
        });
        navigate("/sign-in");
        return;
      }

      // Navigate to the edit post page with the post ID
      navigate(`/edit-post/${post.id}`);
    },
    [user?.id, navigate]
  );

  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (!postId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid post ID",
        });
        return;
      }

      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to delete posts.",
        });
        return;
      }

      setIsLoading(true);

      try {
        const token = await getToken({ template: "supabase" });
        const supabaseUserId = await getSupabaseUserId(user.id);
        
        if (!supabaseUserId) {
          throw new Error("Could not find your user profile");
        }
        
        const result = await deletePost(postId, supabaseUserId, token || undefined);

        if (result.success) {
          toast({
            title: "Post deleted",
            description: "Your post has been successfully deleted.",
          });
        } else {
          throw new Error(result.error || "Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the post. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, getToken]
  );

  const handleUpdatePost = useCallback(
    async (postId: string, updatedPostData: Partial<ExtendedPost>) => {
      if (!postId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid post ID",
        });
        return;
      }

      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to update posts.",
        });
        return;
      }

      setIsLoading(true);

      try {
        const token = await getToken({ template: "supabase" });
        const supabaseUserId = await getSupabaseUserId(user.id);
        
        if (!supabaseUserId) {
          throw new Error("Could not find your user profile");
        }
        
        const result = await updatePost(postId, updatedPostData, token || undefined);

        if (result.success) {
          toast({
            title: "Post updated",
            description: "Your post has been successfully updated.",
          });
        } else {
          throw new Error(result.error || "Failed to update post");
        }
      } catch (error) {
        console.error("Error updating post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update the post. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, getToken]
  );

  const handleArchivePost = useCallback(
    async (postId: string) => {
      if (!postId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid post ID",
        });
        return;
      }
      if (!user?.id) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to archive posts.",
        });
        return;
      }
      setIsLoading(true);
      try {
        const token = await getToken({ template: "supabase" });
        const supabaseUserId = await getSupabaseUserId(user.id);
        
        if (!supabaseUserId) {
          throw new Error("Could not find your user profile");
        }
        
        const result = await archivePost(postId, supabaseUserId, token || undefined);
        if (result.success) {
          toast({
            title: "Post archived",
            description: "Your post has been archived.",
          });
        } else {
          throw new Error(result.error || "Failed to archive post");
        }
      } catch (error) {
        console.error("Error archiving post:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to archive the post. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, getToken]
  );

  return {
    isLoading,
    handleEditPost,
    handleDeletePost,
    handleUpdatePost,
    handleArchivePost,
  };
};
