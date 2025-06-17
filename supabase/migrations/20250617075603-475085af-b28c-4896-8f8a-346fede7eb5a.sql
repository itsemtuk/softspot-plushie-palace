
-- Create a safe user creation function that bypasses RLS
CREATE OR REPLACE FUNCTION public.create_user_safe(user_data jsonb)
RETURNS TABLE(id uuid, clerk_id text, username text, first_name text, last_name text, email text, avatar_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.users (clerk_id, username, first_name, last_name, email, avatar_url)
  VALUES (
    user_data->>'clerk_id',
    user_data->>'username', 
    user_data->>'first_name',
    user_data->>'last_name',
    user_data->>'email',
    user_data->>'avatar_url'
  )
  RETURNING users.id, users.clerk_id, users.username, users.first_name, users.last_name, users.email, users.avatar_url;
END;
$$;
