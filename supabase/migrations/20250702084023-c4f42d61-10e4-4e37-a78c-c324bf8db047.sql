-- Enhanced Trade Request and Marketplace Selling System

-- Create enhanced listing types and options
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  condition TEXT,
  price DECIMAL(10,2),
  image_urls TEXT[],
  
  -- Enhanced selling options
  listing_type TEXT NOT NULL DEFAULT 'fixed_price' CHECK (listing_type IN ('fixed_price', 'negotiable', 'auction', 'trade_only')),
  allows_offers BOOLEAN DEFAULT false,
  allows_trades BOOLEAN DEFAULT false,
  minimum_offer DECIMAL(10,2),
  
  -- Auction-specific fields
  auction_end_time TIMESTAMP WITH TIME ZONE,
  current_bid DECIMAL(10,2),
  bid_increment DECIMAL(10,2) DEFAULT 1.00,
  
  -- Trade preferences
  trade_preferences TEXT,
  preferred_trade_brands TEXT[],
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bids table for auction functionality
CREATE TABLE IF NOT EXISTS public.listing_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES public.users(id),
  bid_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create offers table for negotiable listings
CREATE TABLE IF NOT EXISTS public.listing_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  seller_id UUID NOT NULL REFERENCES public.users(id),
  offer_amount DECIMAL(10,2),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'counter_offered')),
  counter_offer_amount DECIMAL(10,2),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced trade requests table
CREATE TABLE IF NOT EXISTS public.trade_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.users(id),
  target_user_id UUID NOT NULL REFERENCES public.users(id),
  
  -- Items being offered for trade
  offered_listing_id UUID REFERENCES public.marketplace_listings(id),
  offered_items_description TEXT,
  
  -- Items being requested
  requested_listing_id UUID REFERENCES public.marketplace_listings(id),
  requested_items_description TEXT,
  
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'counter_offered')),
  
  -- Counter offer details
  counter_offer_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced messages table for trade integration
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  receiver_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'trade_request', 'offer', 'listing_share')),
  
  -- Related entities for special message types
  trade_request_id UUID REFERENCES public.trade_requests(id),
  listing_offer_id UUID REFERENCES public.listing_offers(id),
  shared_listing_id UUID REFERENCES public.marketplace_listings(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants UUID[] NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Marketplace listings policies
CREATE POLICY "Users can view all active listings" ON public.marketplace_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Users can update their own listings" ON public.marketplace_listings
  FOR UPDATE USING (
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- Bids policies
CREATE POLICY "Users can view bids on listings" ON public.listing_bids
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can place bids" ON public.listing_bids
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    bidder_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- Offers policies
CREATE POLICY "Users can view offers for their listings or their own offers" ON public.listing_offers
  FOR SELECT USING (
    buyer_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub')) OR
    seller_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Authenticated users can create offers" ON public.listing_offers
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    buyer_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- Trade requests policies
CREATE POLICY "Users can view trade requests involving them" ON public.trade_requests
  FOR SELECT USING (
    requester_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub')) OR
    target_user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Authenticated users can create trade requests" ON public.trade_requests
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    requester_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
    sender_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub')) OR
    receiver_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Authenticated users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    sender_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (
    (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub')) = ANY(participants)
  );

CREATE POLICY "Authenticated users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub')) = ANY(participants)
  );