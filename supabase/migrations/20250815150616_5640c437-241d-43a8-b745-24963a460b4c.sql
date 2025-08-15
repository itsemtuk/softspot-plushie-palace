-- Fix security linter warnings by setting proper search paths

-- Fix the function search path issues
DROP FUNCTION IF EXISTS public.user_owns_post(UUID);
DROP FUNCTION IF EXISTS public.user_owns_listing(UUID);
DROP FUNCTION IF EXISTS public.validate_and_sanitize_input(TEXT, INTEGER, BOOLEAN);

-- Recreate functions with proper search paths
CREATE OR REPLACE FUNCTION public.user_owns_post(post_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.user_owns_listing(listing_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(
  input_text TEXT,
  max_length INTEGER DEFAULT 2000,
  allow_html BOOLEAN DEFAULT FALSE
)
RETURNS TEXT
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
  END IF;
  
  RETURN sanitized;
END;
$$;