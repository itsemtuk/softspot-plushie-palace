-- Create a proper comments table for feed posts and regular posts
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL,
  post_type text NOT NULL DEFAULT 'post' CHECK (post_type IN ('post', 'feed_post')),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view comments" 
ON public.post_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.post_comments 
FOR INSERT 
WITH CHECK ((auth.uid() IS NOT NULL) AND (user_id IN ( SELECT users.id FROM users WHERE (users.clerk_id = (auth.jwt() ->> 'sub'::text)))));

CREATE POLICY "Users can update their own comments" 
ON public.post_comments 
FOR UPDATE 
USING (user_id IN ( SELECT users.id FROM users WHERE (users.clerk_id = (auth.jwt() ->> 'sub'::text))));

CREATE POLICY "Users can delete their own comments" 
ON public.post_comments 
FOR DELETE 
USING (user_id IN ( SELECT users.id FROM users WHERE (users.clerk_id = (auth.jwt() ->> 'sub'::text))));

-- Create trigger for updated_at
CREATE TRIGGER update_post_comments_updated_at
BEFORE UPDATE ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_post_comments_post_id_type ON public.post_comments(post_id, post_type);
CREATE INDEX idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX idx_post_comments_created_at ON public.post_comments(created_at DESC);