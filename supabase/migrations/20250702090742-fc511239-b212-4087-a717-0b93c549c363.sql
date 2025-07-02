-- Fix feed_posts RLS policy issue
-- The current policy is causing violations, need to fix the user authentication check

DROP POLICY IF EXISTS "Authenticated users can create feed posts" ON public.feed_posts;

-- Create a more permissive policy that properly checks user authentication
CREATE POLICY "Users can create feed posts with proper auth check" 
ON public.feed_posts 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id IN (
    SELECT id FROM public.users 
    WHERE clerk_id = (auth.jwt() ->> 'sub'::text)
  )
);