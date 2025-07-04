-- Create RLS policy for conversations to only allow messaging following users
DROP POLICY IF EXISTS "Users can only see conversations with users they follow" ON conversations;
CREATE POLICY "Users can only see conversations with users they follow"
ON conversations FOR ALL
USING (
  auth.uid()::text = ANY(participants) 
  AND (
    -- Allow if the other participant is someone you follow
    EXISTS (
      SELECT 1 FROM followers f 
      WHERE f.follower_id = auth.uid() 
      AND f.following_id = CASE 
        WHEN participants[1] = auth.uid()::text THEN participants[2]::uuid
        ELSE participants[1]::uuid
      END
    )
    OR
    -- Allow if the other participant follows you (mutual following)
    EXISTS (
      SELECT 1 FROM followers f 
      WHERE f.following_id = auth.uid() 
      AND f.follower_id = CASE 
        WHEN participants[1] = auth.uid()::text THEN participants[2]::uuid
        ELSE participants[1]::uuid
      END
    )
  )
);

-- Update messages policy to match conversation restrictions  
DROP POLICY IF EXISTS "Users can only see messages in allowed conversations" ON messages;
CREATE POLICY "Users can only see messages in allowed conversations"
ON messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = conversation_id 
    AND auth.uid()::text = ANY(c.participants)
    AND (
      -- Allow if the other participant is someone you follow
      EXISTS (
        SELECT 1 FROM followers f 
        WHERE f.follower_id = auth.uid() 
        AND f.following_id = CASE 
          WHEN c.participants[1] = auth.uid()::text THEN c.participants[2]::uuid
          ELSE c.participants[1]::uuid
        END
      )
      OR
      -- Allow if the other participant follows you (mutual following)
      EXISTS (
        SELECT 1 FROM followers f 
        WHERE f.following_id = auth.uid() 
        AND f.follower_id = CASE 
          WHEN c.participants[1] = auth.uid()::text THEN c.participants[2]::uuid
          ELSE c.participants[1]::uuid
        END
      )
    )
  )
);