
import { useState } from "react";
import { X, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PostActions } from "./PostActions";
import { PostCommentList } from "./PostCommentList";
import { PostCommentForm } from "./PostCommentForm";
import { ExtendedPost } from "@/types/marketplace";
import { Comment } from "./PostCommentItem";
import { PostMenu } from "./PostMenu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface PostContentProps {
  post: ExtendedPost;
  isAuthor: boolean;
  isLiked: boolean;
  likeCount: number;
  commentList: Comment[];
  onLikeToggle: () => void;
  onCommentLikeToggle: (commentId: string) => void;
  onCommentSubmit: (comment: string) => void;
  onFindSimilar: () => void;
  onClose: (() => void) | null;
  onSaveEdit: (editedPost: ExtendedPost) => Promise<boolean>;
  onDeletePost: () => void;
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
  onDeletePost
}: PostContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title || "");
  const [editedDescription, setEditedDescription] = useState(post.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStartEdit = () => {
    setEditedTitle(post.title || "");
    setEditedDescription(post.description || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const editedPost = {
        ...post,
        title: editedTitle,
        description: editedDescription,
        updatedAt: new Date().toISOString()
      };
      
      const success = await onSaveEdit(editedPost);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving edited post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full max-h-[600px] overflow-y-auto">
      {/* Post header with author info and actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.username}`} alt={post.username} />
            <AvatarFallback>{post.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">@{post.username}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthor && !isEditing && (
            <PostMenu onEdit={handleStartEdit} onDelete={() => setShowDeleteConfirm(true)} />
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Post content */}
      {isEditing ? (
        <div className="space-y-4 mb-4">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Post title"
            className="w-full"
          />
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add a description..."
            className="w-full min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-medium mb-2">{post.title}</h2>
          {post.description && <p className="text-gray-700 mb-4">{post.description}</p>}
        </>
      )}

      {/* Post interactions - likes and comments */}
      <PostActions 
        likes={likeCount}
        comments={commentList.length}
        isLiked={isLiked}
        onLikeToggle={onLikeToggle}
        onFindSimilar={onFindSimilar}
      />

      {/* Comments section */}
      <div className="flex-grow overflow-y-auto mb-4">
        <PostCommentList comments={commentList} onLikeToggle={onCommentLikeToggle} />
      </div>

      {/* Comment form */}
      <div className="mt-auto pt-3 border-t">
        <PostCommentForm onSubmit={onCommentSubmit} />
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowDeleteConfirm(false);
                onDeletePost();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
