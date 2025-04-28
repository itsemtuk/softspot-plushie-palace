
import { useState } from "react";
import { PostActions } from "./PostActions";
import { PostCommentForm } from "./PostCommentForm";
import { PostCommentList } from "./PostCommentList";
import { PostMenu } from "./PostMenu";
import { Button } from "@/components/ui/button";
import { ExtendedPost, Comment } from "@/types/marketplace";
import { X } from "lucide-react";
import { Map, MapPin } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EditPostForm } from "./EditPostForm";

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
  
  const handleSaveEdit = async (editedPost: ExtendedPost) => {
    try {
      const success = await onSaveEdit(editedPost);
      if (success) {
        setIsEditing(false);
      }
      return success;
    } catch (error) {
      console.error("Error saving edit:", error);
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-auto">
      {/* Header with username and close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="font-medium">@{post.username}</div>
        <div className="flex items-center gap-2">
          {/* Show edit/delete menu only if user is author */}
          {isAuthor && (
            <PostMenu 
              onEdit={() => setIsEditing(true)} 
              onDelete={onDeletePost}
            />
          )}
          
          {/* Only show close button if provided and not already shown in parent */}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow p-4 overflow-y-auto">
        {isEditing ? (
          <EditPostForm post={post} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
        ) : (
          <>
            {/* Post title */}
            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
            
            {/* Post description */}
            {post.description && (
              <p className="text-gray-700 mb-4">{post.description}</p>
            )}

            {/* Post location if available */}
            {post.location && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{post.location}</span>
              </div>
            )}
            
            {/* Post tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Post actions (like, comment, find similar) */}
            <PostActions 
              likes={likeCount} 
              comments={commentList.length} 
              isLiked={isLiked} 
              onLikeToggle={onLikeToggle}
              onFindSimilar={onFindSimilar}
            />
            
            <hr className="my-4" />
            
            {/* Comments section */}
            <div className="space-y-4">
              <h4 className="font-medium">Comments</h4>
              
              <PostCommentList 
                comments={commentList} 
                onCommentLikeToggle={onCommentLikeToggle} 
                currentUserId={post.userId}
              />
              
              <PostCommentForm onSubmit={onCommentSubmit} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
