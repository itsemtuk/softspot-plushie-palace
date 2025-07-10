-- Fix marketplace_listings RLS policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can create their own listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can view all active listings" ON public.marketplace_listings;

-- Create comprehensive RLS policies for marketplace_listings
CREATE POLICY "Authenticated users can create listings" ON public.marketplace_listings
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text))
);

CREATE POLICY "Users can update their own listings" ON public.marketplace_listings
FOR UPDATE 
USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)))
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)));

CREATE POLICY "Users can delete their own listings" ON public.marketplace_listings
FOR DELETE 
USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)));

CREATE POLICY "Everyone can view active listings" ON public.marketplace_listings
FOR SELECT 
USING (status = 'active');

-- Also ensure the posts table has a policy for profile viewing
CREATE POLICY "Users can view posts for profiles" ON public.posts
FOR SELECT 
USING (true);