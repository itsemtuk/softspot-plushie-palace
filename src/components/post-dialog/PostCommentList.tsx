
import { PostCommentItem, Comment } from "./PostCommentItem";
import { Comment as MarketplaceComment } from "@/types/marketplace";

interface PostCommentListProps {
  comments: (Comment | MarketplaceComment)[];
  onCommentLikeToggle: (commentId: string) => void;
}

export function PostCommentList({ comments, onCommentLikeToggle }: PostCommentListProps) {
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
