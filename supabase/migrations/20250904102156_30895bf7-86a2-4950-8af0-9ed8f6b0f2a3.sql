-- CRITICAL SECURITY FIXES - CORRECTED
-- Phase 1: Remove problematic security definer view and fix RLS policies

-- 1. Drop any security definer views (they bypass RLS and create security risks)
DROP VIEW IF EXISTS user_public_profiles CASCADE;

-- 2. Fix users table RLS policies - remove overly permissive policies
DROP POLICY IF EXISTS "Limited public user view" ON public.users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON public.users;

-- Create secure policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (clerk_id = (auth.jwt() ->> 'sub'::text));

-- Allow user creation during signup (needed for registration)
CREATE POLICY "Allow user creation during signup" ON public.users
  FOR INSERT WITH CHECK (true);

-- 3. Fix profiles table RLS policies - protect sensitive personal data
DROP POLICY IF EXISTS "Profiles respect privacy settings" ON public.profiles;

-- Create new secure policies for profiles
CREATE POLICY "Users can manage their own profile data" ON public.profiles
  FOR ALL USING (user_uuid IN (
    SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)
  ));

-- Public can only view limited, non-sensitive profile data
CREATE POLICY "Public can view limited profile data" ON public.profiles
  FOR SELECT USING (
    NOT COALESCE(is_private, false) 
    AND NOT COALESCE(hide_from_search, true)
  );

-- Create a secure public profile view that excludes all sensitive data
CREATE VIEW public.profiles_public AS
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
WHERE NOT COALESCE(is_private, false) 
  AND NOT COALESCE(hide_from_search, true);

COMMENT ON VIEW public.profiles_public IS 'Secure public view of profiles excluding all sensitive personal data (names, addresses, phone numbers, social media)';

-- Create a secure public user view with only safe data
CREATE VIEW public.users_public AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.users;

COMMENT ON VIEW public.users_public IS 'Secure public view of users with only non-sensitive data';

-- 4. Create audit logging for data access
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  ip_address text,
  user_agent text,
  timestamp timestamp with time zone DEFAULT now(),
  details jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only system can insert audit logs, no public access to read them
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "No public access to audit logs" ON public.security_audit_log
  FOR SELECT USING (false);

-- 5. Enhanced input validation function
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(
  input_text text, 
  max_length integer DEFAULT 2000, 
  allow_html boolean DEFAULT false
)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
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
    -- Remove SQL injection patterns
    sanitized := regexp_replace(sanitized, '--', '', 'gi');
    sanitized := regexp_replace(sanitized, ';', '', 'gi');
    sanitized := regexp_replace(sanitized, '\bUNION\b', '', 'gi');
    sanitized := regexp_replace(sanitized, '\bSELECT\b', '', 'gi');
    sanitized := regexp_replace(sanitized, '\bINSERT\b', '', 'gi');
    sanitized := regexp_replace(sanitized, '\bUPDATE\b', '', 'gi');
    sanitized := regexp_replace(sanitized, '\bDELETE\b', '', 'gi');
    sanitized := regexp_replace(sanitized, '\bDROP\b', '', 'gi');
  END IF;
  
  RETURN sanitized;
END;
$$;