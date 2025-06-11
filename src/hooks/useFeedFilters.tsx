
import { useState, useMemo, useCallback } from "react";
import { ExtendedPost } from "@/types/core";

export function useFeedFilters(posts: ExtendedPost[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const processedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    let filtered = [...posts];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.timestamp || b.created_at || 0).getTime() - 
                 new Date(a.timestamp || a.created_at || 0).getTime();
        case "oldest":
          return new Date(a.timestamp || a.created_at || 0).getTime() - 
                 new Date(b.timestamp || b.created_at || 0).getTime();
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [posts, searchQuery, sortOrder]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortOrder(sort);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    sortOrder,
    setSortOrder: handleSortChange,
    processedPosts
  };
}
