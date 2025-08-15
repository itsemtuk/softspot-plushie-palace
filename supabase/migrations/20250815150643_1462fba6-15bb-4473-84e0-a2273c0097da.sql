-- Remove the problematic security definer view and replace with regular view
DROP VIEW IF EXISTS public.user_public_profiles;

-- Create a regular view without security definer
CREATE VIEW public.user_public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.users;