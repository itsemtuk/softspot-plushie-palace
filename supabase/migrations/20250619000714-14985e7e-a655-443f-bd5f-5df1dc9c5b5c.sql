
-- Fix RLS policies for profiles table to work with Clerk authentication
-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.profiles;

-- Create permissive policies for profiles table
CREATE POLICY "Allow authenticated profile reads" 
ON public.profiles 
FOR SELECT 
TO authenticated, anon
USING (true);

CREATE POLICY "Allow authenticated profile inserts" 
ON public.profiles 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated profile updates" 
ON public.profiles 
FOR UPDATE 
TO authenticated, anon
USING (true);

-- Fix RLS policies for posts table to work with Clerk authentication
-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.posts;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.posts;

-- Create permissive policies for posts table
CREATE POLICY "Allow authenticated post reads" 
ON public.posts 
FOR SELECT 
TO authenticated, anon
USING (true);

CREATE POLICY "Allow authenticated post inserts" 
ON public.posts 
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated post updates" 
ON public.posts 
FOR UPDATE 
TO authenticated, anon
USING (true);

CREATE POLICY "Allow authenticated post deletes" 
ON public.posts 
FOR DELETE 
TO authenticated, anon
USING (true);
