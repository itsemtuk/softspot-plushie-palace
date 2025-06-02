
import { useState } from "react";
import { Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/core";

interface PostCommentItemProps {
  comment: Comment;
  isLiked: boolean;
  onLike: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  isOwnComment: boolean;
}

export const PostCommentItem = ({
  comment,
  isLiked,
  onLike,
  onEdit,
  onDelete,
  isOwnComment
}: PostCommentItemProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleLikeClick = () => {
    onLike(comment.id);
  };

  const handleEditClick = () => {
    onEdit(comment.id);
  };

  const handleDeleteClick = () => {
    onDelete(comment.id);
  };

  return (
    <div className="flex items-start space-x-3 py-2 relative">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <span className="text-sm font-semibold">{comment.username?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="space-y-1">
          <div className="text-sm font-medium leading-none">{comment.username}</div>
          <p className="text-sm text-gray-500">{comment.content}</p>
        </div>
        <div className="mt-2 flex items-center space-x-4 text-xs">
          <Button variant="ghost" size="sm" onClick={handleLikeClick}>
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'text-red-500' : ''}`} />
            <span>{comment.likes} Likes</span>
          </Button>
        </div>
      </div>
      {isOwnComment && (
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md z-10">
              <Button
                variant="ghost"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
