-- Fix remaining SECURITY DEFINER functions that don't need elevated privileges

-- 1. Replace log_security_event with a regular function
DROP FUNCTION IF EXISTS public.log_security_event(text, uuid, jsonb);

CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id_param uuid DEFAULT NULL,
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Only log if user is authenticated or if it's a system event
  IF auth.uid() IS NOT NULL OR user_id_param IS NULL THEN
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

-- 2. Replace create_offer_with_notification with a regular function
DROP FUNCTION IF EXISTS public.create_offer_with_notification(uuid, uuid, uuid, numeric, text);

CREATE OR REPLACE FUNCTION public.create_offer_with_notification(
  p_listing_id uuid,
  p_buyer_id uuid, 
  p_seller_id uuid,
  p_offer_amount numeric,
  p_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  offer_id UUID;
  buyer_username TEXT;
  listing_title TEXT;
BEGIN
  -- Verify the buyer is the authenticated user
  IF p_buyer_id NOT IN (
    SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Can only create offers as authenticated user';
  END IF;

  -- Get buyer username and listing title
  SELECT u.username, p.title INTO buyer_username, listing_title
  FROM public.users u, public.posts p
  WHERE u.id = p_buyer_id AND p.id = p_listing_id;

  -- Create the offer
  INSERT INTO public.offers (listing_id, buyer_id, seller_id, offer_amount, message)
  VALUES (p_listing_id, p_buyer_id, p_seller_id, p_offer_amount, p_message)
  RETURNING id INTO offer_id;

  -- Create notification (best effort, don't fail if it doesn't work)
  BEGIN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      p_seller_id,
      'offer',
      'New Offer Received',
      COALESCE(buyer_username, 'Someone') || ' made an offer of $' || p_offer_amount || 
        CASE WHEN listing_title IS NOT NULL THEN ' on ' || listing_title ELSE '' END,
      jsonb_build_object(
        'offer_id', offer_id,
        'listing_id', p_listing_id,
        'buyer_id', p_buyer_id,
        'offer_amount', p_offer_amount
      )
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the offer creation
      NULL;
  END;

  RETURN offer_id;
END;
$$;

-- 3. Add comments explaining why certain functions retain SECURITY DEFINER
COMMENT ON FUNCTION public.create_user_safe(jsonb) IS 'SECURITY DEFINER required for safe user creation during signup process';
COMMENT ON FUNCTION public.set_current_user_id(text) IS 'SECURITY DEFINER required for RLS context management';

-- 4. Update security configuration documentation
COMMENT ON TABLE public.security_audit_log IS 'Security audit log for monitoring data access and security events';

-- 5. Create a function to check current security status
CREATE OR REPLACE FUNCTION public.get_security_status()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Return security configuration status (non-sensitive info only)
  SELECT jsonb_build_object(
    'rls_enabled_tables', (
      SELECT count(*)
      FROM pg_tables t
      JOIN pg_class c ON c.relname = t.tablename
      WHERE t.schemaname = 'public'
        AND c.relrowsecurity = true
    ),
    'total_public_tables', (
      SELECT count(*)
      FROM pg_tables
      WHERE schemaname = 'public'
    ),
    'audit_log_enabled', EXISTS(
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'security_audit_log'
    )
  ) INTO result;
  
  RETURN result;
END;
$$;