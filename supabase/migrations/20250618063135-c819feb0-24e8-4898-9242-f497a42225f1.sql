
-- First, let's see what policies already exist on the users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Drop and recreate the policy with the correct JWT claim check
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;

-- Create a policy that allows users to view their own record using Clerk ID from JWT
CREATE POLICY "Users can view their own record" 
ON public.users 
FOR SELECT 
USING (
  clerk_id = COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'clerk_user_id'
  )
);

-- Also create a policy for authenticated users to select their own record by ID
CREATE POLICY "Users can select by auth uid" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = clerk_id OR id = auth.uid());
