
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedContent } from "@/components/feed/FeedContent";
import { useCreatePost } from "@/hooks/use-create-post";
import { PostCreationData, ExtendedPost } from "@/types/core";
import { supabase, createAuthenticatedSupabaseClient } from "@/utils/supabase/client";
import { ImageFirstPostCreation } from "@/components/post/ImageFirstPostCreation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";
import { toast } from "@/hooks/use-toast";
import { PostDialog } from "@/components/PostDialog";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { validateAndSanitizeFormData, ValidationSchemas, postCreationLimiter } from "@/utils/security/inputValidation";
import { useCSRFProtection } from "@/utils/security/csrfProtection";
import { z } from "zod";

export default function Feed() {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isPostCreationOpen, setIsPostCreationOpen } = useCreatePost();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { supabaseUserId } = useClerkSupabaseUser(user);
  const { dialogState, openPostDialog, closePostDialog } = usePostDialog();

  const fetchAndSetPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch only from feed_posts table for the main feed
      const { data: feedPosts, error } = await supabase
        .from('feed_posts')
        .select(`
          *,
          users!feed_posts_user_id_fkey(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching feed posts:", error);
        setPosts([]);
        return;
      }

      const formattedPosts: ExtendedPost[] = (feedPosts || []).map(post => ({
        id: post.id as string,
        userId: post.user_id as string,
        user_id: post.user_id as string,
        username: (post.users as any)?.username || 'User',
        image: (post.image as string) || '',
        title: (post.title as string) || '',
        description: (post.description as string) || '',
        content: (post.content as string) || '',
        tags: [],
        likes: 0,
        comments: 0,
        timestamp: (post.created_at as string) || '',
        createdAt: (post.created_at as string) || '',
        created_at: (post.created_at as string) || '',
        updatedAt: (post.updated_at as string) || (post.created_at as string) || '',
        location: '',
        forSale: false
      }));

      console.log("Feed posts loaded:", formattedPosts.length);
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetPosts();
  }, [fetchAndSetPosts]);

  // Memoize filtered posts to prevent unnecessary re-renders
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.content?.toLowerCase().includes(query) ||
      post.title?.toLowerCase().includes(query) ||
      post.username?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const { generateCSRFToken, consumeCSRFToken } = useCSRFProtection();

  const handleCreatePost = useCallback(async (postData: PostCreationData) => {
    if (!user || !supabaseUserId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create posts."
      });
      return;
    }

    // Rate limiting check
    if (!postCreationLimiter.isAllowed(user.id)) {
      toast({
        variant: "destructive",
        title: "Rate limit exceeded",
        description: "Please wait before creating another post."
      });
      return;
    }

    // Input validation and sanitization
    const validationSchema = z.object({
      title: ValidationSchemas.postTitle.optional(),
      content: ValidationSchemas.postContent,
      description: ValidationSchemas.bio.optional(),
      image: ValidationSchemas.imageUrl.optional()
    });

    const validationResult = validateAndSanitizeFormData(postData, validationSchema);
    if (!validationResult.success) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: (validationResult as { success: false; errors: string[] }).errors.join(', ')
      });
      return;
    }

    const sanitizedData = validationResult.data;

    try {
      console.log("Creating new feed post:", sanitizedData);
      console.log("User:", user);
      
      // Get Clerk token for authenticated Supabase client
      const token = await getToken({ template: "supabase" });
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Could not get authentication token."
        });
        return;
      }
      
      // Create authenticated Supabase client
      const authenticatedSupabase = createAuthenticatedSupabaseClient(token);
      
      // Look up the user in Supabase using Clerk ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .eq('clerk_id', user.id)
        .single();

      if (userError || !userData) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "Please try refreshing the page."
        });
        return;
      }
      
      // Upload image to storage if present
      let imageUrl = postData.image;
      if (postData.image && postData.image.startsWith('data:')) {
        const { uploadImage } = await import('@/utils/storage/imageStorage');
        const { imageUrl: uploadedUrl } = await uploadImage(postData.image, `feed-${Date.now()}`);
        imageUrl = uploadedUrl;
      }

      // Insert into feed_posts table using authenticated Supabase client
      const { data, error } = await authenticatedSupabase
        .from('feed_posts')
        .insert([{
          user_id: userData.id,
          title: postData.title,
          content: postData.content,
          description: postData.description,
          image: imageUrl
        }])
        .select()
        .single();

      if (error) {
        console.error("Failed to add feed post:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create post. Please try again."
        });
        return;
      }

      console.log("Feed post created successfully:", data);

      // Add to local state
      const newPost: ExtendedPost = {
        id: data.id as string,
        userId: userData.id as string,
        user_id: userData.id as string,
        username: (userData.username as string) || user.username || user.firstName || "User",
        image: imageUrl || '',
        title: data.title || '',
        description: data.description || '',
        content: data.content,
        tags: [],
        likes: 0,
        comments: 0,
        timestamp: data.created_at,
        createdAt: data.created_at,
        created_at: data.created_at,
        updatedAt: data.updated_at || data.created_at,
        location: '',
        forSale: false
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsPostCreationOpen(false);
      toast({
        title: "Post created!",
        description: "Your post has been added to the feed."
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while creating your post."
      });
    }
  }, [user, supabaseUserId, setIsPostCreationOpen]);

  const handleCreatePostClick = useCallback(() => {
    console.log("Create post clicked");
    setIsPostCreationOpen(true);
  }, [setIsPostCreationOpen]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchAndSetPosts();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchAndSetPosts]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <FeedHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreatePost={handleCreatePostClick}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        
        <FeedContent
          initialPosts={filteredPosts}
          isLoading={isLoading}
          isError={false}
          isOnline={true}
          onRefresh={handleRefresh}
          onPostClick={openPostDialog}
        />
      </div>

      {/* Image First Post Creation */}
      <ImageFirstPostCreation
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />

      {/* Post Dialog */}
      <PostDialog
        post={dialogState.post}
        isOpen={dialogState.isOpen}
        onClose={closePostDialog}
      />
    </MainLayout>
  );
}
