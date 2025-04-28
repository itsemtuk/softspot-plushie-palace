
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface PostCommentItemProps {
  comment: Comment;
  onLikeToggle: (commentId: string) => void;
}

export function PostCommentItem({ comment, onLikeToggle }: PostCommentItemProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="flex justify-between">
        <span className="font-medium text-sm">@{comment.username}</span>
        <span className="text-xs text-gray-500">{comment.timestamp}</span>
      </div>
      <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
      <div className="flex items-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 p-0 h-auto text-xs ${comment.isLiked ? "text-rose-500" : "text-gray-500"}`}
          onClick={() => onLikeToggle(comment.id)}
        >
          <Heart className={`h-3 w-3 ${comment.isLiked ? "fill-rose-500" : ""}`} />
          <span>{comment.likes}</span>
        </Button>
      </div>
    </div>
  );
}
