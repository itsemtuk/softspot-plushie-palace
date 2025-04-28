
import { PostCommentItem, Comment as PostCommentItemComment } from "./PostCommentItem";
import { Comment as MarketplaceComment } from "@/types/marketplace";

interface PostCommentListProps {
  comments: (PostCommentItemComment | MarketplaceComment)[];
  onCommentLikeToggle: (commentId: string) => void;
  currentUserId?: string;
}

export function PostCommentList({ comments, onCommentLikeToggle, currentUserId }: PostCommentListProps) {
  if (comments.length === 0) return null;
  
  return (
    <div className="mt-4 mb-4 space-y-3">
      <h3 className="font-medium text-sm">Comments</h3>
      {comments.map(comment => (
        <PostCommentItem 
          key={comment.id} 
          comment={comment} 
          onLikeToggle={onCommentLikeToggle}
        />
      ))}
    </div>
  );
}
