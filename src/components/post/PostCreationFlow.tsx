
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostCreationForm } from "./PostCreationForm";
import { ImageEditor } from "./ImageEditor";
import { ImageUploader } from "./ImageUploader";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";
import { useNavigate } from "react-router-dom";

interface PostCreationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (data: PostCreationData) => Promise<void>;
  initialText?: string;
  postToEdit?: any;
  isSubmitting?: boolean;
}

const initialData: PostCreationData = {
  title: "",
  description: "",
  image: "",
  tags: [],
  location: "",
};

const PostCreationFlow = ({ 
  isOpen, 
  onClose, 
  onPostCreated, 
  initialText = "", 
  postToEdit,
  isSubmitting = false 
}: PostCreationFlowProps) => {
  const [step, setStep] = useState<'info' | 'upload' | 'editor'>('upload');
  const [postData, setPostData] = useState<PostCreationData>({
    ...initialData,
    description: initialText
  });
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const navigate = useNavigate();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('upload');
      setPostData({
        ...initialData,
        description: initialText
      });
      setLocalSubmitting(false);
    }
  }, [isOpen, initialText]);

  const handleImageUploaded = (imageUrl: string) => {
    console.log("Image uploaded:", imageUrl);
    setPostData(prev => ({ ...prev, image: imageUrl }));
    setStep('editor');
  };

  const handleImageEdited = (editedImageUrl: string) => {
    console.log("Image edited:", editedImageUrl);
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
      userId,
      username: userId, // This should be replaced with actual username from auth
    };

    try {
      setLocalSubmitting(true);
      console.log("Submitting post data:", finalData);
      await onPostCreated(finalData);
      
      // Reset the form data after successful submission
      setPostData(initialData);
      setStep('upload');
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again."
      });
    } finally {
      setLocalSubmitting(false);
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
          <div className="flex flex-col items-center justify-center h-full bg-white p-4 max-h-[80vh] overflow-y-auto">
            <ImageUploader 
              onImageSelected={(result) => {
                if (result.success) {
                  handleImageUploaded(result.url);
                }
              }}
            />
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
          <div className="flex flex-col items-center justify-center h-full bg-white p-4 max-h-[80vh] overflow-y-auto">
            <div className="w-full max-w-lg">
              <ImageEditor 
                imageUrl={postData.image} 
                onSave={handleImageEdited} 
                onCancel={handleCancel}
              />
            </div>
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
          <div className="bg-white p-4 rounded-md max-h-[80vh] overflow-y-auto">
            <PostCreationForm 
              onSubmit={handleFormSubmit} 
              onCancel={handleCancel} 
              imageUrl={postData.image}
              initialData={{
                ...postData,
                description: postData.description || initialText
              }}
              isSubmitting={isSubmitting || localSubmitting} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PostCreationFlow;
