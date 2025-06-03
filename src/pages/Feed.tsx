
import { useState, useEffect, useCallback, useMemo } from "react";
import { Filter, Search, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { FeedContent } from "@/components/feed/FeedContent";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { ExtendedPost, PostCreationData } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { getAllPosts } from "@/utils/posts/postFetch";
import { getPosts, savePost } from "@/utils/postStorage";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { useCreatePost } from "@/hooks/use-create-post";
import { useSyncManager } from "@/hooks/useSyncManager";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";
import { PostDialog } from "@/components/PostDialog";

const Feed = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [layout, setLayout] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const { dialogState, openPostDialog, closePostDialog } = usePostDialog();
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();
  const syncManager = useSyncManager(posts);
  const { addOfflinePost } = useOfflinePostOperations();

  // Optimized fetchPosts with memoization
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use Promise.allSettled to prevent blocking on failures
      const [allPostsResult, userPostsResult] = await Promise.allSettled([
        getAllPosts(),
        getPosts()
      ]);
      
      const allPosts = allPostsResult.status === 'fulfilled' ? allPostsResult.value : [];
      const userPosts = userPostsResult.status === 'fulfilled' ? userPostsResult.value : [];
      
      // Efficient deduplication using Map
      const postMap = new Map();
      [...allPosts, ...userPosts].forEach(post => {
        if (post.id && !postMap.has(post.id)) {
          postMap.set(post.id, post);
        }
      });
      
      setPosts(Array.from(postMap.values()));
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load posts. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
  };

  // Optimized filtering and sorting with useMemo
  const processedPosts = useMemo(() => {
    let filtered = posts;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = posts.filter((post) =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
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

  const handlePostCreated = async (data: PostCreationData) => {
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

      // Create the new post
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

      // Show immediate feedback
      toast({
        title: "Post created!",
        description: "Your post has been added to the feed.",
        duration: 3000,
      });

      // Optimistically add the post to the feed
      setPosts(prevPosts => [newPost, ...prevPosts]);

      // Save the post
      await Promise.all([
        savePost(newPost),
        addOfflinePost(newPost)
      ]);

      // Close the post creation flow
      onClosePostCreation();

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
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="mb-4 rounded-2xl shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 rounded-full"
                />
              </div>
              <div className="space-x-2 flex items-center">
                <Select onValueChange={handleSortOrderChange} defaultValue={sortOrder}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setLayout(layout === "grid" ? "list" : "grid")}
                  className="rounded-full"
                >
                  {layout === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        ) : (
          <FeedGrid posts={processedPosts} onPostClick={handlePostClick} layout={layout} />
        )}

        {/* Post Creation Flow */}
        <PostCreationFlow
          isOpen={isPostCreationOpen}
          onClose={onClosePostCreation}
          onPostCreated={handlePostCreated}
        />

        {/* Post Dialog */}
        <PostDialog
          post={dialogState.post}
          isOpen={dialogState.isOpen}
          onClose={closePostDialog}
        />
      </div>
    </MainLayout>
  );
};

export default Feed;
