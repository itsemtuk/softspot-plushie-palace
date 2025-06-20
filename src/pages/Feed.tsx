
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedContent } from "@/components/feed/FeedContent";
import { useCreatePost } from "@/hooks/use-create-post";
import { getAllPosts } from "@/utils/posts/postFetch";
import { PostCreationData, ExtendedPost } from "@/types/core";
import { addPost } from "@/utils/posts/postManagement";
import PostCreationFlow from "@/components/post/PostCreationFlow";

export default function Feed() {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isPostCreationOpen, setIsPostCreationOpen } = useCreatePost();

  const fetchAndSetPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetPosts();
  }, [fetchAndSetPosts]);

  // Memoize filtered posts to prevent unnecessary re-renders
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.content?.toLowerCase().includes(query) ||
      post.title?.toLowerCase().includes(query) ||
      post.username?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const handleCreatePost = useCallback(async (postData: PostCreationData) => {
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
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setIsPostCreationOpen(false);
      } else {
        console.error("Failed to add post:", result.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }, [setIsPostCreationOpen]);

  const handleCreatePostClick = useCallback(() => {
    console.log("Create post clicked");
    setIsPostCreationOpen(true);
  }, [setIsPostCreationOpen]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchAndSetPosts();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchAndSetPosts]);

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
          initialPosts={filteredPosts}
          isLoading={isLoading}
          isError={false}
          isOnline={true}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Post Creation Flow */}
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </MainLayout>
  );
}
