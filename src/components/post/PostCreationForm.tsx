
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostCreationData } from "@/types/marketplace";
import { MapPin } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  description: z.string().max(1000, { message: "Description cannot exceed 1000 characters" }).optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
});

export interface PostCreationFormProps {
  onSubmit: (data: PostCreationData) => void;
  onCancel: () => void;
  imageUrl?: string;
  initialData?: Partial<PostCreationData>;
  isSubmitting?: boolean;
}

export const PostCreationForm = ({ 
  onSubmit, 
  onCancel,
  imageUrl, 
  initialData = {}, 
  isSubmitting = false 
}: PostCreationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      tags: initialData.tags || [],
      location: initialData.location || "",
    },
  });
  
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData: PostCreationData = {
      title: data.title,
      description: data.description || "",
      content: data.description || "", // Add content property
      tags: data.tags || [],
      location: data.location || "",
      image: imageUrl || "",
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {imageUrl && (
          <div className="aspect-square w-full relative rounded-md overflow-hidden bg-gray-100 mb-4">
            <img 
              src={imageUrl} 
              alt="Upload preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Add a title" {...field} />
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
                  placeholder="Add a description" 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Add a location" 
                    className="pl-10" 
                    {...field} 
                    value={field.value || ""}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Add the location where this photo was taken
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="flex-1"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
