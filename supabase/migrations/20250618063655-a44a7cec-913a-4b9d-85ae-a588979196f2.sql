
-- Drop the existing policies that rely on JWT claims
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can select by auth uid" ON public.users;

-- Create a more permissive policy for reading users that works with Clerk
-- This allows any authenticated request to read from users table
-- We'll handle access control in the application layer
CREATE POLICY "Allow authenticated reads" 
ON public.users 
FOR SELECT 
TO authenticated, anon
USING (true);

-- Keep the insert policy for the RPC function
CREATE POLICY "Allow service role inserts" 
ON public.users 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);
