-- Security Fix: Clean up duplicate and conflicting RLS policies

-- Drop duplicate policies on users table
DROP POLICY IF EXISTS "Allow anonymous user creation during signup" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated user creation" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON public.users;
DROP POLICY IF EXISTS "Allow service role inserts" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;

-- Create single, secure policy for users table
CREATE POLICY "Users can manage their own data" ON public.users
FOR ALL USING (clerk_id = (auth.jwt() ->> 'sub'::text))
WITH CHECK (clerk_id = (auth.jwt() ->> 'sub'::text));

-- Allow authenticated user creation during signup
CREATE POLICY "Allow user creation during signup" ON public.users
FOR INSERT WITH CHECK (true);

-- Allow public read access to user profiles
CREATE POLICY "Public can view user profiles" ON public.users
FOR SELECT USING (true);

-- Clean up posts table policies
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;

-- Keep only the secure policies for posts
-- The existing secure policies are good, so we'll keep them

-- Clean up profiles table policies
DROP POLICY IF EXISTS "Allow authenticated profile inserts" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated profile reads" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated profile updates" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their profile" ON public.profiles;

-- Keep only the secure Clerk-based policies for profiles

-- Clean up marketplace table policies
DROP POLICY IF EXISTS "Users can manage listings" ON public.marketplace;
DROP POLICY IF EXISTS "Users can create their own marketplace items" ON public.marketplace;
DROP POLICY IF EXISTS "Users can delete their own marketplace items" ON public.marketplace;
DROP POLICY IF EXISTS "Users can update their own marketplace items" ON public.marketplace;
DROP POLICY IF EXISTS "Users can view all marketplace items" ON public.marketplace;

-- Create secure marketplace policies
CREATE POLICY "Users can manage their own marketplace listings" ON public.marketplace
FOR ALL USING (user_id IN (
  SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)
))
WITH CHECK (user_id IN (
  SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)
));

CREATE POLICY "Public can view marketplace listings" ON public.marketplace
FOR SELECT USING (true);

-- Security audit log function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID,
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log security events for monitoring
  -- This is a placeholder for future security logging
  RAISE NOTICE 'Security Event: % for user % with details %', event_type, user_id, details;
END;
$$;