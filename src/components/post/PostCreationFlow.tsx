
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { PostCreationForm } from "./PostCreationForm";
import { PostCreationData } from "@/types/core";
import { ImageUploadResult } from "@/types/ui";

interface PostCreationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (data: PostCreationData) => Promise<void>;
}

const PostCreationFlow: React.FC<PostCreationFlowProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setImageUrl(result.url);
    }
  };

  const handlePostCreation = async (data: PostCreationData) => {
    try {
      // Include the image URL in the post data
      const postData = { ...data, image: imageUrl || "" };
      await onPostCreated(postData);
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>

        <ImageUploader onImageUpload={handleImageUpload} />

        <PostCreationForm 
          onPostCreated={handlePostCreation}
          onClose={onClose}
        />

        <div className="grid gap-4 py-4">
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCreationFlow;
