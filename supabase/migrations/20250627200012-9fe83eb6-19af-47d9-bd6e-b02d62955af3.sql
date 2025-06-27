
-- First, let's properly separate feed posts from marketplace posts
-- Create a dedicated feed_posts table if it doesn't have all the needed columns
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users(id);
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS title text;

-- Ensure posts table is optimized for marketplace with bidding system
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS accepts_offers boolean DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS min_offer_amount numeric;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS offer_deadline timestamp with time zone;

-- Create notifications table for follow notifications and offers
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  type text NOT NULL, -- 'follow', 'offer', 'like', 'comment'
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE clerk_id = auth.jwt() ->> 'sub'));

-- Create policy for inserting notifications (system can insert)
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create a function to notify users when they get a new follower
CREATE OR REPLACE FUNCTION public.notify_new_follower()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    NEW.following_id,
    'follow',
    'New Follower',
    (SELECT username FROM public.users WHERE id = NEW.follower_id) || ' started following you',
    jsonb_build_object('follower_id', NEW.follower_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new follower notifications
DROP TRIGGER IF EXISTS on_new_follower ON public.followers;
CREATE TRIGGER on_new_follower
  AFTER INSERT ON public.followers
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_follower();
