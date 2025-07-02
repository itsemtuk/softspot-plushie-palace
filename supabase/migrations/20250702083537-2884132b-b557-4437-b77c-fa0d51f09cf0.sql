-- Security Review: Tighten RLS policies for better access control (Fixed)

-- 1. Make user_id columns NOT NULL where they should be (if not already)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.posts ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace' AND column_name = 'user_id' AND is_nullable = 'YES') THEN
    ALTER TABLE public.marketplace ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- 2. Drop existing overly broad policies on posts table
DROP POLICY IF EXISTS "Allow authenticated post deletes" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated post inserts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated post reads" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated post updates" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Public read access" ON public.posts;
DROP POLICY IF EXISTS "User manage posts" ON public.posts;

-- 3. Create more restrictive policies for posts (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can create their own posts - secure') THEN
    CREATE POLICY "Users can create their own posts - secure" ON public.posts
      FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
      );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can update their own posts - secure') THEN
    CREATE POLICY "Users can update their own posts - secure" ON public.posts
      FOR UPDATE USING (
        user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
      );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Users can delete their own posts - secure') THEN
    CREATE POLICY "Users can delete their own posts - secure" ON public.posts
      FOR DELETE USING (
        user_id IN (SELECT id FROM public.users WHERE clerk_id = (auth.jwt() ->> 'sub'))
      );
  END IF;
END $$;

-- 4. Add constraints for security (with conflict handling)
DO $$
BEGIN
  -- Content length constraints
  BEGIN
    ALTER TABLE public.posts ADD CONSTRAINT posts_content_length CHECK (length(content) <= 2000);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.posts ADD CONSTRAINT posts_title_length CHECK (length(title) <= 200);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.posts ADD CONSTRAINT posts_description_length CHECK (length(description) <= 1000);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  -- Price validation constraints
  BEGIN
    ALTER TABLE public.posts ADD CONSTRAINT posts_price_positive CHECK (price IS NULL OR price >= 0);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.posts ADD CONSTRAINT posts_price_reasonable CHECK (price IS NULL OR price <= 50000);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.marketplace ADD CONSTRAINT marketplace_price_positive CHECK (price >= 0);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.marketplace ADD CONSTRAINT marketplace_price_reasonable CHECK (price <= 50000);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  -- Username validation
  BEGIN
    ALTER TABLE public.users ADD CONSTRAINT users_username_length CHECK (length(username) <= 30);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.users ADD CONSTRAINT users_username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  -- Bio length constraint
  BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_bio_length CHECK (length(bio) <= 500);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;