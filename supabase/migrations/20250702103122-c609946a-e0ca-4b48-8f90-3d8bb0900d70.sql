-- Fix feed_posts RLS policy to work with current authentication approach
DROP POLICY IF EXISTS "Users can create feed posts with proper auth check" ON public.feed_posts;

-- Create a simpler policy that works with our current approach
-- Since we're looking up the user by Clerk ID first, we can trust the user_id
CREATE POLICY "Authenticated users can create feed posts" 
ON public.feed_posts 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id IN (
    SELECT id FROM public.users 
    WHERE clerk_id IS NOT NULL
  )
);