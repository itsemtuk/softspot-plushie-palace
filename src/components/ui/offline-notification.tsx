
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { useSyncManager } from '@/hooks/useSyncManager';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WifiOff, CloudOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OfflineNotification = () => {
  const { isOnline, supabaseConnected } = useConnectionStatus();
  const { syncStatus, syncPendingOperations } = useSyncManager();

  // Don't show when everything is working
  if (isOnline && supabaseConnected && !syncStatus.hasUnsyncedChanges) {
    return null;
  }

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (!supabaseConnected) return 'warning';
    if (syncStatus.hasUnsyncedChanges) return 'default';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (!supabaseConnected) return <CloudOff className="h-4 w-4" />;
    if (syncStatus.hasUnsyncedChanges) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusMessage = () => {
    if (!isOnline) {
      return "You're offline. Changes will be saved locally.";
    }
    if (!supabaseConnected) {
      return "Database connection issues. Using local storage.";
    }
    if (syncStatus.hasUnsyncedChanges) {
      return `${syncStatus.pendingSyncs.length} changes waiting to sync.`;
    }
    return "Connected and synced.";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert variant={getStatusColor()} className="shadow-lg border-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <AlertDescription className="text-sm">
              {getStatusMessage()}
            </AlertDescription>
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            {syncStatus.hasUnsyncedChanges && (
              <Badge variant="outline" className="text-xs">
                {syncStatus.pendingSyncs.length}
              </Badge>
            )}
            
            {syncStatus.hasUnsyncedChanges && isOnline && supabaseConnected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={syncPendingOperations}
                disabled={syncStatus.isSyncing}
                className="p-1 h-6 w-6"
              >
                <RefreshCw className={cn(
                  "h-3 w-3",
                  syncStatus.isSyncing && "animate-spin"
                )} />
              </Button>
            )}
          </div>
        </div>
        
        {syncStatus.isSyncing && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">Syncing changes...</div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div className="bg-softspot-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </Alert>
    </div>
  );
};
