
import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedContent } from "@/components/feed/FeedContent";
import { useCreatePost } from "@/hooks/use-create-post";
import { getAllPosts } from "@/utils/posts/postFetch";
import { PostCreationData, ExtendedPost } from "@/types/core";
import { addPost } from "@/utils/posts/postManagement";

export default function Feed() {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isPostCreationOpen } = useCreatePost();

  const fetchAndSetPosts = useCallback(async () => {
    if (!isInitialized) {
      setIsLoading(true);
    }
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    fetchAndSetPosts();
  }, [fetchAndSetPosts, isPostCreationOpen]);

  const handleCreatePost = async (postData: PostCreationData) => {
    try {
      const newPost: ExtendedPost = {
        ...postData,
        id: `post-${Date.now()}`,
        userId: "test-user-id",
        user_id: "test-user-id",
        username: "Test User",
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await addPost(newPost);
      if (result.success) {
        setPosts([newPost, ...posts]);
      } else {
        console.error("Failed to add post:", result.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCreatePostClick = () => {
    console.log("Create post clicked");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAndSetPosts();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Don't render until initialized to prevent freezing
  if (!isInitialized && isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <FeedHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreatePost={handleCreatePostClick}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        
        <FeedContent
          initialPosts={posts}
          isLoading={isLoading}
          isError={false}
          isOnline={true}
          onRefresh={handleRefresh}
        />
      </div>
    </MainLayout>
  );
}
