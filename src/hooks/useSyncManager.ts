import { useState, useEffect, useCallback } from 'react';
import { ExtendedPost } from '@/types/marketplace';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { getLocalPosts, savePosts, getCurrentUserId } from '@/utils/storage/localStorageUtils';
import { supabase, isSupabaseConfigured } from '@/utils/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PendingSync {
  id: string;
  type: 'create' | 'update' | 'delete';
  data?: ExtendedPost;
  timestamp: string;
  retryCount: number;
}

interface SyncStatus {
  isSupabaseConfigured: boolean;
  pendingSyncs: PendingSync[];
  isSyncing: boolean;
  lastSyncAttempt: Date | null;
  hasUnsyncedChanges: boolean;
}

export const useSyncManager = () => {
  const { isOnline, supabaseConnected } = useConnectionStatus();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSupabaseConfigured: isSupabaseConfigured(),
    pendingSyncs: [],
    isSyncing: false,
    lastSyncAttempt: null,
    hasUnsyncedChanges: false
  });

  // Load pending syncs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pendingSyncs');
    if (stored) {
      try {
        const pendingSyncs = JSON.parse(stored);
        setSyncStatus(prev => ({ 
          ...prev, 
          pendingSyncs,
          hasUnsyncedChanges: pendingSyncs.length > 0 
        }));
      } catch (error) {
        console.error('Error loading pending syncs:', error);
      }
    }
  }, []);

  // Save pending syncs to localStorage
  const savePendingSyncs = useCallback((syncs: PendingSync[]) => {
    localStorage.setItem('pendingSyncs', JSON.stringify(syncs));
    setSyncStatus(prev => ({ 
      ...prev, 
      pendingSyncs: syncs,
      hasUnsyncedChanges: syncs.length > 0 
    }));
  }, []);

  // Add a pending sync operation
  const addPendingSync = useCallback((operation: Omit<PendingSync, 'timestamp' | 'retryCount'>) => {
    const newSync: PendingSync = {
      ...operation,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    
    setSyncStatus(prev => {
      const updated = [...prev.pendingSyncs, newSync];
      savePendingSyncs(updated);
      return { ...prev, pendingSyncs: updated, hasUnsyncedChanges: true };
    });
  }, [savePendingSyncs]);

  // Sync all pending operations
  const syncPendingOperations = useCallback(async () => {
    if (!isOnline || !supabaseConnected || syncStatus.pendingSyncs.length === 0) {
      return;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, lastSyncAttempt: new Date() }));

    const successful: string[] = [];
    const failed: PendingSync[] = [];

    for (const sync of syncStatus.pendingSyncs) {
      try {
        switch (sync.type) {
          case 'create':
          case 'update':
            if (sync.data) {
              const { error } = await supabase!
                .from('posts')
                .upsert(sync.data, { onConflict: 'id' });
              
              if (error) throw error;
              successful.push(sync.id);
            }
            break;
          case 'delete':
            const { error } = await supabase!
              .from('posts')
              .delete()
              .eq('id', sync.id);
            
            if (error) throw error;
            successful.push(sync.id);
            break;
        }
      } catch (error) {
        console.error(`Sync failed for ${sync.id}:`, error);
        failed.push({
          ...sync,
          retryCount: sync.retryCount + 1
        });
      }
    }

    // Update pending syncs (remove successful, keep failed with updated retry count)
    const remainingPending = failed.filter(sync => sync.retryCount < 3); // Max 3 retries
    savePendingSyncs(remainingPending);

    setSyncStatus(prev => ({ 
      ...prev, 
      isSyncing: false,
      hasUnsyncedChanges: remainingPending.length > 0
    }));

    // Show sync results
    if (successful.length > 0) {
      toast({
        title: "Sync Complete",
        description: `${successful.length} changes synced successfully.`
      });
    }

    if (failed.length > 0) {
      const permanentFailures = failed.filter(sync => sync.retryCount >= 3);
      if (permanentFailures.length > 0) {
        toast({
          title: "Sync Issues",
          description: `${permanentFailures.length} changes failed to sync after multiple attempts.`,
          variant: "destructive"
        });
      }
    }
  }, [isOnline, supabaseConnected, syncStatus.pendingSyncs, savePendingSyncs]);

  // Auto-sync when connection is restored
  useEffect(() => {
    if (isOnline && supabaseConnected && syncStatus.hasUnsyncedChanges && !syncStatus.isSyncing) {
      syncPendingOperations();
    }
  }, [isOnline, supabaseConnected, syncStatus.hasUnsyncedChanges, syncStatus.isSyncing, syncPendingOperations]);

  // Clear all pending syncs (for testing or manual reset)
  const clearPendingSyncs = useCallback(() => {
    localStorage.removeItem('pendingSyncs');
    setSyncStatus(prev => ({ ...prev, pendingSyncs: [], hasUnsyncedChanges: false }));
  }, []);

  return {
    syncStatus,
    addPendingSync,
    syncPendingOperations,
    clearPendingSyncs
  };
};
