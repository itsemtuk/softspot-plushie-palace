
import { ExtendedPost } from "@/types/core";
import { supabase } from "@/integrations/supabase/client";

export const addPost = async (postData: ExtendedPost): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select();

    if (error) {
      console.error("Supabase add post error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (err) {
    console.error("Unexpected error adding post:", err);
    return { success: false, error: "Failed to add post" };
  }
};

export const updatePost = async (postId: string, postData: Partial<ExtendedPost>): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', postId)
      .select();

    if (error) {
      console.error("Supabase update post error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (err) {
    console.error("Unexpected error updating post:", err);
    return { success: false, error: "Failed to update post" };
  }
};

export const deletePost = async (postId: string, userId?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate postId
    if (!postId) {
      console.error("Invalid postId provided for deletion.");
      return { success: false, error: "Invalid post ID" };
    }

    // Construct the delete query
    let query = supabase.from('posts').delete().eq('id', postId);

    // If userId is provided, further restrict deletion to posts owned by the user
    if (userId) {
      query = query.eq('userId', userId);
    }

    const { error } = await query;

    if (error) {
      console.error("Supabase delete post error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting post:", err);
    return { success: false, error: "Failed to delete post" };
  }
};
