
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// List of inappropriate words to filter
const inappropriateWords = [
  "badword1", "badword2", "profanity", "explicit"
  // In a real app, this would be a more comprehensive list
];

// Function to check for inappropriate content
const containsInappropriateContent = (text: string): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return inappropriateWords.some(word => lowerText.includes(word));
};

const postSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .refine(text => !containsInappropriateContent(text), {
      message: "Title contains inappropriate content",
    }),
  description: z.string()
    .optional()
    .refine(text => !text || !containsInappropriateContent(text), {
      message: "Description contains inappropriate content",
    }),
  location: z.string()
    .optional()
    .refine(text => !text || !containsInappropriateContent(text), {
      message: "Location contains inappropriate content",
    }),
  tags: z.string()
    .optional()
    .refine(text => !text || !containsInappropriateContent(text), {
      message: "Tags contain inappropriate content",
    }),
});

interface PostCreationFormProps {
  onSubmit: (data: PostCreationData) => void;
  imageUrl: string;
  isSubmitting?: boolean;
}

export const PostCreationForm = ({ onSubmit, imageUrl, isSubmitting = false }: PostCreationFormProps) => {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      tags: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof postSchema>) => {
    // Check for inappropriate content one more time as a safety measure
    if (containsInappropriateContent(values.title) || 
        containsInappropriateContent(values.description || '') || 
        containsInappropriateContent(values.tags || '')) {
      toast({
        title: "Content not allowed",
        description: "Your post contains inappropriate content that goes against our community guidelines.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      image: imageUrl,
      title: values.title,
      description: values.description,
      location: values.location,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Give your post a title" 
                  disabled={isSubmitting}
                />
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
                  {...field} 
                  placeholder="Add a description..." 
                  disabled={isSubmitting}
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
                <Input 
                  {...field} 
                  placeholder="Add a location" 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Add tags separated by commas" 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Post...
            </>
          ) : (
            'Create Post'
          )}
        </Button>
      </form>
    </Form>
  );
};
