
import { useState, useMemo } from "react";
import { ExtendedPost } from "@/types/core";

export const useFeedFilters = (posts: ExtendedPost[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const processedPosts = useMemo(() => {
    let filtered = posts;
    
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = posts.filter((post) =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === "popular") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });

    return sorted;
  }, [posts, searchQuery, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    processedPosts
  };
};
