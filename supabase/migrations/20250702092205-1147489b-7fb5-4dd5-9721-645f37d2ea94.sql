-- Fix the RLS policy to remove insecure user_metadata reference
DROP POLICY IF EXISTS "Users can create their own listings" ON public.marketplace_listings;

-- Create a secure policy that only uses the 'sub' claim from JWT
CREATE POLICY "Users can create their own listings" 
ON public.marketplace_listings 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id IN (
    SELECT id FROM public.users 
    WHERE clerk_id = (auth.jwt() ->> 'sub')
  )
);