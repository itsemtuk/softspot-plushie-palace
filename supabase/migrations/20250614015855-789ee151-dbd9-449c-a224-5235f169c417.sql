
-- Add missing columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS address_line_1 text,
ADD COLUMN IF NOT EXISTS address_line_2 text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state_province text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS country text DEFAULT 'us',
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS twitter text,
ADD COLUMN IF NOT EXISTS youtube text,
ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hide_from_search boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_activity_status boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_collection boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_wishlist boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS receive_email_updates boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS receive_marketing_emails boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS receive_wishlist_alerts boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS new_release_alerts boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS favorite_brands text[],
ADD COLUMN IF NOT EXISTS favorite_types text[],
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Enable RLS if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Create new policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (user_uuid = auth.uid() OR user_id::text IN (SELECT id::text FROM public.users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (user_uuid = auth.uid() OR user_id::text IN (SELECT id::text FROM public.users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (user_uuid = auth.uid() OR user_id::text IN (SELECT id::text FROM public.users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "Users can delete their own profile" 
  ON public.profiles 
  FOR DELETE 
  USING (user_uuid = auth.uid() OR user_id::text IN (SELECT id::text FROM public.users WHERE clerk_id = auth.uid()::text));

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_uuid ON public.profiles(user_uuid);
