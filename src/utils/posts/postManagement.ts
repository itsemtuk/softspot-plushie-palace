
import { ExtendedPost } from "@/types/core";
import { supabase } from "@/integrations/supabase/client";
import { createAuthenticatedSupabaseClient } from "@/integrations/supabase/client";

export const addPost = async (postData: ExtendedPost, token?: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const client = token ? createAuthenticatedSupabaseClient(token) : supabase;
    const { data, error } = await client
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

export const updatePost = async (postId: string, postData: Partial<ExtendedPost>, token?: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const client = token ? createAuthenticatedSupabaseClient(token) : supabase;
    const { data, error } = await client
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

export const archivePost = async (postId: string, userId?: string, token?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!postId) {
      console.error("Invalid postId provided for archiving.");
      return { success: false, error: "Invalid post ID" };
    }
    const client = token ? createAuthenticatedSupabaseClient(token) : supabase;
    // Only allow archiving by owner
    let query = client.from('posts').update({ archived: true }).eq('id', postId);
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { error } = await query;
    if (error) {
      console.error("Supabase archive post error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Unexpected error archiving post:", err);
    return { success: false, error: "Failed to archive post" };
  }
};

export const deletePost = async (postId: string, userId?: string, token?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate postId
    if (!postId) {
      console.error("Invalid postId provided for deletion.");
      return { success: false, error: "Invalid post ID" };
    }

    const client = token ? createAuthenticatedSupabaseClient(token) : supabase;
    
    // Construct the delete query
    let query = client.from('posts').delete().eq('id', postId);

    // If userId is provided, further restrict deletion to posts owned by the user
    if (userId) {
      query = query.eq('user_id', userId);
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

// Add savePost as an alias to addPost for compatibility
export const savePost = addPost;
