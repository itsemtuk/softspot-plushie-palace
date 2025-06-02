
import { useState, useEffect, useCallback } from "react";
import { Plus, Filter, Search, Grid3X3, List, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import MainLayout from "@/components/layout/MainLayout";
import { FeedContent } from "@/components/feed/FeedContent";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { ExtendedPost, PostCreationData } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { getAllPosts } from "@/utils/posts/postFetch";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { useCreatePost } from "@/hooks/use-create-post";
import { useSyncManager } from "@/hooks/useSyncManager";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";
import { toast } from "@/components/ui/use-toast";

const Feed = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [layout, setLayout] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const { openPostDialog } = usePostDialog();
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();
  const syncManager = useSyncManager(posts);
  const { addOfflinePost } = useOfflinePostOperations();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
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

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOrder === "popular") {
      return (b.likes || 0) - (a.likes || 0);
    }
    return 0;
  });

  const handlePostCreated = async (data: PostCreationData) => {
    try {
      // Optimistically add the post to the feed
      const newPost: ExtendedPost = {
        ...data,
        id: `post-${Date.now()}`,
        userId: 'offline-user',
        user_id: 'offline-user',
        username: 'Offline User',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        content: data.description,
        forSale: false
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);

      // Save the post offline
      await addOfflinePost(newPost);

      // Close the post creation flow
      onClosePostCreation();

      return Promise.resolve();
    } catch (error) {
      console.error("Error creating post:", error);
      return Promise.reject(error);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="mb-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <Input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full md:w-auto"
              />
              <div className="space-x-2 flex items-center">
                <Select onValueChange={handleSortOrderChange} defaultValue={sortOrder}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setLayout(layout === "grid" ? "list" : "grid")}>
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
          <FeedGrid posts={sortedPosts} onPostClick={handlePostClick} />
        )}
      </div>
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={onClosePostCreation}
        onPostCreated={handlePostCreated}
      />
    </MainLayout>
  );
};

export default Feed;
