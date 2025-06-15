
-- Enable RLS on users table (if not already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own record during signup
CREATE POLICY "Users can insert their own record" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view their own record
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = clerk_id OR id = auth.uid());

-- Allow users to update their own record
CREATE POLICY "Users can update their own record" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = clerk_id OR id = auth.uid());

-- Allow service role to manage users (for Clerk integration)
CREATE POLICY "Service role can manage users" 
ON public.users 
FOR ALL 
USING (auth.role() = 'service_role');
