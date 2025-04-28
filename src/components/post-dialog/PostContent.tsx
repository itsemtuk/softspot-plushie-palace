
import { Separator } from "@/components/ui/separator";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tag } from "lucide-react";
import { PostActions } from "./PostActions";
import { PostCommentList } from "./PostCommentList";
import { PostCommentForm } from "./PostCommentForm";
import { Comment } from "./PostCommentItem";

interface PostContentProps {
  post: {
    id: string;
    title: string;
    username: string;
    description?: string;
    tags?: string[];
  };
  isLiked: boolean;
  likeCount: number;
  commentList: Comment[];
  onLikeToggle: () => void;
  onCommentLikeToggle: (commentId: string) => void;
  onCommentSubmit: (comment: string) => void;
  onFindSimilar: () => void;
}

export function PostContent({
  post,
  isLiked,
  likeCount,
  commentList,
  onLikeToggle,
  onCommentLikeToggle,
  onCommentSubmit,
  onFindSimilar
}: PostContentProps) {
  return (
    <div className="p-6 flex flex-col h-full max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">{post.title}</DialogTitle>
        <div className="text-sm text-gray-500 flex items-center justify-between mt-2">
          <span>@{post.username}</span>
        </div>
      </DialogHeader>
      
      {post.description && (
        <div className="my-4">
          <p className="text-gray-700">{post.description}</p>
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {post.tags.map(tag => (
            <div key={tag} className="bg-softspot-100 text-softspot-700 px-2 py-1 rounded-full text-xs flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </div>
          ))}
        </div>
      )}
      
      <PostActions 
        likes={likeCount}
        comments={commentList.length}
        isLiked={isLiked}
        onLikeToggle={onLikeToggle}
        onFindSimilar={onFindSimilar}
      />
      
      <Separator className="my-2" />
      
      <PostCommentList 
        comments={commentList}
        onCommentLikeToggle={onCommentLikeToggle}
      />
      
      <div className="border-t pt-4 mt-auto">
        <PostCommentForm onSubmit={onCommentSubmit} />
      </div>
    </div>
  );
}
