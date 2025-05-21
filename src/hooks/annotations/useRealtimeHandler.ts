import { useEffect, useRef } from 'react';
import { useDataService } from './useDataService';

/**
 * Hook to handle real-time database subscriptions
 * Prevents creating multiple subscriptions and handles cleanup
 */
export function useRealtimeHandler(loadData: () => Promise<void>) {
  const { subscribeToChanges } = useDataService();
  const loadDataRef = useRef(loadData);
  
  // Keep the loadData reference updated
  useEffect(() => {
    loadDataRef.current = loadData;
  }, [loadData]);
  
  // Setup subscription only once
  useEffect(() => {
    // Use the ref to prevent stale closure issues
    const handleDataChange = async () => {
      await loadDataRef.current();
    };
    
    // Setup subscriptions and get cleanup function
    const cleanup = subscribeToChanges(handleDataChange);
    
    // Clean up on unmount
    return cleanup;
  }, [subscribeToChanges]);
}
