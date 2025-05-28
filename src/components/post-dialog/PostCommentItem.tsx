
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Comment } from "@/types/marketplace";

interface PostCommentItemProps {
  comment: Comment;
  onLikeToggle: (commentId: string) => void;
}

export function PostCommentItem({ comment, onLikeToggle }: PostCommentItemProps) {
  // Use content instead of text for consistency with marketplace Comment interface
  const content = comment.content || "";
  const timestamp = comment.timestamp || new Date().toISOString();
  const likes = typeof comment.likes === 'number' ? comment.likes : 0;
  const isLiked = Boolean(comment.isLiked);

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="flex justify-between">
        <span className="font-medium text-sm">@{comment.username}</span>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
      <p className="mt-1 text-sm text-gray-700">{content}</p>
      <div className="flex items-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 p-0 h-auto text-xs ${isLiked ? "text-rose-500" : "text-gray-500"}`}
          onClick={() => onLikeToggle(comment.id)}
        >
          <Heart className={`h-3 w-3 ${isLiked ? "fill-rose-500" : ""}`} />
          <span>{likes}</span>
        </Button>
      </div>
    </div>
  );
}
