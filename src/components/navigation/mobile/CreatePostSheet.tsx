
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addPost } from "@/utils/posts/postManagement";
import { ExtendedPost } from "@/types/marketplace";
import ImageUploader from "@/components/post/ImageUploader";
import { ImageUploadResult } from "@/types/marketplace";
import { Check, X } from "lucide-react";

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostSheet({ open, onOpenChange }: CreatePostSheetProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (result: ImageUploadResult) => {
    if (result.success) {
      setImage(result.url);
    } else {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive"
      });
    }
  };

  const handlePost = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title to your post.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('currentUserId') || 'anonymous';
      const username = localStorage.getItem('currentUsername') || 'Anonymous';
      
      const newPost: ExtendedPost = {
        id: `post-${Date.now()}`,
        userId,
        username,
        title,
        description,
        image,
        likes: 0,
        comments: 0,
        tags: [],
        timestamp: new Date().toISOString(),
        forSale: false,
        condition: "New",
        color: "",
        material: "",
        location: "",
        deliveryCost: 0
      };

      const result = await addPost(newPost);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your post was created successfully.",
        });
        onOpenChange(false);
        navigate("/feed");
      } else {
        throw new Error(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h2 className="font-semibold text-lg">Create Post</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handlePost}
              disabled={isSubmitting || !title.trim()}
              className="text-softspot-500"
            >
              <Check className="h-6 w-6" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                placeholder="Add a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Write something about your plushie..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Add Image</Label>
              {image ? (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-48 object-contain bg-gray-100 rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImage("")}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <ImageUploader onImageSelect={handleImageSelect} />
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
