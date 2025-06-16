
-- Drop existing policies to recreate them with correct Clerk integration
DROP POLICY IF EXISTS "Allow user creation during signup" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own record" ON public.users;

-- Create a more permissive policy for user creation that works with Clerk
CREATE POLICY "Allow authenticated user creation" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow users to view their own record based on Clerk ID
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
TO authenticated
USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub' OR clerk_id IS NULL);

-- Allow users to update their own record
CREATE POLICY "Users can update their own record" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow deletion of own record
CREATE POLICY "Users can delete their own record" 
ON public.users 
FOR DELETE 
TO authenticated
USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Also allow anonymous users to create accounts (for signup flow)
CREATE POLICY "Allow anonymous user creation during signup" 
ON public.users 
FOR INSERT 
TO anon
WITH CHECK (true);
