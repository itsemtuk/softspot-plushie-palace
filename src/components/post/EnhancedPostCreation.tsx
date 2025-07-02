import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./ImageUploader";
import { PostCreationData } from "@/types/core";
import { Camera, Palette, Tag, Users, Store, X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ValidationSchemas } from "@/utils/security/inputValidation";

const enhancedPostSchema = z.object({
  title: ValidationSchemas.postTitle,
  description: ValidationSchemas.postContent,
  tags: z.array(z.string()).optional(),
  shareToMarketplace: z.boolean().default(false),
  category: z.string().optional(),
});

interface EnhancedPostCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (data: PostCreationData) => Promise<void>;
  onShareToMarketplace?: (data: PostCreationData) => Promise<void>;
}

const FILTER_PRESETS = [
  { name: "Original", filter: "none" },
  { name: "Vintage", filter: "sepia(0.5) contrast(1.2)" },
  { name: "Cool", filter: "hue-rotate(180deg) saturate(1.2)" },
  { name: "Warm", filter: "hue-rotate(30deg) saturate(1.3)" },
  { name: "B&W", filter: "grayscale(1) contrast(1.1)" },
  { name: "Bright", filter: "brightness(1.2) contrast(1.1)" },
];

const POST_CATEGORIES = [
  "Collection Update", "New Arrival", "For Sale", "Trade", 
  "Question", "Review", "Haul", "Photography"
];

export const EnhancedPostCreation = ({ 
  isOpen, 
  onClose, 
  onPostCreated, 
  onShareToMarketplace 
}: EnhancedPostCreationProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  const form = useForm<z.infer<typeof enhancedPostSchema>>({
    resolver: zodResolver(enhancedPostSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      shareToMarketplace: false,
      category: undefined,
    },
  });

  const handleImageSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl(null);
      setSelectedFilter("none");
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

  const onSubmit = async (values: z.infer<typeof enhancedPostSchema>) => {
    setIsSubmitting(true);
    try {
      const postData: PostCreationData = {
        title: values.title,
        description: values.description,
        content: values.description,
        image: imageUrl || "",
        tags: currentTags,
      };

      // Add filter to image URL if selected
      if (selectedFilter !== "none" && imageUrl) {
        postData.image = imageUrl;
        // Note: In a real app, you'd apply the filter server-side
      }

      await onPostCreated(postData);

      // If sharing to marketplace and handler is provided
      if (values.shareToMarketplace && onShareToMarketplace) {
        await onShareToMarketplace(postData);
      }

      toast({
        title: "Post created!",
        description: values.shareToMarketplace 
          ? "Your post has been shared to feed and marketplace."
          : "Your post has been added to the feed.",
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
    setActiveTab("content");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold">Create Post</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-4 my-2">
              <TabsTrigger value="content" className="flex items-center gap-1 text-xs">
                <Tag className="h-3 w-3" />
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-1 text-xs">
                <Camera className="h-3 w-3" />
                Media
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-1 text-xs">
                <Palette className="h-3 w-3" />
                Style
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <TabsContent value="content" className="space-y-4 mt-0">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="What's happening?" {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share more details..."
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
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-0">
                  <ImageUploader 
                    onImageSelect={handleImageSelect}
                    currentImage={imageUrl || undefined}
                    maxSizeInMB={10}
                  />
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-0">
                  {imageUrl && (
                    <>
                      <div className="space-y-2">
                        <Label>Filters</Label>
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
                                  className="w-full h-16 rounded bg-cover bg-center mb-1"
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

                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="aspect-square w-full max-w-xs mx-auto">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                            style={{ filter: selectedFilter }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Sharing Options */}
                <div className="border-t pt-4 space-y-3">
                  <FormField
                    control={form.control}
                    name="shareToMarketplace"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            Share to Marketplace
                          </FormLabel>
                          <div className="text-xs text-muted-foreground">
                            Make this post available in the marketplace
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};