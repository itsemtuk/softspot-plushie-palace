
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;

-- Create more permissive policies for user creation
CREATE POLICY "Allow user creation during signup" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view their own record based on Clerk ID
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (clerk_id = auth.jwt() ->> 'sub' OR clerk_id IS NULL);

-- Allow users to update their own record
CREATE POLICY "Users can update their own record" 
ON public.users 
FOR UPDATE 
USING (clerk_id = auth.jwt() ->> 'sub');

-- Allow deletion of own record
CREATE POLICY "Users can delete their own record" 
ON public.users 
FOR DELETE 
USING (clerk_id = auth.jwt() ->> 'sub');
