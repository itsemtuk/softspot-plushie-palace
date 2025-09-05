-- Fix the remaining security definer view issue
DROP VIEW IF EXISTS public.users_public;

-- Recreate users_public view with SECURITY INVOKER
CREATE VIEW public.users_public
WITH (security_invoker = true)
AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.users;

-- Grant access to the view
GRANT SELECT ON public.users_public TO authenticated, anon;