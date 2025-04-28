
import { supabase, isSupabaseConfigured } from '../supabase/client';

/**
 * Uploads an image to Supabase Storage and returns the public URL
 */
export const uploadImage = async (dataUrl: string, imageId: string): Promise<{ imageUrl: string, error?: any }> => {
  if (!isSupabaseConfigured()) {
    // If Supabase is not configured, just return the original data URL
    return { imageUrl: dataUrl };
  }

  try {
    // Convert data URL to Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    // Generate a unique file path
    const filePath = `posts/${imageId}/image.jpg`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase!
      .storage
      .from('images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase!
      .storage
      .from('images')
      .getPublicUrl(filePath);
      
    return { imageUrl: data.publicUrl };
  } catch (error) {
    console.error('Error uploading image to Supabase Storage:', error);
    return { imageUrl: dataUrl, error };
  }
};

/**
 * Deletes an image from Supabase Storage
 */
export const deleteImage = async (imageId: string): Promise<{ success: boolean, error?: any }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }; // Nothing to delete if not using Supabase
  }

  try {
    const filePath = `posts/${imageId}/image.jpg`;
    
    const { error } = await supabase!
      .storage
      .from('images')
      .remove([filePath]);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting image from Supabase Storage:', error);
    return { success: false, error };
  }
};
