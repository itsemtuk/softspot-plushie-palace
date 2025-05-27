
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, AlertTriangle } from 'lucide-react';

export const SimpleConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show status immediately if offline
    if (!navigator.onLine) {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus || isOnline) {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-4" role="alert">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Changes will be saved locally and synced when you reconnect.
      </AlertDescription>
    </Alert>
  );
};
