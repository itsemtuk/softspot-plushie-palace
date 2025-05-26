
import { useState, useEffect } from 'react';
import { testSupabaseConnection } from '@/utils/supabase/client';

export interface ConnectionStatus {
  isOnline: boolean;
  supabaseConnected: boolean;
  lastChecked: Date;
}

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    supabaseConnected: false,
    lastChecked: new Date()
  });

  useEffect(() => {
    const checkConnections = async () => {
      const supabaseStatus = await testSupabaseConnection();
      setStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        supabaseConnected: supabaseStatus,
        lastChecked: new Date()
      }));
    };

    // Initial check
    checkConnections();

    // Set up periodic checks every 30 seconds
    const interval = setInterval(checkConnections, 30000);

    // Listen for online/offline events
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      checkConnections();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false, supabaseConnected: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
};
