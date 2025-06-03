
import { useState } from "react";
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

const Feed = () => {
  const [layout, setLayout] = useState("grid");
  const { posts, setPosts, isLoading } = useFeedData();
  const { searchQuery, setSearchQuery, sortOrder, setSortOrder, processedPosts } = useFeedFilters(posts);
  const { handlePostCreated } = useFeedPostCreation(setPosts);
  const { dialogState, openPostDialog, closePostDialog } = usePostDialog();
  const { isPostCreationOpen, setIsPostCreationOpen, onClosePostCreation } = useCreatePost();
  const syncManager = useSyncManager(posts);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
  };

  const handleLayoutChange = () => {
    setLayout(layout === "grid" ? "list" : "grid");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <FeedSearchAndSort
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortOrder={sortOrder}
          onSortChange={handleSortOrderChange}
          layout={layout}
          onLayoutChange={handleLayoutChange}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        ) : (
          <FeedGrid posts={processedPosts} onPostClick={handlePostClick} layout={layout} />
        )}

        <PostCreationFlow
          isOpen={isPostCreationOpen}
          onClose={onClosePostCreation}
          onPostCreated={handlePostCreated}
        />

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
