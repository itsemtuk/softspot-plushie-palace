-- Fix marketplace_listings RLS policy for better auth handling
DROP POLICY IF EXISTS "Users can create their own listings" ON public.marketplace_listings;

-- Create a more robust policy that handles Clerk authentication better
CREATE POLICY "Users can create their own listings" 
ON public.marketplace_listings 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id IN (
    SELECT id FROM public.users 
    WHERE clerk_id = (
      COALESCE(
        auth.jwt() ->> 'sub',
        (auth.jwt() -> 'user_metadata' ->> 'clerk_id')::text,
        (current_setting('request.jwt.claims', true)::json ->> 'sub')::text
      )
    )
  )
);