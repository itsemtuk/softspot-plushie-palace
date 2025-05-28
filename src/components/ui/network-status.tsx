
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { testSupabaseConnection } from '@/utils/supabase/client';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (!online) {
        setShowStatus(true);
      }
    };

    const checkSupabaseConnection = async () => {
      if (isOnline && !hasCheckedConnection) {
        const connected = await testSupabaseConnection(2000);
        setSupabaseConnected(connected);
        setHasCheckedConnection(true);
        
        // Only show status if we're online but Supabase connection failed
        if (!connected) {
          setShowStatus(false); // Hide the banner since we have good fallback
        }
      }
    };

    // Initial checks
    updateNetworkStatus();
    checkSupabaseConnection();

    // Set up event listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Check Supabase connection less frequently to reduce CORS errors
    const interval = setInterval(() => {
      if (isOnline) {
        checkSupabaseConnection();
      }
    }, 60000); // Check every minute instead of 30 seconds

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      clearInterval(interval);
    };
  }, [isOnline, hasCheckedConnection]);

  // Don't show status if everything is working or if we're in fallback mode with good UX
  if (!showStatus || (isOnline && hasCheckedConnection && !supabaseConnected)) {
    return null;
  }

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-4 w-4" />,
        message: "You're offline. Changes are saved locally and will sync when you reconnect.",
        variant: "destructive" as const
      };
    }
    
    if (!supabaseConnected && hasCheckedConnection) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        message: "Using local storage - your data is safe and will sync when connection is restored.",
        variant: "default" as const
      };
    }

    return {
      icon: <Wifi className="h-4 w-4" />,
      message: "Connected and syncing",
      variant: "default" as const
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Alert variant={statusInfo.variant} className="mb-4" role="alert">
      <div className="flex items-center gap-2">
        {statusInfo.icon}
        <AlertDescription className="font-medium">
          {statusInfo.message}
        </AlertDescription>
      </div>
    </Alert>
  );
};
