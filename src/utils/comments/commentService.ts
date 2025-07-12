import { supabase, createAuthenticatedSupabaseClient } from "@/integrations/supabase/client";
import { Comment } from "@/types/core";

export interface PostComment {
  id: string;
  post_id: string;
  post_type: 'post' | 'feed_post';
  user_id: string;
  content: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
  users?: {
    username: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
}

export const commentService = {
  // Fetch comments for a post
  async getComments(postId: string, postType: 'post' | 'feed_post'): Promise<PostComment[]> {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          users(username, avatar_url, first_name, last_name)
        `)
        .eq('post_id', postId)
        .eq('post_type', postType)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return (data || []) as PostComment[];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  // Create a new comment
  async createComment(
    postId: string, 
    postType: 'post' | 'feed_post',
    content: string,
    userId: string,
    token: string,
    parentCommentId?: string
  ): Promise<PostComment | null> {
    try {
      const authenticatedSupabase = createAuthenticatedSupabaseClient(token);
      
      const { data, error } = await authenticatedSupabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          post_type: postType,
          user_id: userId,
          content: content,
          parent_comment_id: parentCommentId
        }])
        .select(`
          *,
          users(username, avatar_url, first_name, last_name)
        `)
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        return null;
      }

      return data as PostComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  },

  // Update a comment
  async updateComment(
    commentId: string,
    content: string,
    token: string
  ): Promise<PostComment | null> {
    try {
      const authenticatedSupabase = createAuthenticatedSupabaseClient(token);
      
      const { data, error } = await authenticatedSupabase
        .from('post_comments')
        .update({ content })
        .eq('id', commentId)
        .select(`
          *,
          users(username, avatar_url, first_name, last_name)
        `)
        .single();

      if (error) {
        console.error('Error updating comment:', error);
        return null;
      }

      return data as PostComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      return null;
    }
  },

  // Delete a comment
  async deleteComment(commentId: string, token: string): Promise<boolean> {
    try {
      const authenticatedSupabase = createAuthenticatedSupabaseClient(token);
      
      const { error } = await authenticatedSupabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }
};