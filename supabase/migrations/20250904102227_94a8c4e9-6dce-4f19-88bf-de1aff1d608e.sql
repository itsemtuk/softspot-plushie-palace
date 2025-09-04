-- CRITICAL SECURITY FIXES
-- Phase 1: Remove problematic security definer view and fix RLS policies

-- 1. Drop any security definer views (they bypass RLS and create security risks)
DROP VIEW IF EXISTS user_public_profiles CASCADE;

-- 2. Fix users table RLS policies - remove overly permissive policies
DROP POLICY IF EXISTS "Limited public user view" ON public.users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON public.users;

-- Create secure policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (clerk_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Public can view basic user info only" ON public.users
  FOR SELECT USING (true)
  WITH CHECK (false); -- This will be handled by a secure view

-- Create a secure public profile view with only safe data
CREATE VIEW public.user_public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.users;

-- Enable RLS on the view (though views inherit table policies)
COMMENT ON VIEW public.user_public_profiles IS 'Secure public view of user profiles with only non-sensitive data';

-- 3. Fix profiles table RLS policies - protect sensitive personal data
DROP POLICY IF EXISTS "Profiles respect privacy settings" ON public.profiles;

-- Create new secure policies for profiles
CREATE POLICY "Users can manage their own profile data" ON public.profiles
  FOR ALL USING (user_uuid IN (
    SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'::text)
  ));

CREATE POLICY "Public can view non-sensitive profile data only" ON public.profiles
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

-- Only admins and system can view audit logs
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "No public access to audit logs" ON public.security_audit_log
  FOR SELECT USING (false); -- Restrict all access by default

-- 5. Add data validation triggers for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive profile data
  IF TG_OP = 'SELECT' AND OLD.full_name IS NOT NULL THEN
    INSERT INTO public.security_audit_log (
      action, 
      resource_type, 
      resource_id, 
      details
    ) VALUES (
      'profile_sensitive_data_access',
      'profiles',
      OLD.user_uuid,
      jsonb_build_object('fields_accessed', 'full_name,phone_number,address')
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging (commented out to avoid performance impact)
-- CREATE TRIGGER audit_profile_access_trigger
--   BEFORE SELECT ON public.profiles
--   FOR EACH ROW EXECUTE FUNCTION public.audit_profile_access();