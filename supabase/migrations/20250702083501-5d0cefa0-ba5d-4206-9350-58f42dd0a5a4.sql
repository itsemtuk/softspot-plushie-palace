-- Security Review: Tighten RLS policies for better access control

-- 1. Make user_id columns NOT NULL where they should be
ALTER TABLE public.posts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.marketplace ALTER COLUMN user_id SET NOT NULL;

-- 2. Remove overly permissive policies and create more restrictive ones
-- Drop existing overly broad policies on posts table
DROP POLICY IF EXISTS "Allow authenticated post deletes" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated post inserts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated post reads" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated post updates" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Public read access" ON public.posts;
DROP POLICY IF EXISTS "User manage posts" ON public.posts;

-- Create more restrictive policies for posts
CREATE POLICY "Users can view all posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.posts
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- 3. Tighten marketplace policies
DROP POLICY IF EXISTS "Users can create their own marketplace items" ON public.marketplace;
DROP POLICY IF EXISTS "Users can manage listings" ON public.marketplace;
DROP POLICY IF EXISTS "Users can manage their own listings" ON public.marketplace;

CREATE POLICY "Users can create marketplace listings" ON public.marketplace
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Users can update their own listings" ON public.marketplace
  FOR UPDATE USING (
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

CREATE POLICY "Users can delete their own listings" ON public.marketplace
  FOR DELETE USING (
    user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
  );

-- 4. Secure user table policies
DROP POLICY IF EXISTS "Allow anonymous user creation during signup" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated user creation" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.users;
DROP POLICY IF EXISTS "Allow service role inserts" ON public.users;

-- Keep only necessary user policies
CREATE POLICY "Authenticated users can view user profiles" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own profile during signup" ON public.users
  FOR INSERT WITH CHECK (
    clerk_id = (auth.jwt() ->> 'sub')
  );

-- 5. Add content length constraints for security
ALTER TABLE public.posts ADD CONSTRAINT posts_content_length CHECK (length(content) <= 2000);
ALTER TABLE public.posts ADD CONSTRAINT posts_title_length CHECK (length(title) <= 200);
ALTER TABLE public.posts ADD CONSTRAINT posts_description_length CHECK (length(description) <= 1000);

-- 6. Add price validation constraints
ALTER TABLE public.posts ADD CONSTRAINT posts_price_positive CHECK (price IS NULL OR price >= 0);
ALTER TABLE public.posts ADD CONSTRAINT posts_price_reasonable CHECK (price IS NULL OR price <= 50000);
ALTER TABLE public.marketplace ADD CONSTRAINT marketplace_price_positive CHECK (price >= 0);
ALTER TABLE public.marketplace ADD CONSTRAINT marketplace_price_reasonable CHECK (price <= 50000);

-- 7. Add username validation
ALTER TABLE public.users ADD CONSTRAINT users_username_length CHECK (length(username) <= 30);
ALTER TABLE public.users ADD CONSTRAINT users_username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$');

-- 8. Add bio length constraint
ALTER TABLE public.profiles ADD CONSTRAINT profiles_bio_length CHECK (length(bio) <= 500);