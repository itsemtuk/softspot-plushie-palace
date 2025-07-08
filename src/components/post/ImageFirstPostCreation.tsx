import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "./ImageUploader";
import { ImageEditor } from "./ImageEditor";
import { AdvancedImageEditor } from "./AdvancedImageEditor";
import { PostCreationData } from "@/types/core";
import { Camera, Edit3, Type, X, Plus, ArrowLeft, ArrowRight, Check, Crop, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ValidationSchemas } from "@/utils/security/inputValidation";

const postSchema = z.object({
  title: ValidationSchemas.postTitle,
  description: ValidationSchemas.postContent,
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

interface ImageFirstPostCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (data: PostCreationData) => Promise<void>;
}

const STEPS = [
  { id: 1, title: "Add Image", icon: Camera, description: "Upload your photo" },
  { id: 2, title: "Edit", icon: Edit3, description: "Apply filters & adjustments" },
  { id: 3, title: "Caption", icon: Type, description: "Add title and description" },
];

const FILTER_PRESETS = [
  { name: "Original", filter: "none" },
  { name: "Vintage", filter: "sepia(0.5) contrast(1.2)" },
  { name: "Cool", filter: "hue-rotate(180deg) saturate(1.2)" },
  { name: "Warm", filter: "hue-rotate(30deg) saturate(1.3)" },
  { name: "B&W", filter: "grayscale(1) contrast(1.1)" },
  { name: "Bright", filter: "brightness(1.2) contrast(1.1)" },
];

const POST_CATEGORIES = [
  "Collection Update", "New Arrival", "Question", "Review", "Haul", "Photography"
];

export const ImageFirstPostCreation = ({ 
  isOpen, 
  onClose, 
  onPostCreated
}: ImageFirstPostCreationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      category: undefined,
    },
  });

  const handleImageSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // Automatically go to next step when image is selected
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    } else {
      setImageUrl(null);
      setSelectedFilter("none");
      setCurrentStep(1);
    }
  };

  const addTag = useCallback(() => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      const newTags = [...currentTags, tagInput.trim()];
      setCurrentTags(newTags);
      form.setValue('tags', newTags);
      setTagInput("");
    }
  }, [tagInput, currentTags, form]);

  const removeTag = useCallback((tagToRemove: string) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setCurrentTags(newTags);
    form.setValue('tags', newTags);
  }, [currentTags, form]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Image required",
        description: "Please add an image to your post.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert file to data URL for upload
      const reader = new FileReader();
      const fileDataUrl = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
      });

      const postData: PostCreationData = {
        title: values.title,
        description: values.description,
        content: values.description,
        image: fileDataUrl, // Use the actual file data, not blob URL
        tags: currentTags,
      };

      await onPostCreated(postData);

      toast({
        title: "Post created!",
        description: "Your post has been added to the feed.",
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Post creation error:', error);
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setImageUrl(null);
    setSelectedFile(null);
    setSelectedFilter("none");
    setCurrentTags([]);
    setTagInput("");
    setCurrentStep(1);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg mx-auto h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogTitle className="text-lg font-semibold">Create Post</DialogTitle>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {STEPS.length} - {STEPS[currentStep - 1]?.description}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between mt-2">
              {STEPS.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-primary text-primary-foreground' 
                        : isActive 
                          ? 'bg-primary/20 text-primary border-2 border-primary' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Step 1: Image Upload */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <Camera className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Share Your Moment</h3>
                <p className="text-muted-foreground">Start by adding a photo to your post</p>
              </div>
              
              <ImageUploader 
                onImageSelect={handleImageSelect}
                currentImage={imageUrl || undefined}
                maxSizeInMB={10}
              />
              
              {imageUrl && (
                <div className="flex justify-end mt-4">
                  <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                    Continue to Edit
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Image Editing */}
          {currentStep === 2 && imageUrl && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <Edit3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-1">Perfect Your Photo</h3>
                <p className="text-sm text-muted-foreground">Apply filters and adjustments</p>
              </div>

              {/* Filters */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Filters</Label>
                <div className="grid grid-cols-3 gap-2">
                  {FILTER_PRESETS.map((preset) => (
                    <Card 
                      key={preset.name}
                      className={`cursor-pointer transition-all ${
                        selectedFilter === preset.filter 
                          ? 'ring-2 ring-primary' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedFilter(preset.filter)}
                    >
                      <CardContent className="p-2 text-center">
                        <div
                          className="w-full h-12 rounded bg-cover bg-center mb-1"
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            filter: preset.filter
                          }}
                        />
                        <span className="text-xs font-medium">{preset.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Preview</Label>
                 <div className="aspect-square w-full max-w-xs mx-auto">
                   <img
                     src={imageUrl}
                     alt="Preview"
                     className="w-full h-full object-cover rounded-lg"
                     style={{ filter: selectedFilter }}
                   />
                 </div>
                 
                 {/* Advanced Editing Options */}
                 <div className="grid grid-cols-2 gap-2 mt-4">
                   <Button
                     variant="outline"
                     onClick={() => {
                       setUseAdvancedEditor(false);
                       setIsEditing(true);
                     }}
                     className="w-full"
                   >
                     <Edit className="h-4 w-4 mr-2" />
                     Basic Edit
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => {
                       setUseAdvancedEditor(true);
                       setIsEditing(true);
                     }}
                     className="w-full"
                   >
                     <Crop className="h-4 w-4 mr-2" />
                     Advanced
                   </Button>
                 </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                  Add Caption
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Caption & Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <Type className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-1">Tell Your Story</h3>
                <p className="text-sm text-muted-foreground">Add a caption and details</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Give your post a title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caption</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a caption..."
                            className="resize-none min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {POST_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags Section */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button type="button" size="sm" onClick={addTag}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {currentTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {currentTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                      {isSubmitting ? "Posting..." : "Share Post"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
        
        {/* Image Editors */}
        {isEditing && imageUrl && (
          <>
            {useAdvancedEditor ? (
              <AdvancedImageEditor
                image={imageUrl}
                onSave={(editedImage) => {
                  setImageUrl(editedImage);
                  setIsEditing(false);
                  setUseAdvancedEditor(false);
                }}
                onCancel={() => {
                  setIsEditing(false);
                  setUseAdvancedEditor(false);
                }}
              />
            ) : (
              <ImageEditor
                imageUrl={imageUrl}
                onSave={(options) => {
                  // Convert ImageEditorOptions to image URL
                  // For now, just use the original URL
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};