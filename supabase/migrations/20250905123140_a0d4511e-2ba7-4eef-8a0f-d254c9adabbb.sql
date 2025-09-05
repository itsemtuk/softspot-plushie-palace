-- Phase 1: Critical Security Fixes (Corrected)

-- 1. Fix overly permissive user creation policy
DROP POLICY IF EXISTS "Allow user creation during signup" ON public.users;

-- Create proper user creation policy that only allows authenticated creation
CREATE POLICY "Authenticated users can create their profile" 
ON public.users 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND clerk_id = (auth.jwt() ->> 'sub'::text)
);

-- 2. Create secure public profiles view (non-sensitive data only)
CREATE OR REPLACE VIEW public.profiles_safe AS
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

-- Grant access to the safe view
GRANT SELECT ON public.profiles_safe TO authenticated, anon;

-- 3. Strengthen profiles table RLS - restrict sensitive PII access
DROP POLICY IF EXISTS "Public can view limited profile data" ON public.profiles;

-- Only allow users to see their own full profile data
CREATE POLICY "Users can view their own full profile" 
ON public.profiles 
FOR SELECT 
USING (
  user_uuid IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text)
  )
);

-- 4. Strengthen messages table RLS policies
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
  sender_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text)
  ) 
  OR 
  receiver_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text)
  )
);

-- 5. Strengthen financial data access - offers table
DROP POLICY IF EXISTS "Users can view offers for their listings or their own offers" ON public.offers;

CREATE POLICY "Restrict offer access to participants only" 
ON public.offers 
FOR SELECT 
USING (
  (buyer_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text)
  )) 
  OR 
  (seller_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text)
  ))
);

-- 6. Ensure security audit logs remain completely private
DROP POLICY IF EXISTS "No public access to audit logs" ON public.security_audit_log;

CREATE POLICY "Completely restrict audit log access" 
ON public.security_audit_log 
FOR ALL 
USING (false);

-- 7. Create function to validate user data access
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Users can only access their own data
  RETURN target_user_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub'::text)
  );
END;
$$;

-- 8. Add logging function for security events (INSERT/UPDATE/DELETE only)
CREATE OR REPLACE FUNCTION public.log_profile_modification()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Add trigger for profile modification logging
DROP TRIGGER IF EXISTS profile_modification_logger ON public.profiles;
CREATE TRIGGER profile_modification_logger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_modification();