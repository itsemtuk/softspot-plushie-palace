
import { FixedSizeGrid as Grid } from 'react-window';
import { ExtendedPost } from "@/types/core";
import { PostCard } from "@/components/post/PostCard";
import { useMemo } from "react";
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
  
  const { containerWidth, containerHeight, columnCount } = useMemo(() => {
    const screenWidth = window.innerWidth;
    const maxWidth = Math.min(screenWidth - 32, 1200);
    
    let columns = 1;
    if (!isMobile) {
      columns = Math.floor((maxWidth + GAP) / (ITEM_WIDTH + GAP));
      columns = Math.max(1, Math.min(columns, 4));
    }
    
    return {
      containerWidth: columns * (ITEM_WIDTH + GAP) - GAP,
      containerHeight: Math.min(800, window.innerHeight - 200),
      columnCount: columns
    };
  }, [isMobile]);

  const rowCount = Math.ceil(posts.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const postIndex = rowIndex * columnCount + columnIndex;
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
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No posts available.</p>
      </div>
    );
  }

  // For small lists or mobile, don't use virtualization
  if (posts.length < 20 || isMobile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        columnCount={columnCount}
        columnWidth={ITEM_WIDTH + GAP}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={ITEM_HEIGHT + GAP}
        width={containerWidth}
        className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {Cell}
      </Grid>
    </div>
  );
}
