
import { FixedSizeGrid as Grid } from 'react-window';
import { ExtendedPost } from "@/types/core";
import { PostCard } from "@/components/post/PostCard";
import { useMemo, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VirtualizedFeedGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  layout?: string;
}

const ITEM_HEIGHT = 400;
const ITEM_WIDTH = 300;
const GAP = 16;

export function VirtualizedFeedGrid({ posts, onPostClick, layout = "grid" }: VirtualizedFeedGridProps) {
  const isMobile = useIsMobile();
  
  const gridConfig = useMemo(() => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const maxWidth = Math.min(screenWidth - 32, 1200);
    
    let columns = 1;
    if (!isMobile && layout === "grid") {
      columns = Math.floor((maxWidth + GAP) / (ITEM_WIDTH + GAP));
      columns = Math.max(1, Math.min(columns, 4));
    }
    
    return {
      containerWidth: columns * (ITEM_WIDTH + GAP) - GAP,
      containerHeight: Math.min(600, typeof window !== 'undefined' ? window.innerHeight - 200 : 600),
      columnCount: columns,
      rowCount: Math.ceil(posts.length / columns)
    };
  }, [isMobile, layout, posts.length]);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const postIndex = rowIndex * gridConfig.columnCount + columnIndex;
    const post = posts[postIndex];

    if (!post) return null;

    return (
      <div
        style={{
          ...style,
          left: style.left + GAP / 2,
          top: style.top + GAP / 2,
          width: style.width - GAP,
          height: style.height - GAP,
        }}
      >
        <div className="cursor-pointer" onClick={() => onPostClick(post)}>
          <PostCard post={post} />
        </div>
      </div>
    );
  }, [posts, gridConfig.columnCount, onPostClick]);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No posts available.</p>
      </div>
    );
  }

  // For small lists or mobile, use simple grid
  if (posts.length < 10 || isMobile) {
    return (
      <div className={`grid gap-4 ${layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {posts.map((post) => (
          <div key={post.id} className="cursor-pointer" onClick={() => onPostClick(post)}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Grid
        columnCount={gridConfig.columnCount}
        columnWidth={ITEM_WIDTH + GAP}
        height={gridConfig.containerHeight}
        rowCount={gridConfig.rowCount}
        rowHeight={ITEM_HEIGHT + GAP}
        width={gridConfig.containerWidth}
        className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {Cell}
      </Grid>
    </div>
  );
}
