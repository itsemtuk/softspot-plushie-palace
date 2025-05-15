
import { useState, useEffect } from "react";
import { getUserStatus, setUserStatus } from "@/utils/storage/localStorageUtils";
import { useClerkSync } from "@/hooks/useClerkSync";

export function useStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "away" | "busy">(() => {
    // Get the initial status from localStorage
    return getUserStatus();
  });
  
  const { updateUserStatus } = useClerkSync();

  // Update status in localStorage, state, and Clerk if configured
  const updateStatus = async (newStatus: "online" | "offline" | "away" | "busy") => {
    // Update local state
    setStatus(newStatus);
    
    // Update local storage
    setUserStatus(newStatus);
    
    // Try to update Clerk if available
    try {
      await updateUserStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status in Clerk:", error);
    }
    
    // Dispatch a custom event so other components can react to the status change
    window.dispatchEvent(new CustomEvent('user-status-change', { 
      detail: { status: newStatus } 
    }));
    
    console.log("Status updated to:", newStatus);
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
