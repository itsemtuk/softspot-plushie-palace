
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PostCommentFormProps {
  onSubmit: (comment: string) => void;
}

export function PostCommentForm({ onSubmit }: PostCommentFormProps) {
  const [newComment, setNewComment] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onSubmit(newComment);
    setNewComment("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea 
        placeholder="Add a comment..." 
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="resize-none"
      />
      <Button 
        type="submit" 
        className="bg-softspot-400 hover:bg-softspot-500 self-end"
        disabled={!newComment.trim()}
      >
        Post
      </Button>
    </form>
  );
}
