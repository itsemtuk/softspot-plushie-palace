
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { testSupabaseConnection } from '@/utils/supabase/client';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setShowStatus(!online);
    };

    const checkSupabaseConnection = async () => {
      if (isOnline) {
        const connected = await testSupabaseConnection(3000);
        setSupabaseConnected(connected);
        setShowStatus(!connected);
      }
    };

    // Initial checks
    updateNetworkStatus();
    checkSupabaseConnection();

    // Set up event listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Check Supabase connection periodically
    const interval = setInterval(checkSupabaseConnection, 30000);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      clearInterval(interval);
    };
  }, [isOnline]);

  if (!showStatus) {
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
    
    if (!supabaseConnected) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        message: "Database connection issues. Using local storage - changes will sync when connection is restored.",
        variant: "warning" as const
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
