
-- Fix RLS policies for followers table
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view follows" ON public.followers;
DROP POLICY IF EXISTS "Users can create follows" ON public.followers;
DROP POLICY IF EXISTS "Users can delete their follows" ON public.followers;

-- Create new policies that work with Clerk authentication
CREATE POLICY "Users can view follows" ON public.followers
  FOR SELECT USING (true);

CREATE POLICY "Users can create follows" ON public.followers
  FOR INSERT WITH CHECK (
    follower_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can delete their follows" ON public.followers
  FOR DELETE USING (
    follower_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

-- Also add a policy for updates if needed
CREATE POLICY "Users can update their follows" ON public.followers
  FOR UPDATE USING (
    follower_id IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
  );
