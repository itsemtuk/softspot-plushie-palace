
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useClerkSupabaseUser } from '@/hooks/useClerkSupabaseUser';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

const sellFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  condition: z.enum(["new", "used", "like new"]),
  brand: z.string().optional(),
  deliveryMethod: z.enum(["shipping", "local pickup", "both"]),
});

type SellFormData = z.infer<typeof sellFormSchema>;

export const SimpleSellForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { supabaseUserId, isLoading: userLoading, error: userError } = useClerkSupabaseUser(user);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      condition: "new",
      brand: "",
      deliveryMethod: "shipping",
    },
  });

  const onSubmit = async (data: SellFormData) => {
    if (!supabaseUserId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User authentication required. Please try refreshing the page.",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting with user ID:', supabaseUserId);
    console.log('Form data:', data);

    try {
      const postData = {
        user_id: supabaseUserId,
        title: data.title,
        description: data.description,
        content: `${data.title}\n\n${data.description}`,
        price: data.price,
        condition: data.condition,
        brand: data.brand || null,
        delivery_method: data.deliveryMethod,
        for_sale: true,
        created_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('posts')
        .insert([postData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        toast({
          variant: "destructive",
          title: "Failed to list item",
          description: error.message,
        });
        return;
      }

      console.log('Successfully created post:', result);
      toast({
        title: "Success!",
        description: "Your item has been listed for sale",
      });

      form.reset();
      navigate('/marketplace');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-3" />
            <span>Setting up your account...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userError) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Unable to sync your account:</p>
                <p className="text-sm text-gray-600">{userError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!supabaseUserId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              User authentication required. Please sign in and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sell Your Plushie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter item title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your plushie..."
              rows={4}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("price", { valueAsNumber: true })}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select onValueChange={(value) => form.setValue("condition", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like new">Like New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Jellycat, Build-A-Bear"
                {...form.register("brand")}
              />
            </div>

            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <Select onValueChange={(value) => form.setValue("deliveryMethod", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="local pickup">Local Pickup</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Listing...
                </>
              ) : (
                'List for Sale'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
