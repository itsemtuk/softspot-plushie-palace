-- Fix Security Issues Found by Linter

-- 1. Fix function search path mutable issue
CREATE OR REPLACE FUNCTION public.log_profile_modification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Log profile modifications
  IF TG_OP = 'UPDATE' THEN
    PERFORM public.log_security_event_safe(
      'PROFILE_UPDATED',
      auth.uid(),
      jsonb_build_object(
        'profile_id', NEW.user_uuid,
        'timestamp', now()
      )
    );
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_security_event_safe(
      'PROFILE_CREATED',
      auth.uid(),
      jsonb_build_object(
        'profile_id', NEW.user_uuid,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2. Fix security definer view issues by recreating views as SECURITY INVOKER
DROP VIEW IF EXISTS public.profiles_safe;
DROP VIEW IF EXISTS public.profiles_public;

-- Create secure view with SECURITY INVOKER (uses querying user's permissions)
CREATE VIEW public.profiles_safe 
WITH (security_invoker = true)
AS
SELECT 
  user_uuid as id,
  bio,
  website,
  location,
  favorite_brands,
  favorite_types,
  header_background_color,
  header_gradient_start,
  header_gradient_end,
  header_background_image,
  header_text_color,
  created_at,
  -- Privacy settings
  is_private,
  hide_from_search
FROM public.profiles
WHERE NOT COALESCE(is_private, false);

-- Recreate profiles_public view with security invoker
CREATE VIEW public.profiles_public
WITH (security_invoker = true) 
AS
SELECT 
  user_uuid,
  created_at,
  bio,
  website,
  location,
  favorite_brands,
  favorite_types,
  header_background_color,
  header_gradient_start,
  header_gradient_end,
  header_background_image,
  header_text_color,
  is_private,
  hide_from_search
FROM public.profiles
WHERE NOT COALESCE(is_private, false) AND NOT COALESCE(hide_from_search, true);

-- Grant access to the views
GRANT SELECT ON public.profiles_safe TO authenticated, anon;
GRANT SELECT ON public.profiles_public TO authenticated, anon;

-- 3. Add RLS policies for the views (if needed)
-- Views inherit RLS from underlying tables, but we can be explicit

-- Note: Views don't need their own RLS policies as they inherit from underlying tables
-- The profiles table already has proper RLS policies set up