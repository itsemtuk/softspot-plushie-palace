
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PostCommentForm } from "./PostCommentForm";
import { ExtendedPost, Comment } from "@/types/core";
import { PostComment } from "@/utils/comments/commentService";
import { useUser } from "@clerk/clerk-react";
import { usePostActions } from "@/hooks/usePostActions";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";
import { EditMarketplaceItem } from "@/components/marketplace/EditMarketplaceItem";
import { PostMenu } from "./PostMenu";

interface PostContentProps {
  post: ExtendedPost;
  comments: PostComment[];
  isLoadingComments: boolean;
  onClose: () => void;
  onPostEdited: (editedPost: ExtendedPost) => void;
  onPostDeleted: (postId: string) => void;
  onCommentSubmit: (comment: Omit<Comment, 'id' | 'likes' | 'timestamp' | 'isLiked'>) => Promise<void>;
  onCommentLike: (commentId: string) => Promise<void>;
  onCommentUnlike: (commentId: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const PostContent = ({ 
  post, 
  comments, 
  isLoadingComments, 
  onClose, 
  onPostEdited, 
  onPostDeleted,
  onCommentSubmit,
  onCommentLike,
  onCommentUnlike,
  onEditComment,
  onDeleteComment 
}: PostContentProps) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMarketplace, setIsEditingMarketplace] = useState(false);
  const { user } = useUser();
  const { handleEditPost, handleDeletePost } = usePostActions();
  const { addOfflinePost } = useOfflinePostOperations();

  const handleCommentSubmit = async (commentText: string) => {
    if (commentText.trim() === "") return;

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      await onCommentSubmit({
        postId: post.id,
        userId: user.id,
        username: user.username || "Anonymous",
        content: commentText
      });
      setComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const editPost = () => {
    if (post.forSale) {
      setIsEditingMarketplace(true);
    } else {
      setIsEditing(true);
    }
  };

  const deletePost = async () => {
    await handleDeletePost(post.id);
    onPostDeleted(post.id);
    onClose();
  };

  const handleMarketplaceUpdate = (updatedPost: ExtendedPost) => {
    onPostEdited(updatedPost);
    setIsEditingMarketplace(false);
  };

  return (
    <div className="space-y-4">
      {/* Post Image */}
      {post.image && (
        <div className="w-full">
          <img 
            src={post.image} 
            alt={post.title || post.content} 
            className="w-full h-auto max-h-96 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          {post.forSale && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <DollarSign className="h-3 w-3 mr-1" />
              For Sale
            </Badge>
          )}
        </div>
        <p>{post.content}</p>
        {post.description && post.description !== post.content && (
          <p className="text-gray-600 dark:text-gray-400">{post.description}</p>
        )}
        
        {/* Marketplace details */}
        {post.forSale && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            {post.price && (
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                ${post.price}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {post.brand && <div><span className="font-medium">Brand:</span> {post.brand}</div>}
              {post.condition && <div><span className="font-medium">Condition:</span> {post.condition}</div>}
              {post.size && <div><span className="font-medium">Size:</span> {post.size}</div>}
              {post.color && <div><span className="font-medium">Color:</span> {post.color}</div>}
              {post.species && <div><span className="font-medium">Type:</span> {post.species}</div>}
              {post.material && <div><span className="font-medium">Material:</span> {post.material}</div>}
            </div>
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleLike}>
            <Heart className={`h-5 w-5 ${isLiked ? "text-red-500" : ""}`} />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={sharePost}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Edit and Delete Menu */}
        {user?.id === post.userId && (
          <PostMenu onEdit={editPost} onDelete={deletePost} />
        )}
      </div>

      {/* Comment Form */}
      <PostCommentForm onSubmit={handleCommentSubmit} />

      {/* Comments List */}
      <div>
        {isLoadingComments ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="py-3 border-b border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.users?.avatar_url ? (
                    <img 
                      src={comment.users.avatar_url} 
                      alt={comment.users.username || 'User'} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                      {(comment.users?.username || comment.users?.first_name || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                      {comment.users?.username || `${comment.users?.first_name || ''} ${comment.users?.last_name || ''}`.trim() || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">No comments yet</div>
        )}
      </div>

      {/* Edit Marketplace Item Dialog */}
      {isEditingMarketplace && (
        <EditMarketplaceItem
          post={post}
          isOpen={isEditingMarketplace}
          onClose={() => setIsEditingMarketplace(false)}
          onUpdate={handleMarketplaceUpdate}
        />
      )}
    </div>
  );
};
