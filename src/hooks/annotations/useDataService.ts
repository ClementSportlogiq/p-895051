
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { fetchDatabaseData, processData } from './dataUtils';
import { AnnotationLabel, AnnotationFlag } from '@/types/annotation';

/**
 * This hook provides centralized data services for annotation data
 * - Separates data fetching from UI components
 * - Handles errors consistently
 * - Provides memoized functions to prevent unnecessary re-renders
 */
export function useDataService() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  /**
   * Load data from Supabase
   * @returns Object containing processed labels and flags
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      // Fetch data from database
      const { labelsData, flagsData } = await fetchDatabaseData();
      
      // Process the fetched data
      const { processedLabels, processedFlags } = processData(labelsData, flagsData);
      
      console.log('Data loaded successfully', {
        labels: processedLabels.length,
        flags: processedFlags.length
      });
      
      return { 
        labels: processedLabels, 
        flags: processedFlags 
      };
    } catch (error: any) {
      console.error('Error loading annotation data:', error);
      setLastError(error);
      
      toast({
        title: "Error loading data",
        description: `Failed to load annotation data: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      
      // Return empty arrays to prevent null references
      return { labels: [], flags: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Subscribe to database changes
   * @param onDataChange Callback function to execute when data changes
   * @returns Cleanup function to remove subscriptions
   */
  const subscribeToChanges = useCallback((onDataChange: () => Promise<void>) => {
    console.log('Setting up real-time subscription...');
    
    // Set up real-time subscription for all changes (INSERT, UPDATE, DELETE)
    const labelsSubscription = supabase
      .channel('annotation_labels_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'annotation_labels' 
        },
        (payload) => {
          console.log('Labels data changed:', payload.eventType);
          // Try to reload data, log error but don't throw
          onDataChange().catch(error => {
            console.error('Error reloading data after labels change:', error);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to annotation_labels changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to annotation_labels changes');
          toast({
            title: "Subscription Error",
            description: "Failed to subscribe to real-time updates. Some changes may require refreshing.",
            variant: "destructive"
          });
        }
      });
    
    const flagsSubscription = supabase
      .channel('annotation_flags_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'annotation_flags' 
        },
        (payload) => {
          console.log('Flags data changed:', payload.eventType);
          onDataChange().catch(error => {
            console.error('Error reloading data after flags change:', error);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to annotation_flags changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to annotation_flags changes');
          toast({
            title: "Subscription Error", 
            description: "Failed to subscribe to real-time updates. Some changes may require refreshing.",
            variant: "destructive"
          });
        }
      });
      
    // Return cleanup function
    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(labelsSubscription);
      supabase.removeChannel(flagsSubscription);
    };
  }, []);

  return {
    loadData,
    subscribeToChanges,
    isLoading,
    lastError
  };
}
