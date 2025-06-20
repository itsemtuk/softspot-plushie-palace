
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SellItemPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    condition: 'excellent',
    material: '',
    species: '',
    size: '',
    color: '',
    filling: '',
    delivery_method: 'shipping',
    delivery_cost: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: 'You can upload a maximum of 5 images.'
      });
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to list an item.'
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.price) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get user's Supabase ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', user.id)
        .maybeSingle();

      let userId: string;

      if (!userData) {
        // Create user if doesn't exist
        const { data: createdUser } = await supabase.rpc('create_user_safe', {
          user_data: {
            clerk_id: user.id,
            username: user.username || user.firstName || 'User',
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.emailAddresses?.[0]?.emailAddress,
            avatar_url: user.imageUrl
          }
        });

        if (!createdUser || createdUser.length === 0) {
          throw new Error('Failed to create user');
        }
        userId = createdUser[0].id;
      } else {
        userId = userData.id;
      }

      // For now, just store the first image file name as a placeholder
      // In a real app, you'd upload to storage and get URLs
      const imageUrl = selectedImages.length > 0 ? `placeholder-${selectedImages[0].name}` : null;

      // Create the listing
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          title: formData.title,
          description: formData.description,
          content: formData.description, // Required field
          price: parseFloat(formData.price),
          brand: formData.brand,
          condition: formData.condition,
          material: formData.material,
          species: formData.species,
          size: formData.size,
          color: formData.color,
          filling: formData.filling,
          delivery_method: formData.delivery_method,
          delivery_cost: formData.delivery_cost ? parseFloat(formData.delivery_cost) : null,
          for_sale: true,
          image: imageUrl
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your item has been listed successfully.'
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create listing. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            List Your Plushie for Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Photos (Max 5)</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload photos</p>
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Jellycat Bashful Bunny"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your plushie's condition, any special features, etc."
                rows={4}
                required
              />
            </div>

            {/* Plushie Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="e.g., Jellycat, Build-A-Bear"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New with tags</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species/Type</Label>
                <Input
                  id="species"
                  value={formData.species}
                  onChange={(e) => handleInputChange('species', e.target.value)}
                  placeholder="e.g., Bear, Bunny, Cat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="e.g., Small, Medium, Large"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="e.g., Brown, Pink, Multi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="e.g., Soft plush, Velour"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filling">Filling</Label>
                <Input
                  id="filling"
                  value={formData.filling}
                  onChange={(e) => handleInputChange('filling', e.target.value)}
                  placeholder="e.g., Polyester, Beans"
                />
              </div>
            </div>

            {/* Delivery Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_method">Delivery Method</Label>
                <Select value={formData.delivery_method} onValueChange={(value) => handleInputChange('delivery_method', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="pickup">Local Pickup</SelectItem>
                    <SelectItem value="both">Both Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery_cost">Delivery Cost ($)</Label>
                <Input
                  id="delivery_cost"
                  type="number"
                  step="0.01"
                  value={formData.delivery_cost}
                  onChange={(e) => handleInputChange('delivery_cost', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-softspot-500 hover:bg-softspot-600"
              >
                {isSubmitting ? 'Creating Listing...' : 'List Item for Sale'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/marketplace')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellItemPage;
