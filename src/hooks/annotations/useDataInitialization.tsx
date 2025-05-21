
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { defaultQuickEvents } from './constants';
import { fetchDatabaseData, processData } from './dataUtils';

export function useDataInitialization(
  setLabels: (labels: any[]) => void, 
  setFlags: (flags: any[]) => void, 
  setIsLoading: (isLoading: boolean) => void
) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from Supabase - memoize to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch data
      const { labelsData, flagsData } = await fetchDatabaseData();
      
      // Process data
      const { processedLabels, processedFlags } = processData(labelsData, flagsData);
      
      setLabels(processedLabels.length > 0 ? processedLabels : defaultQuickEvents);
      setFlags(processedFlags);
      setIsInitialized(true);
      
      console.log('Data loaded successfully', {
        labels: processedLabels.length,
        flags: processedFlags.length
      });
    } catch (error) {
      console.error('Error loading annotation data:', error);
      toast({
        title: "Error loading annotation data",
        description: "Could not load labels and flags from the database. Using local defaults.",
        variant: "destructive"
      });
      
      // Fallback to defaults if database fails
      setLabels(defaultQuickEvents);
    } finally {
      setIsLoading(false);
    }
  }, [setLabels, setFlags, setIsLoading]);

  // Initialize database with default values if empty
  const initializeDefaults = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      // Check if any labels exist
      const { count, error: countError } = await supabase
        .from('annotation_labels')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // If no labels exist, populate with defaults
      if (count === 0) {
        console.log('No labels found, adding defaults');
        // Add default labels
        for (const label of defaultQuickEvents) {
          const { error } = await supabase
            .from('annotation_labels')
            .insert({
              id: label.id,
              name: label.name,
              category: label.category,
              hotkey: label.hotkey,
              description: label.description || '',
              flags: []
            });
          
          if (error) throw error;
        }

        // Reload data after initialization
        await loadData();
      }
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }, [isInitialized, loadData]);

  return {
    loadData,
    initializeDefaults,
    isInitialized
  };
}

export default useDataInitialization;
