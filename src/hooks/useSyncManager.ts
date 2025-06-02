
import { useState, useEffect, useCallback } from "react";
import { useOfflinePostOperations } from "./useOfflinePostOperations";
import { useOnlineSync } from "./useOnlineSync";
import { ExtendedPost } from "@/types/core";

export const useSyncManager = (initialPosts: ExtendedPost[]) => {
  const [syncState, setSyncState] = useState({
    isOnline: navigator.onLine,
    posts: initialPosts,
    isSyncing: false,
    error: null as string | null
  });

  const { addOfflinePost, updateOfflinePost, deleteOfflinePost, getAllOfflinePosts } = useOfflinePostOperations();
  const { syncPosts } = useOnlineSync();

  // Update online status
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setSyncState(prevState => ({ ...prevState, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Initial sync on mount and when online
  useEffect(() => {
    const initialSync = async () => {
      if (syncState.isOnline) {
        setSyncState(prevState => ({ ...prevState, isSyncing: true, error: null }));
        try {
          const offlinePosts = await getAllOfflinePosts();
          const syncedPosts = await syncPosts(offlinePosts);
          setSyncState(prevState => ({ ...prevState, posts: syncedPosts }));
        } catch (error: any) {
          setSyncState(prevState => ({ ...prevState, error: error.message }));
        } finally {
          setSyncState(prevState => ({ ...prevState, isSyncing: false }));
        }
      }
    };

    initialSync();
  }, [syncState.isOnline, syncPosts, getAllOfflinePosts]);

  // Sync posts when posts change and online
  useEffect(() => {
    const syncOnChange = async () => {
      if (syncState.isOnline) {
        setSyncState(prevState => ({ ...prevState, isSyncing: true, error: null }));
        try {
          const offlinePosts = await getAllOfflinePosts();
          const syncedPosts = await syncPosts(offlinePosts);
          setSyncState(prevState => ({ ...prevState, posts: syncedPosts }));
        } catch (error: any) {
          setSyncState(prevState => ({ ...prevState, error: error.message }));
        } finally {
          setSyncState(prevState => ({ ...prevState, isSyncing: false }));
        }
      }
    };

    syncOnChange();
  }, [syncState.posts, syncState.isOnline, syncPosts, getAllOfflinePosts]);

  const handleAddPost = useCallback(async (post: ExtendedPost) => {
    try {
      addOfflinePost(post);
      setSyncState((prevState) => ({
        ...prevState,
        posts: [...prevState.posts, post]
      }));
    } catch (error) {
      setSyncState((prevState) => ({
        ...prevState,
        error: (error as Error).message
      }));
    }
  }, [addOfflinePost]);

  const handleUpdatePost = useCallback(async (post: ExtendedPost) => {
    try {
      updateOfflinePost(post);
      setSyncState((prevState) => ({
        ...prevState,
        posts: prevState.posts.map((p) => p.id === post.id ? post : p)
      }));
    } catch (error) {
      setSyncState((prevState) => ({
        ...prevState,
        error: (error as Error).message
      }));
    }
  }, [updateOfflinePost]);

  const handleDeletePost = useCallback(async (postId: string) => {
    try {
      deleteOfflinePost(postId);
      setSyncState((prevState) => ({
        ...prevState,
        posts: prevState.posts.filter((p) => p.id !== postId)
      }));
    } catch (error) {
      setSyncState((prevState) => ({
        ...prevState,
        error: (error as Error).message
      }));
    }
  }, [deleteOfflinePost]);

  const refreshPosts = useCallback(async () => {
    try {
      const offlinePosts = await getAllOfflinePosts();
      setSyncState((prevState) => ({
        ...prevState,
        posts: offlinePosts
      }));
    } catch (error) {
      setSyncState((prevState) => ({
        ...prevState,
        error: (error as Error).message
      }));
    }
  }, [getAllOfflinePosts]);

  const syncPendingOperations = useCallback(async () => {
    // Implementation for syncing pending operations
    console.log("Syncing pending operations...");
  }, []);

  return {
    ...syncState,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    refreshPosts,
    syncStatus: syncState.isSyncing ? 'syncing' : 'idle',
    syncPendingOperations
  };
};
