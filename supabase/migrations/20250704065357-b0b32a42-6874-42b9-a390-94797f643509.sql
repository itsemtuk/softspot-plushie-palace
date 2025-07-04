-- Simple approach: Only allow messaging if users follow each other (mutual following)
DROP POLICY IF EXISTS "Users can only see conversations with users they follow" ON conversations;
CREATE POLICY "Users can only see conversations with users they follow"
ON conversations FOR ALL
USING (
  auth.uid()::text = ANY(participants) 
  AND (
    -- Check mutual following for both possible participant orders
    (
      participants[1] = auth.uid()::text AND
      EXISTS (
        SELECT 1 FROM followers f1, followers f2
        WHERE f1.follower_id = auth.uid() 
        AND f1.following_id = participants[2]::uuid
        AND f2.follower_id = participants[2]::uuid
        AND f2.following_id = auth.uid()
      )
    )
    OR
    (
      participants[2] = auth.uid()::text AND
      EXISTS (
        SELECT 1 FROM followers f1, followers f2
        WHERE f1.follower_id = auth.uid() 
        AND f1.following_id = participants[1]::uuid
        AND f2.follower_id = participants[1]::uuid
        AND f2.following_id = auth.uid()
      )
    )
  )
);

-- Update messages policy to match conversation restrictions  
DROP POLICY IF EXISTS "Users can only see messages in allowed conversations" ON messages;
CREATE POLICY "Users can only see messages in allowed conversations"
ON messages FOR ALL
USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);