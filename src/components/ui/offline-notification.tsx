
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

interface OfflineNotificationProps {
  syncManager: {
    isOnline: boolean;
    isSyncing: boolean;
    syncStatus?: string;
    syncPendingOperations?: () => void;
  };
}

export const OfflineNotification = ({ syncManager }: OfflineNotificationProps) => {
  const { isOnline, isSyncing, syncStatus, syncPendingOperations } = syncManager;

  if (isOnline) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-center justify-between">
          <span>
            <strong>You're offline.</strong> Changes will be saved locally and synced when you reconnect.
          </span>
          {syncPendingOperations && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncPendingOperations()}
              disabled={isSyncing}
              className="ml-4"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Syncing...
                </>
              ) : (
                'Retry Sync'
              )}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
