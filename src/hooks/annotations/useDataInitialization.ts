
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { defaultQuickEvents } from './constants';
import { processFlags } from './utils';

export function useDataInitialization(
  setLabels: (labels: any[]) => void, 
  setFlags: (flags: any[]) => void, 
  setIsLoading: (isLoading: boolean) => void, 
  processLabels: any
) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from Supabase - memoize to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch labels
      const { data: labelsData, error: labelsError } = await supabase
        .from('annotation_labels')
        .select('*');
      
      if (labelsError) {
        throw labelsError;
      }

      // Fetch flags
      const { data: flagsData, error: flagsError } = await supabase
        .from('annotation_flags')
        .select('*');
      
      if (flagsError) {
        throw flagsError;
      }

      // Process flags with the new structure
      const processedFlags = processFlags(flagsData);

      // Process labels with the processed flags
      const processedLabels = processLabels(labelsData, processedFlags);

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
  }, [setLabels, setFlags, setIsLoading, processLabels]);

  // Initialize database with default values if empty
  const initializeDefaults = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      // Check if any labels exist
      const { count: labelCount, error: countError } = await supabase
        .from('annotation_labels')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // If no labels exist, populate with defaults
      if (labelCount === 0) {
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
