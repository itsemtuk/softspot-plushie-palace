
import { useState } from "react";
import { formatTimeAgo } from "@/lib/utils";
import { PostActions } from "./PostActions";
import { PostMenu } from "./PostMenu";
import { PostCommentForm } from "./PostCommentForm";
import { PostCommentList } from "./PostCommentList";
import { ExtendedPost, Comment as MarketplaceComment } from "@/types/marketplace";
import { Comment } from "./PostCommentItem";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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
  onClose: () => void;
  onSaveEdit: (editedPost: ExtendedPost) => Promise<boolean>;
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
  onSaveEdit
}: PostContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDescription, setEditedDescription] = useState(post.description || "");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleStartEdit = () => {
    setEditedTitle(post.title);
    setEditedDescription(post.description || "");
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = async () => {
    setIsSaving(true);
    
    const editedPost = {
      ...post,
      title: editedTitle,
      description: editedDescription
    };
    
    const success = await onSaveEdit(editedPost);
    
    if (success) {
      setIsEditing(false);
    }
    
    setIsSaving(false);
  };
  
  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
          <span className="font-medium">@{post.username}</span>
        </div>
        
        <div className="flex items-center">
          {isAuthor && !isEditing && (
            <PostMenu 
              onEdit={handleStartEdit} 
              onDelete={() => {
                // Handle delete
                onClose();
              }} 
            />
          )}
          
          <button 
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input 
              id="title"
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea 
              id="description"
              value={editedDescription} 
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editedTitle.trim() || isSaving}
              className="bg-softspot-500 hover:bg-softspot-600"
            >
              {isSaving ? 'Saving...' : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold">{post.title}</h1>
          
          {post.description && (
            <p className="mt-2 text-gray-600">{post.description}</p>
          )}
          
          {post.location && (
            <p className="text-sm text-gray-500 mt-1">📍 {post.location}</p>
          )}
          
          <div className="text-xs text-gray-400 mt-1">
            {formatTimeAgo(post.timestamp)}
          </div>
        </>
      )}
      
      <PostActions 
        likes={likeCount} 
        comments={typeof post.comments === 'number' ? post.comments : post.comments.length} 
        isLiked={isLiked} 
        onLikeToggle={onLikeToggle} 
        onFindSimilar={onFindSimilar}
      />
      
      <div className="mt-auto">
        <PostCommentList comments={commentList} onCommentLikeToggle={onCommentLikeToggle} />
        <PostCommentForm onSubmit={onCommentSubmit} />
      </div>
    </div>
  );
}
