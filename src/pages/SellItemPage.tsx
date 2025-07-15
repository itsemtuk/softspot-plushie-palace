
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/utils/supabase/client';
import { SellItemHeader } from '@/components/marketplace/sell/SellItemHeader';
import { SellItemImageSection } from '@/components/marketplace/sell/SellItemImageSection';
import { SellItemBasicInfo } from '@/components/marketplace/sell/SellItemBasicInfo';
import { SellItemDetails } from '@/components/marketplace/sell/SellItemDetails';
import { SellItemDelivery } from '@/components/marketplace/sell/SellItemDelivery';

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
      const imageUrl = selectedImages.length > 0 ? `placeholder-${selectedImages[0].name}` : null;

      // Create the listing
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          title: formData.title,
          description: formData.description,
          content: formData.description,
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

      // Reset form
      setFormData({
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
      setSelectedImages([]);

      // Navigate to marketplace with success message
      setTimeout(() => {
        navigate('/marketplace');
      }, 1500);

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
        <SellItemHeader />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <SellItemImageSection 
              selectedImages={selectedImages}
              onImagesChange={setSelectedImages}
            />

            <SellItemBasicInfo 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <SellItemDetails 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <SellItemDelivery 
              formData={formData}
              onInputChange={handleInputChange}
            />

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
