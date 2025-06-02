
import { Comment } from "@/types/core";
import { PostCommentItem } from "./PostCommentItem";

interface PostCommentListProps {
  comments: Comment[];
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
          isLiked={comment.isLiked || false}
          onLike={onCommentLikeToggle}
          onEdit={(commentId) => console.log('Edit comment:', commentId)}
          onDelete={(commentId) => console.log('Delete comment:', commentId)}
          isOwnComment={comment.userId === currentUserId}
        />
      ))}
    </div>
  );
}
