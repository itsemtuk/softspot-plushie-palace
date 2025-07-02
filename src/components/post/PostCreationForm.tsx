
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { PostCreationData } from "@/types/core";
import { ValidationSchemas, validateAndSanitizeFormData, postCreationLimiter } from "@/utils/security/inputValidation";
import { useSecurityMonitoring } from "@/utils/security/monitoring";
import { useUser } from "@clerk/clerk-react";

const postCreationSchema = z.object({
  title: ValidationSchemas.postTitle,
  description: ValidationSchemas.postContent,
});

interface PostCreationFormProps {
  onPostCreated: (data: PostCreationData) => Promise<void>;
  onClose: () => void;
}

export const PostCreationForm = ({ onPostCreated, onClose }: PostCreationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { logInputValidationFailure, logRateLimitExceeded } = useSecurityMonitoring();
  
  const form = useForm<z.infer<typeof postCreationSchema>>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof postCreationSchema>) => {
    // Check rate limiting
    if (!postCreationLimiter.isAllowed(user?.id || 'anonymous')) {
      logRateLimitExceeded('post-creation', user?.id);
      toast({
        variant: "destructive",
        title: "Rate limit exceeded",
        description: `Please wait before creating another post. You can create ${postCreationLimiter.getRemainingAttempts(user?.id || 'anonymous')} more posts.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Since form validation already passed, we can use the values directly
      // Additional sanitization is handled by the form schema
      const postData: PostCreationData = {
        title: values.title,
        description: values.description,
        content: values.description,
        image: "", // This will be set by the parent component
        tags: [],
      };
      
      await onPostCreated(postData);
      toast({
        title: "Post created!",
        description: "Your post has been successfully created.",
      });
      onClose();
    } catch (error) {
      console.error('Post creation error:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating your post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
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
                  placeholder="Write something about your plushie..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
