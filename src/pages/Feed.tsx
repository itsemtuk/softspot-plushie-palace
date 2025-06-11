
import { useState, useMemo, useCallback, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import MainLayout from "@/components/layout/MainLayout";
import { VirtualizedFeedGrid } from "@/components/feed/VirtualizedFeedGrid";
import { FeedSearchAndSort } from "@/components/feed/FeedSearchAndSort";
import { ExtendedPost } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { useCreatePost } from "@/hooks/use-create-post";
import { PostDialog } from "@/components/PostDialog";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { useFeedData } from "@/hooks/useFeedData";
import { useFeedFilters } from "@/hooks/useFeedFilters";
import { useFeedPostCreation } from "@/hooks/useFeedPostCreation";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { SafeErrorBoundary } from "@/components/ui/safe-error-boundary";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/ui/pagination";
import { UserSearchAndFollow } from "@/components/user/UserSearchAndFollow";

const Feed = () => {
  const [layout, setLayout] = useState("grid");
  const { posts, setPosts, isLoading, error } = useFeedData();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder, processedPosts } = useFeedFilters(posts);
  const { handlePostCreated } = useFeedPostCreation(setPosts);
  const { dialogState, openPostDialog, closePostDialog } = usePostDialog();
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();

  // Add pagination for performance
  const { currentPage, totalPages, paginatedData, goToPage } = usePagination({
    data: processedPosts,
    itemsPerPage: 20 // Reduced for better performance
  });

  const handlePostClick = useCallback((post: ExtendedPost) => {
    try {
      openPostDialog(post);
    } catch (error) {
      console.error("Error opening post dialog:", error);
    }
  }, [openPostDialog]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    goToPage(1); // Reset to first page when searching
  }, [setSearchQuery, goToPage]);

  const handleSortOrderChange = useCallback((value: string) => {
    setSortOrder(value);
    goToPage(1); // Reset to first page when sorting
  }, [setSortOrder, goToPage]);

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

  return (
    <EnhancedErrorBoundary>
      <MainLayout>
        <div className="container mx-auto py-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with user search */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <UserSearchAndFollow />
              </div>
            </div>

            {/* Main feed */}
            <div className="lg:col-span-3">
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
                <>
                  <SafeErrorBoundary resetKeys={[paginatedData.length.toString(), layout]}>
                    <VirtualizedFeedGrid 
                      posts={paginatedData} 
                      onPostClick={handlePostClick} 
                      layout={layout} 
                    />
                  </SafeErrorBoundary>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

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
