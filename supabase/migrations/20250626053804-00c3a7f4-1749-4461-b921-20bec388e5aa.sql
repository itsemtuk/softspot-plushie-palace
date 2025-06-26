
-- Create separate feed_posts table for regular posts
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add bidding system columns to posts table (for marketplace)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS accepts_offers BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS min_offer_amount NUMERIC DEFAULT NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS offer_deadline TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'fixed_price' CHECK (listing_type IN ('fixed_price', 'offers_only', 'both'));

-- Create offers table for bidding system
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  offer_amount NUMERIC NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'withdrawn')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_reviews table for profile reviews
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'sale', 'trade')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(reviewer_id, reviewed_user_id)
);

-- Create user_badges table for user achievements
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS on new tables
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS policies for feed_posts
CREATE POLICY "Anyone can view feed posts" ON public.feed_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create feed posts" ON public.feed_posts FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' IS NOT NULL);
CREATE POLICY "Users can update their own feed posts" ON public.feed_posts FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Users can delete their own feed posts" ON public.feed_posts FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
);

-- RLS policies for offers
CREATE POLICY "Users can view offers for their listings or their own offers" ON public.offers FOR SELECT USING (
  buyer_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub') OR
  seller_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Authenticated users can create offers" ON public.offers FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' IS NOT NULL);
CREATE POLICY "Buyers can update their own offers" ON public.offers FOR UPDATE USING (
  buyer_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
);

-- RLS policies for user_reviews
CREATE POLICY "Anyone can view reviews" ON public.user_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.user_reviews FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' IS NOT NULL);

-- RLS policies for user_badges
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- Function to create offer and notification
CREATE OR REPLACE FUNCTION public.create_offer_with_notification(
  p_listing_id UUID,
  p_buyer_id UUID,
  p_seller_id UUID,
  p_offer_amount NUMERIC,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  offer_id UUID;
  buyer_username TEXT;
  listing_title TEXT;
BEGIN
  -- Get buyer username and listing title
  SELECT u.username, p.title INTO buyer_username, listing_title
  FROM public.users u, public.posts p
  WHERE u.id = p_buyer_id AND p.id = p_listing_id;
  
  -- Create the offer
  INSERT INTO public.offers (listing_id, buyer_id, seller_id, offer_amount, message)
  VALUES (p_listing_id, p_buyer_id, p_seller_id, p_offer_amount, p_message)
  RETURNING id INTO offer_id;
  
  -- Create notification if notifications table exists
  BEGIN
    PERFORM public.create_notification(
      p_seller_id,
      'offer',
      'New Offer Received',
      buyer_username || ' made an offer of $' || p_offer_amount || ' on ' || listing_title,
      jsonb_build_object(
        'offer_id', offer_id,
        'listing_id', p_listing_id,
        'buyer_id', p_buyer_id,
        'offer_amount', p_offer_amount
      )
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Ignore if notifications function doesn't exist yet
      NULL;
  END;
  
  RETURN offer_id;
END;
$$;
