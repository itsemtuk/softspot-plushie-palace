
-- First, let's check and fix the profiles table structure
-- Remove the problematic foreign key constraint that's causing issues
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_uuid_fkey;

-- Add a proper foreign key constraint that references the users table
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_uuid_fkey 
FOREIGN KEY (user_uuid) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update the create_user_safe function to be more robust
CREATE OR REPLACE FUNCTION public.create_user_safe(user_data jsonb)
RETURNS TABLE(id uuid, clerk_id text, username text, first_name text, last_name text, email text, avatar_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- First try to find existing user
  RETURN QUERY
  SELECT u.id, u.clerk_id, u.username, u.first_name, u.last_name, u.email, u.avatar_url
  FROM public.users u
  WHERE u.clerk_id = user_data->>'clerk_id';
  
  -- If user found, return early
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- If not found, create new user
  RETURN QUERY
  INSERT INTO public.users (clerk_id, username, first_name, last_name, email, avatar_url)
  VALUES (
    user_data->>'clerk_id',
    COALESCE(user_data->>'username', user_data->>'first_name', 'User'),
    user_data->>'first_name',
    user_data->>'last_name',
    user_data->>'email',
    user_data->>'avatar_url'
  )
  ON CONFLICT (clerk_id) DO UPDATE SET
    username = COALESCE(EXCLUDED.username, users.username),
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    email = COALESCE(EXCLUDED.email, users.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = now()
  RETURNING users.id, users.clerk_id, users.username, users.first_name, users.last_name, users.email, users.avatar_url;
END;
$function$;

-- Add unique constraint on clerk_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_clerk_id_key') THEN
        ALTER TABLE public.users ADD CONSTRAINT users_clerk_id_key UNIQUE (clerk_id);
    END IF;
END
$$;

-- Enable RLS on followers table and create policies
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view follows" ON public.followers;
DROP POLICY IF EXISTS "Users can create follows" ON public.followers;
DROP POLICY IF EXISTS "Users can delete their follows" ON public.followers;

-- Create policies for followers table
CREATE POLICY "Users can view follows" ON public.followers
  FOR SELECT USING (true); -- Allow viewing all follows for social features

CREATE POLICY "Users can create follows" ON public.followers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub' AND id = follower_id)
  );

CREATE POLICY "Users can delete their follows" ON public.followers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub' AND id = follower_id)
  );

-- Update profiles table RLS policies to work with clerk authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Create new policies that work with Clerk auth
CREATE POLICY "Users can view profiles" ON public.profiles
  FOR SELECT USING (true); -- Allow viewing all profiles for social features

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    user_uuid IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (
    user_uuid IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
  );

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (
    user_uuid IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub')
  );
