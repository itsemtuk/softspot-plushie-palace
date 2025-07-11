
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { ExtendedPost, Comment } from "@/types/core";

const LOCAL_STORAGE_KEY = "offlinePosts";

export const useOfflinePostOperations = () => {
  const [offlinePosts, setOfflinePosts] = useState<ExtendedPost[]>(() => {
    try {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedPosts ? JSON.parse(storedPosts) : [];
    } catch (error) {
      console.error("Error parsing offline posts from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(offlinePosts));
    } catch (error) {
      console.error("Error saving offline posts to localStorage:", error);
      toast({
        variant: "destructive",
        title: "Offline Error",
        description: "Failed to save posts offline. Please check your browser settings.",
      });
    }
  }, [offlinePosts]);

  const addOfflinePost = (post: ExtendedPost) => {
    setOfflinePosts((prevPosts) => [...prevPosts, post]);
    toast({
      title: "Post Saved Offline",
      description: "Your post has been saved locally and will be synced when you reconnect.",
    });
  };

  const updateOfflinePost = (post: ExtendedPost) => {
    setOfflinePosts((prevPosts) => 
      prevPosts.map(p => p.id === post.id ? post : p)
    );
  };

  const deleteOfflinePost = (postId: string) => {
    setOfflinePosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const removeOfflinePost = (postId: string) => {
    setOfflinePosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const getAllOfflinePosts = () => {
    return Promise.resolve(offlinePosts);
  };

  const addOfflineComment = (postId: string, comment: Comment) => {
    console.log("Adding offline comment:", { postId, comment });
    // In a real implementation, you would store comments separately
  };

  const clearOfflinePosts = () => {
    setOfflinePosts([]);
  };

  return {
    offlinePosts,
    addOfflinePost,
    updateOfflinePost,
    deleteOfflinePost,
    removeOfflinePost,
    getAllOfflinePosts,
    addOfflineComment,
    clearOfflinePosts,
  };
};
