
import { useState, useEffect } from "react";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";

export function useStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "away" | "busy">(() => {
    // Get the initial status from localStorage
    return getUserStatus();
  });

  // Update status in localStorage and state
  const updateStatus = (newStatus: "online" | "offline" | "away" | "busy") => {
    setStatus(newStatus);
    setUserStatus(newStatus);
    
    // Dispatch a custom event so other components can react to the status change
    window.dispatchEvent(new CustomEvent('user-status-change', { 
      detail: { status: newStatus } 
    }));
  };

  // Listen for status changes from other components
  useEffect(() => {
    const handleStatusChange = (event: CustomEvent) => {
      setStatus(event.detail.status);
    };

    window.addEventListener('user-status-change', handleStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('user-status-change', handleStatusChange as EventListener);
    };
  }, []);

  return { status, updateStatus };
}
