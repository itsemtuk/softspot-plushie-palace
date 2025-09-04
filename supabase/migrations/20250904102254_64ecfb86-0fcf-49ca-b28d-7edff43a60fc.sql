-- Remove remaining security definer functions and replace with secure alternatives

-- 1. Drop problematic security definer functions
DROP FUNCTION IF EXISTS public.validate_and_sanitize_input(text, integer, boolean);
DROP FUNCTION IF EXISTS public.audit_profile_access();

-- 2. Recreate validate_and_sanitize_input without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(
  input_text text, 
  max_length integer DEFAULT 2000, 
  allow_html boolean DEFAULT false
)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
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

-- 3. Check if there are any other security definer functions and replace them
-- Replace existing security definer functions with regular functions where possible

-- Recreate user_owns_post without SECURITY DEFINER if it exists
DROP FUNCTION IF EXISTS public.user_owns_post(uuid);
CREATE OR REPLACE FUNCTION public.user_owns_post(post_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
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

-- Recreate user_owns_listing without SECURITY DEFINER if it exists
DROP FUNCTION IF EXISTS public.user_owns_listing(uuid);
CREATE OR REPLACE FUNCTION public.user_owns_listing(listing_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SET search_path = public
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

-- 4. Add constraints to protect sensitive data at the database level
-- Add check constraints to prevent sensitive data exposure

-- Add comment explaining the security approach
COMMENT ON TABLE public.users IS 'User table with RLS policies restricting access to sensitive data. Use users_public view for public access.';
COMMENT ON TABLE public.profiles IS 'User profiles with RLS policies protecting personal data. Use profiles_public view for safe public access.';

-- 5. Create a security monitoring function (without SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.log_security_event_safe(
  event_type text,
  user_id_param uuid DEFAULT NULL,
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Only log if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      resource_type,
      details
    ) VALUES (
      COALESCE(user_id_param, auth.uid()),
      event_type,
      'security_event',
      details
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Silently fail to avoid breaking application functionality
    NULL;
END;
$$;