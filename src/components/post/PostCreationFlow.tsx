
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/post/ImageUploader";
import { ImageEditor } from "@/components/post/ImageEditor";
import { PostCreationForm } from "@/components/post/PostCreationForm";
import { PostCreationData, ImageUploadResult } from '@/types/marketplace';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

interface PostCreationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: PostCreationData) => void;
}

type FlowStep = 'upload' | 'edit' | 'details';

const PostCreationFlow = ({ isOpen, onClose, onPostCreated }: PostCreationFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  
  const handleImageSelect = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setUploadedImage(result.url);
      setCurrentStep('edit');
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: result.error || "There was an error uploading your image"
      });
    }
  };
  
  const handleImageEdit = (editedImageUrl: string) => {
    setEditedImage(editedImageUrl);
    setCurrentStep('details');
  };
  
  const handleCreatePost = (data: PostCreationData) => {
    // Combine form data with the edited image
    const finalPost = {
      ...data,
      image: editedImage || uploadedImage, // Use edited image if available, otherwise use the uploaded one
    };
    
    // Call the callback function
    if (onPostCreated) {
      onPostCreated(finalPost);
    }
    
    // Show success message
    toast({
      title: "Post created!",
      description: "Your post has been successfully created."
    });
    
    // Reset state and close dialog
    resetState();
    onClose();
  };
  
  const resetState = () => {
    setCurrentStep('upload');
    setUploadedImage('');
    setEditedImage('');
  };
  
  const handleGoBack = () => {
    if (currentStep === 'edit') {
      setCurrentStep('upload');
    } else if (currentStep === 'details') {
      setCurrentStep('edit');
    }
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const getDialogSize = () => {
    switch (currentStep) {
      case 'upload':
        return 'sm:max-w-md';
      case 'edit':
        return 'sm:max-w-lg max-h-[90vh] overflow-y-auto';
      case 'details':
        return 'sm:max-w-lg';
      default:
        return 'sm:max-w-md';
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return <ImageUploader onImageSelect={handleImageSelect} />;
      
      case 'edit':
        return (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-500"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to upload
            </Button>
            {uploadedImage && (
              <ImageEditor 
                imageUrl={uploadedImage} 
                onSave={handleImageEdit} 
                options={{ maxWidth: 1200, quality: 0.8 }}
              />
            )}
          </div>
        );
      
      case 'details':
        return (
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-500"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to editor
            </Button>
            <div className="aspect-square w-full max-w-[300px] mx-auto mb-4">
              <img 
                src={editedImage || uploadedImage} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <PostCreationForm 
              onSubmit={handleCreatePost} 
              imageUrl={editedImage || uploadedImage} 
            />
          </div>
        );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`${getDialogSize()} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'upload' && 'Upload Image'}
            {currentStep === 'edit' && 'Edit Image'}
            {currentStep === 'details' && 'Create Post'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'upload' && 'Upload an image to share with the community'}
            {currentStep === 'edit' && 'Crop or adjust your image before posting'}
            {currentStep === 'details' && 'Add details to your post'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCreationFlow;
