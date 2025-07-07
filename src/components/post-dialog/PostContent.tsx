
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PostCommentForm } from "./PostCommentForm";
import { ExtendedPost, Comment } from "@/types/core";
import { useUser } from "@clerk/clerk-react";
import { usePostActions } from "@/hooks/usePostActions";
import { useOfflinePostOperations } from "@/hooks/useOfflinePostOperations";
import { EditMarketplaceItem } from "@/components/marketplace/EditMarketplaceItem";
import { PostMenu } from "./PostMenu";

interface PostContentProps {
  post: ExtendedPost;
  onClose: () => void;
  onPostEdited: (editedPost: ExtendedPost) => void;
  onPostDeleted: (postId: string) => void;
}

export const PostContent = ({ post, onClose, onPostEdited, onPostDeleted }: PostContentProps) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMarketplace, setIsEditingMarketplace] = useState(false);
  const { user } = useUser();
  const { handleEditPost, handleDeletePost } = usePostActions();
  const { addOfflinePost } = useOfflinePostOperations();

  useEffect(() => {
    // Mock comments for demonstration
    const mockComments: Comment[] = [
      {
        id: "comment-1",
        postId: post.id,
        userId: "user-1",
        username: "JohnDoe",
        content: "Great post!",
        likes: 5,
        timestamp: new Date().toISOString(),
      },
      {
        id: "comment-2",
        postId: post.id,
        userId: "user-2",
        username: "JaneSmith",
        content: "I agree!",
        likes: 2,
        timestamp: new Date().toISOString(),
      },
    ];
    setComments(mockComments);
  }, [post.id]);

  const handleCommentSubmit = (commentText: string) => {
    if (commentText.trim() === "") return;

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      userId: user.id,
      username: user.username || "Anonymous",
      content: commentText,
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    setComments((prevComments) => [...prevComments, newComment]);
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
        {comments.map((comment) => (
          <div key={comment.id} className="py-2 border-b">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{comment.username}</div>
              <div className="text-sm text-gray-500">{comment.timestamp}</div>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
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
