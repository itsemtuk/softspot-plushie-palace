
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

export const ConnectionStatusIndicator = () => {
  const { isOnline, supabaseConnected } = useConnectionStatus();

  if (isOnline && supabaseConnected) {
    return null; // Don't show anything when everything is working
  }

  return (
    <Alert variant={!isOnline ? "destructive" : "warning"} className="mb-4">
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <WifiOff className="h-4 w-4" />
        ) : !supabaseConnected ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <AlertDescription>
          {!isOnline 
            ? "You're offline. Changes will be saved locally." 
            : !supabaseConnected 
            ? "Database connection issues. Using local storage." 
            : "Connected"
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};
