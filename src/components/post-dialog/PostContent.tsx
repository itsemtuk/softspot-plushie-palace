
import { Separator } from "@/components/ui/separator";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tag } from "lucide-react";
import { PostActions } from "./PostActions";
import { PostCommentList } from "./PostCommentList";
import { PostCommentForm } from "./PostCommentForm";
import { Comment } from "./PostCommentItem";
import { PostMenu } from "./PostMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PostContentProps {
  post: {
    id: string;
    title: string;
    username: string;
    description?: string;
    tags?: string[];
  };
  isAuthor: boolean;
  isLiked: boolean;
  likeCount: number;
  commentList: Comment[];
  onLikeToggle: () => void;
  onCommentLikeToggle: (commentId: string) => void;
  onCommentSubmit: (comment: string) => void;
  onFindSimilar: () => void;
  onClose: () => void;
  onSaveEdit: (title: string, description: string) => void;
}

export function PostContent({
  post,
  isAuthor,
  isLiked,
  likeCount,
  commentList,
  onLikeToggle,
  onCommentLikeToggle,
  onCommentSubmit,
  onFindSimilar,
  onClose,
  onSaveEdit,
}: PostContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDescription, setEditDescription] = useState(post.description || "");

  const handleSave = () => {
    onSaveEdit(editTitle, editDescription);
    setIsEditing(false);
  };

  return (
    <div className="p-6 flex flex-col h-full max-h-[80vh] overflow-y-auto">
      <DialogHeader className="flex flex-row items-start justify-between">
        {isEditing ? (
          <div className="flex-1 space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-xl font-semibold"
              placeholder="Post title"
            />
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description..."
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <DialogTitle className="text-xl">{post.title}</DialogTitle>
              <div className="text-sm text-gray-500 flex items-center mt-2">
                <span>@{post.username}</span>
              </div>
            </div>
            <PostMenu
              postId={post.id}
              isAuthor={isAuthor}
              onEdit={() => setIsEditing(true)}
              onClose={onClose}
            />
          </>
        )}
      </DialogHeader>

      {!isEditing && (
        <>
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
        </>
      )}
    </div>
  );
}
