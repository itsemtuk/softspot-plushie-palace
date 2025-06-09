
import { useState, useMemo, useCallback, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import MainLayout from "@/components/layout/MainLayout";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { FeedSearchAndSort } from "@/components/feed/FeedSearchAndSort";
import { ExtendedPost } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { useCreatePost } from "@/hooks/use-create-post";
import { useSyncManager } from "@/hooks/useSyncManager";
import { PostDialog } from "@/components/PostDialog";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { useFeedData } from "@/hooks/useFeedData";
import { useFeedFilters } from "@/hooks/useFeedFilters";
import { useFeedPostCreation } from "@/hooks/useFeedPostCreation";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { SafeErrorBoundary } from "@/components/ui/safe-error-boundary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Feed = () => {
  const [layout, setLayout] = useState("grid");
  const { posts, setPosts, isLoading, error } = useFeedData();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder, processedPosts } = useFeedFilters(posts);
  const { handlePostCreated } = useFeedPostCreation(setPosts);
  const { dialogState, openPostDialog, closePostDialog } = usePostDialog();
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();
  const syncManager = useSyncManager(posts);

  // Memoize heavy computations to prevent freezing with useCallback to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => processedPosts, [processedPosts]);

  const handlePostClick = useCallback((post: ExtendedPost) => {
    try {
      openPostDialog(post);
    } catch (error) {
      console.error("Error opening post dialog:", error);
    }
  }, [openPostDialog]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const handleSortOrderChange = useCallback((value: string) => {
    setSortOrder(value);
  }, [setSortOrder]);

  const handleLayoutChange = useCallback(() => {
    setLayout(prev => prev === "grid" ? "list" : "grid");
  }, []);

  if (error) {
    return (
      <EnhancedErrorBoundary>
        <MainLayout>
          <div className="container mx-auto py-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Unable to load feed
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There was an error loading your feed. Please try refreshing the page.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-softspot-500 hover:bg-softspot-600 text-white px-4 py-2 rounded"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </MainLayout>
      </EnhancedErrorBoundary>
    );
  }

  // Add realtime subscription for new posts
  useEffect(() => {
    if (!posts.length) return;

    const postsSubscription = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('New post received:', payload);
          const newPost = payload.new as ExtendedPost;
          setPosts(prev => [newPost, ...prev]);
          
          toast({
            title: "New post available",
            description: "A new post has been added to the feed.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsSubscription);
    };
  }, [posts.length, setPosts]);

  return (
    <EnhancedErrorBoundary>
      <MainLayout>
        <div className="container mx-auto py-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <SafeErrorBoundary resetKeys={[searchQuery, sortOrder]}>
            <FeedSearchAndSort
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortOrder={sortOrder}
              onSortChange={handleSortOrderChange}
              layout={layout}
              onLayoutChange={handleLayoutChange}
            />
          </SafeErrorBoundary>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" />
            </div>
          ) : (
            <SafeErrorBoundary resetKeys={[memoizedPosts.length.toString(), layout]}>
              <FeedGrid 
                posts={memoizedPosts} 
                onPostClick={handlePostClick} 
                layout={layout} 
              />
            </SafeErrorBoundary>
          )}

          <SafeErrorBoundary resetKeys={[isPostCreationOpen.toString()]}>
            <PostCreationFlow
              isOpen={isPostCreationOpen}
              onClose={onClosePostCreation}
              onPostCreated={handlePostCreated}
            />
          </SafeErrorBoundary>

          <SafeErrorBoundary resetKeys={[dialogState.isOpen.toString(), dialogState.post?.id || ""]}>
            <PostDialog
              post={dialogState.post}
              isOpen={dialogState.isOpen}
              onClose={closePostDialog}
            />
          </SafeErrorBoundary>
        </div>
      </MainLayout>
    </EnhancedErrorBoundary>
  );
};

export default Feed;
