
// Utility functions for testing offline scenarios

export const simulateOffline = () => {
  // Override navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  });
  
  // Dispatch offline event
  window.dispatchEvent(new Event('offline'));
  
  console.log('🔌 Simulating offline mode');
};

export const simulateOnline = () => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true
  });
  
  window.dispatchEvent(new Event('online'));
  
  console.log('📶 Simulating online mode');
};

export const simulateSlowConnection = () => {
  // Mock fetch with delayed responses
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    return originalFetch(...args);
  };
  
  console.log('🐌 Simulating slow connection (3s delays)');
  
  // Return cleanup function
  return () => {
    window.fetch = originalFetch;
    console.log('⚡ Restored normal connection speed');
  };
};

// Add to window for easy testing in console
if (typeof window !== 'undefined') {
  (window as any).offlineTestUtils = {
    simulateOffline,
    simulateOnline,
    simulateSlowConnection
  };
}
