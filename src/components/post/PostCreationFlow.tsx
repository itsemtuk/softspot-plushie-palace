
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostCreationForm } from "./PostCreationForm";
import { ImageEditor } from "./ImageEditor";
import { ImageUploader } from "./ImageUploader";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";

interface PostCreationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (data: PostCreationData) => Promise<void>;
  initialText?: string;
  postToEdit?: any; // Adding optional postToEdit prop to match usage in CreateButton
}

const initialData: PostCreationData = {
  title: "",
  description: "",
  image: "",
  tags: [],
  location: "",
};

const PostCreationFlow = ({ isOpen, onClose, onPostCreated, initialText = "", postToEdit }: PostCreationFlowProps) => {
  const [step, setStep] = useState<'info' | 'upload' | 'editor'>('upload');
  const [postData, setPostData] = useState<PostCreationData>({
    ...initialData,
    description: initialText
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('upload');
      setPostData({
        ...initialData,
        description: initialText
      });
    }
  }, [isOpen, initialText]);

  const handleImageUploaded = (imageUrl: string) => {
    setPostData(prev => ({ ...prev, image: imageUrl }));
    setStep('editor');
  };

  const handleImageEdited = (editedImageUrl: string) => {
    setPostData(prev => ({ ...prev, image: editedImageUrl }));
    setStep('info');
  };

  const handleSkipEdit = () => {
    setStep('info');
  };

  const handleSkipUpload = () => {
    setStep('info');
  };

  const handleFormSubmit = async (data: PostCreationData) => {
    // Make sure user is logged in
    const userId = getCurrentUserId();
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create posts."
      });
      onClose();
      return;
    }

    // Combine previous data with form data
    const finalData = {
      ...postData,
      ...data,
    };

    try {
      setIsSubmitting(true);
      await onPostCreated(finalData);
      toast({
        title: "Success",
        description: "Your post has been created."
      });
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (step === 'info') {
      if (postData.image) {
        setStep('editor');
      } else {
        setStep('upload');
      }
    } else if (step === 'editor') {
      setStep('upload');
    } else {
      onClose();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <ImageUploader onImageUploaded={handleImageUploaded} />
            <Button 
              variant="ghost" 
              onClick={handleSkipUpload}
              className="mt-4"
            >
              Skip and continue without image
            </Button>
          </div>
        );
      case 'editor':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <ImageEditor 
              imageUrl={postData.image} 
              onSave={handleImageEdited} 
              onCancel={handleCancel}
            />
            <Button 
              variant="ghost" 
              onClick={handleSkipEdit}
              className="mt-4"
            >
              Skip editing
            </Button>
          </div>
        );
      case 'info':
        return (
          <PostCreationForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleCancel} 
            imageUrl={postData.image}
            initialData={{
              ...postData,
              description: postData.description || initialText
            }}
            isSubmitting={isSubmitting} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PostCreationFlow;
