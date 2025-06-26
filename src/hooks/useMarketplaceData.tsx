
import { useState, useEffect, useCallback } from "react";
import { MarketplacePlushie } from "@/types/marketplace";
import { supabase } from "@/integrations/supabase/client";

export function useMarketplaceData() {
  const [items, setItems] = useState<MarketplacePlushie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);
      
      // Fetch from posts table where for_sale is true
      const { data: marketplacePosts, error: marketplaceError } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey(username, avatar_url)
        `)
        .eq('for_sale', true)
        .order('created_at', { ascending: false });

      if (marketplaceError) {
        console.error("Error fetching marketplace items:", marketplaceError);
        setItems([]);
        return;
      }

      const formattedItems: MarketplacePlushie[] = (marketplacePosts || []).map(post => ({
        id: post.id,
        title: post.title || 'Untitled',
        price: post.price || 0,
        image: post.image || '',
        imageUrl: post.image || '',
        brand: post.brand || '',
        condition: post.condition || 'Unknown',
        description: post.description || post.content || '',
        tags: [],
        likes: 0,
        comments: 0,
        forSale: true,
        userId: post.user_id || '',
        username: (post.users as any)?.username || 'User',
        timestamp: post.created_at || '',
        location: '',
        material: post.material || '',
        filling: post.filling || '',
        species: post.species || '',
        deliveryMethod: post.delivery_method || '',
        deliveryCost: post.delivery_cost || 0,
        size: post.size || '',
        color: post.color || ''
      }));

      setItems(formattedItems);
    } catch (err) {
      console.error("Error loading marketplace items:", err);
      setError(true);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    setItems,
    isLoading,
    error,
    refetch: loadItems
  };
}
