
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

export const ConnectionStatusIndicator = () => {
  const { isOnline, supabaseConnected } = useConnectionStatus();

  // Show different states based on connection status
  const getConnectionState = () => {
    if (!isOnline) {
      return {
        variant: "destructive" as const,
        icon: <WifiOff className="h-4 w-4" aria-hidden="true" />,
        message: "You're offline. Changes will be saved locally and synced when you reconnect.",
        show: true
      };
    }
    
    if (!supabaseConnected) {
      return {
        variant: "warning" as const,
        icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
        message: "Database connection issues detected. Using local storage - changes will sync when connection is restored.",
        show: true
      };
    }

    // Only show "connected" status briefly after reconnection
    return {
      variant: "default" as const,
      icon: <CheckCircle className="h-4 w-4" aria-hidden="true" />,
      message: "Connected and syncing",
      show: false // Don't show when everything is working
    };
  };

  const connectionState = getConnectionState();

  if (!connectionState.show) {
    return null;
  }

  const getAriaLabel = () => {
    if (!isOnline) return "Device is offline";
    if (!supabaseConnected) return "Database connection issues";
    return "Connection status";
  };

  return (
    <Alert 
      variant={connectionState.variant} 
      className="mb-4 border-l-4"
      role="alert"
      aria-label={getAriaLabel()}
    >
      <div className="flex items-center gap-2">
        {connectionState.icon}
        <AlertDescription className="font-medium">
          {connectionState.message}
        </AlertDescription>
      </div>
    </Alert>
  );
};
