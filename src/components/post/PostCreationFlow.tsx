import { useState, useEffect } from 'react';
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
import { PostCreationData, ImageUploadResult, ExtendedPost } from '@/types/marketplace';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { updatePost, addPost } from '@/utils/posts/postManagement';

// Check if Clerk is configured
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Create a safe version of useUser
function useSafeUser() {
  if (!isClerkConfigured) {
    // Return a fallback when Clerk isn't configured
    return {
      user: null,
      isLoaded: true
    };
  }

  // Don't directly use useUser here - it would still throw in a non-Clerk context
  // Instead, just provide a fallback with localStorage data
  return {
    user: null,
    isLoaded: true
  };
}

interface PostCreationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: PostCreationData) => Promise<void>;
  postToEdit?: ExtendedPost | null;
}

type FlowStep = 'upload' | 'edit' | 'details';

const PostCreationFlow = ({ isOpen, onClose, onPostCreated, postToEdit }: PostCreationFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our safe version that works with or without Clerk
  const { user } = useSafeUser();

  // Get user data from localStorage as a fallback
  const userId = user?.id || localStorage.getItem('currentUserId') || 'anonymous';
  const username = user?.username || user?.firstName || localStorage.getItem('currentUsername') || "Anonymous";
  
  // Initialize form with post to edit if provided
  useEffect(() => {
    if (postToEdit && isOpen) {
      setUploadedImage(postToEdit.image);
      setEditedImage(postToEdit.image);
      setCurrentStep('details');
    } else if (isOpen && !postToEdit) {
      setCurrentStep('upload');
    }
  }, [postToEdit, isOpen]);
  
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
  
  const handleCreatePost = async (data: PostCreationData) => {
    // Combine form data with the edited image
    const finalPost = {
      ...data,
      image: editedImage || uploadedImage, // Use edited image if available, otherwise use the uploaded one
    };
    
    setIsSubmitting(true);
    
    try {
      if (postToEdit) {
        // Handle editing existing post
        const updatedPost: ExtendedPost = {
          ...postToEdit,
          title: data.title,
          description: data.description || postToEdit.description,
          image: editedImage || uploadedImage,
          tags: data.tags || postToEdit.tags,
          location: data.location || postToEdit.location
        };
        
        const result = await updatePost(updatedPost);
        if (!result.success) {
          throw new Error(result.error || "Failed to update post");
        }
        
        toast({
          title: "Post updated!",
          description: "Your post has been successfully updated."
        });
      } else {
        // Handle creating new post
        const newPost: ExtendedPost = {
          id: `post-${Date.now()}`,
          userId: userId,
          image: finalPost.image,
          title: finalPost.title,
          username: username,
          likes: 0,
          comments: 0,
          description: finalPost.description || "",
          tags: finalPost.tags || [],
          timestamp: new Date().toISOString(),
          location: finalPost.location,
          // Adding the required ExtendedPost properties
          price: 0,
          forSale: false,
          condition: "New",
          color: "",
          material: ""
        };
        
        const result = await addPost(newPost);
        if (!result.success) {
          throw new Error(result.error || "Failed to create post");
        }
        
        if (onPostCreated) {
          await onPostCreated(finalPost);
        }
        
        toast({
          title: "Post created!",
          description: "Your post has been successfully created and saved."
        });
      }
      
      // Reset state and close dialog
      resetState();
      onClose();
    } catch (error) {
      console.error('Error processing post:', error);
      toast({
        variant: "destructive",
        title: postToEdit ? "Post update failed" : "Post creation failed",
        description: "There was an error saving your post. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetState = () => {
    setCurrentStep('upload');
    setUploadedImage('');
    setEditedImage('');
    setIsSubmitting(false);
  };
  
  const handleGoBack = () => {
    if (currentStep === 'edit') {
      setCurrentStep('upload');
    } else if (currentStep === 'details') {
      if (postToEdit) {
        // When editing, going back from details should close the dialog
        onClose();
      } else {
        setCurrentStep('edit');
      }
    }
  };
  
  const handleClose = () => {
    // Don't allow closing during submission
    if (isSubmitting) return;
    
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
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {postToEdit ? "Cancel edit" : "Back to editor"}
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
              isSubmitting={isSubmitting}
              initialValues={postToEdit ? {
                title: postToEdit.title,
                description: postToEdit.description,
                location: postToEdit.location,
                tags: postToEdit.tags?.join(', ')
              } : undefined}
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
            {postToEdit ? 'Edit Post' : (
              currentStep === 'upload' ? 'Upload Image' :
              currentStep === 'edit' ? 'Edit Image' : 'Create Post'
            )}
          </DialogTitle>
          <DialogDescription>
            {postToEdit ? 'Update your post details' : (
              currentStep === 'upload' ? 'Upload an image to share with the community' :
              currentStep === 'edit' ? 'Crop or adjust your image before posting' :
              'Add details to your post'
            )}
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
