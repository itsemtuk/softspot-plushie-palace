-- Fix marketplace_listings RLS policies to work properly with Clerk authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Everyone can view active listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON marketplace_listings;

-- Create new policies that properly handle Clerk authentication
CREATE POLICY "Authenticated users can create listings" 
ON marketplace_listings 
FOR INSERT 
WITH CHECK (
  -- User must be authenticated via Clerk
  (auth.jwt() ->> 'sub') IS NOT NULL 
  AND 
  -- The user_id in the listing must match their Supabase user record
  user_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Everyone can view active listings" 
ON marketplace_listings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can update their own listings" 
ON marketplace_listings 
FOR UPDATE 
USING (
  user_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  user_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can delete their own listings" 
ON marketplace_listings 
FOR DELETE 
USING (
  user_id IN (
    SELECT users.id 
    FROM users 
    WHERE users.clerk_id = (auth.jwt() ->> 'sub')
  )
);