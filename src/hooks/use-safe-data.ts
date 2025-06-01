
import { useState, useEffect, useCallback } from 'react';

interface UseSafeDataOptions<T> {
  fallbackValue: T;
  retryCount?: number;
  retryDelay?: number;
}

interface UseSafeDataResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  retry: () => void;
  isRetrying: boolean;
}

export function useSafeData<T>(
  fetchFn: () => Promise<T>,
  options: UseSafeDataOptions<T>
): UseSafeDataResult<T> {
  const { fallbackValue, retryCount = 3, retryDelay = 1000 } = options;
  
  const [data, setData] = useState<T>(fallbackValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentRetry, setCurrentRetry] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      setData(result || fallbackValue);
      setCurrentRetry(0);
    } catch (err) {
      console.error('useSafeData fetch error:', err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (currentRetry < retryCount) {
        setCurrentRetry(prev => prev + 1);
        setTimeout(() => fetchData(true), retryDelay);
      } else {
        setData(fallbackValue);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [fetchFn, fallbackValue, retryCount, retryDelay, currentRetry]);

  const retry = useCallback(() => {
    setCurrentRetry(0);
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    retry,
    isRetrying
  };
}
