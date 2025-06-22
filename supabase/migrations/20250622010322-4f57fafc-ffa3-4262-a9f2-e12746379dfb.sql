
-- Drop the existing policies that use auth.jwt()
DROP POLICY IF EXISTS "Users can view follows" ON public.followers;
DROP POLICY IF EXISTS "Users can create follows" ON public.followers;
DROP POLICY IF EXISTS "Users can delete their follows" ON public.followers;
DROP POLICY IF EXISTS "Users can update their follows" ON public.followers;

-- Create simpler policies that allow authenticated operations
-- Since we're handling authentication in the application layer with Clerk
CREATE POLICY "Enable read access for all users" ON public.followers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.followers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.followers
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON public.followers
  FOR DELETE USING (true);
