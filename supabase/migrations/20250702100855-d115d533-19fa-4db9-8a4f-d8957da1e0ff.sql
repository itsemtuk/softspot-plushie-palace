-- Add profile customization fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS header_background_color text DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS header_gradient_start text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS header_gradient_end text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS header_background_image text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS header_text_color text DEFAULT '#000000';