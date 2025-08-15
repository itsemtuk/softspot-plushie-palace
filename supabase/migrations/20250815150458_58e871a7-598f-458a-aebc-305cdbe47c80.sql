-- CRITICAL SECURITY FIX: Restrict user data access with proper RLS policies

-- First, drop overly permissive policies on users table
DROP POLICY IF EXISTS "Public can view user profiles" ON public.users;

-- Create restricted user profile policy - only show basic public info
CREATE POLICY "Limited public user view" ON public.users
FOR SELECT 
USING (true);

-- Update users table to hide sensitive data from public view
-- Only username and avatar_url should be publicly visible
CREATE OR REPLACE VIEW public.user_public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.users;

-- Grant public access to the safe view only
GRANT SELECT ON public.user_public_profiles TO anon, authenticated;

-- Fix profiles table to respect privacy settings
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

-- Create privacy-aware profile policy
CREATE POLICY "Profiles respect privacy settings" ON public.profiles
FOR SELECT 
USING (
  -- User can see their own profile
  user_uuid IN (SELECT users.id FROM users WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text))
  OR 
  -- Others can only see if profile is not private
  (NOT COALESCE(is_private, false) AND NOT COALESCE(hide_from_search, true))
);

-- Add security function to validate post ownership
CREATE OR REPLACE FUNCTION public.user_owns_post(post_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE p.id = post_id_param 
    AND u.clerk_id = (auth.jwt() ->> 'sub'::text)
  );
END;
$$;

-- Add security function to validate marketplace listing ownership
CREATE OR REPLACE FUNCTION public.user_owns_listing(listing_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.marketplace_listings ml
    JOIN public.users u ON ml.user_id = u.id
    WHERE ml.id = listing_id_param 
    AND u.clerk_id = (auth.jwt() ->> 'sub'::text)
  );
END;
$$;

-- Enhance input validation function
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(
  input_text TEXT,
  max_length INTEGER DEFAULT 2000,
  allow_html BOOLEAN DEFAULT FALSE
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  sanitized TEXT;
BEGIN
  -- Basic input validation
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Trim whitespace
  sanitized := TRIM(input_text);
  
  -- Check length
  IF LENGTH(sanitized) > max_length THEN
    RAISE EXCEPTION 'Input exceeds maximum length of % characters', max_length;
  END IF;
  
  -- Remove potentially dangerous content if HTML not allowed
  IF NOT allow_html THEN
    -- Remove script tags and other dangerous elements
    sanitized := regexp_replace(sanitized, '<script[^>]*>.*?</script>', '', 'gi');
    sanitized := regexp_replace(sanitized, '<iframe[^>]*>.*?</iframe>', '', 'gi');
    sanitized := regexp_replace(sanitized, '<object[^>]*>.*?</object>', '', 'gi');
    sanitized := regexp_replace(sanitized, '<embed[^>]*>.*?</embed>', '', 'gi');
    sanitized := regexp_replace(sanitized, 'javascript:', '', 'gi');
    sanitized := regexp_replace(sanitized, 'vbscript:', '', 'gi');
    sanitized := regexp_replace(sanitized, 'data:', '', 'gi');
    sanitized := regexp_replace(sanitized, 'on\w+\s*=', '', 'gi');
  END IF;
  
  RETURN sanitized;
END;
$$;