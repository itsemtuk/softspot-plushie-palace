import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
}

export function usePerformanceOptimization() {
  const renderStartTime = useRef<number>(Date.now());
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  // Throttle function to limit frequent calls
  const throttle = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Debounce function for search/input handling
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Measure component render performance
  const measureRenderTime = useCallback(() => {
    const renderTime = Date.now() - renderStartTime.current;
    
    const metrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || undefined
    };
    
    metricsRef.current.push(metrics);
    
    // Keep only last 10 measurements
    if (metricsRef.current.length > 10) {
      metricsRef.current.shift();
    }
    
    // Log slow renders (> 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected: ${renderTime}ms`);
    }
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    renderStartTime.current = Date.now();
    
    // Measure after render
    const timeoutId = setTimeout(measureRenderTime, 0);
    
    return () => clearTimeout(timeoutId);
  });

  // Get performance insights
  const getPerformanceInsights = useCallback(() => {
    const metrics = metricsRef.current;
    if (metrics.length === 0) return null;
    
    const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
    const maxRenderTime = Math.max(...metrics.map(m => m.renderTime));
    const slowRenders = metrics.filter(m => m.renderTime > 16).length;
    
    return {
      averageRenderTime: avgRenderTime,
      maxRenderTime,
      slowRenderCount: slowRenders,
      totalMeasurements: metrics.length,
      performanceGrade: avgRenderTime < 8 ? 'A' : avgRenderTime < 16 ? 'B' : 'C'
    };
  }, []);

  // Image lazy loading helper
  const createLazyImageObserver = useCallback((callback: (entries: IntersectionObserverEntry[]) => void) => {
    if (typeof IntersectionObserver === 'undefined') {
      return null;
    }
    
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
  }, []);

  return {
    throttle,
    debounce,
    measureRenderTime,
    getPerformanceInsights,
    createLazyImageObserver
  };
}
