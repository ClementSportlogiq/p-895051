
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnnotationLabel, EventCategory, AnnotationFlag } from '@/types/annotation';
import { useLabels } from './useLabels';
import { useFlags } from './useFlags';
import { defaultCategories } from './constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { processFlags, processConditions } from './utils';

// Add global window augmentation
declare global {
  interface Window {
    _soccerLabels?: AnnotationLabel[];
  }
}

// Move data loading logic outside of hook to avoid hook-in-hook issues
const fetchDatabaseData = async () => {
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

    return { labelsData, flagsData };
  } catch (error) {
    console.error('Error fetching annotation data:', error);
    throw error;
  }
};

// Process data without hook dependencies
const processData = (labelsData: any[], flagsData: any[]) => {
  try {
    // Process flags with the new structure
    const processedFlags = processFlags(flagsData);

    // Process labels
    const processedLabels = labelsData.map((label: any) => {
      // Convert flags from IDs to actual flag objects
      const labelFlags = label.flags && Array.isArray(label.flags) 
        ? label.flags.map((flagId: string) => 
            processedFlags.find((f: any) => f.id === flagId)
          ).filter(Boolean)
        : [];

      // Process flag conditions for the new format
      let flagConditions;
      try {
        if (label.flag_conditions) {
          flagConditions = typeof label.flag_conditions === 'string' 
            ? processConditions(JSON.parse(label.flag_conditions))
            : processConditions(label.flag_conditions);
        } else {
          flagConditions = [];
        }
      } catch (e) {
        console.error('Error parsing flag conditions', e);
        flagConditions = [];
      }
      
      return {
        ...label,
        flags: labelFlags,
        flag_conditions: flagConditions
      };
    });

    return { processedLabels, processedFlags };
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

export function useAnnotationLabels() {
  const { 
    labels, 
    setLabels, 
    isLoading, 
    setIsLoading, 
    getQuickEvents, 
    getLabelsByCategory,
    saveLabel,
    deleteLabel
  } = useLabels();
  
  const {
    flags,
    setFlags,
    getFlagsByLabel,
    saveFlag,
    deleteFlag: deleteFlag_
  } = useFlags();

  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  const initialLoadAttempted = useRef(false);
  
  // Memoize the loadData function to prevent infinite re-renders
  const loadData = useCallback(async () => {
    if (isLoading && initialLoadAttempted.current) {
      return; // Prevent concurrent loads
    }

    setIsLoading(true);
    initialLoadAttempted.current = true;
    
    try {
      // Fetch data using our standalone function
      const { labelsData, flagsData } = await fetchDatabaseData();
      
      // Process data with our standalone processor
      const { processedLabels, processedFlags } = processData(labelsData, flagsData);

      setLabels(processedLabels);
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
        description: "Could not load labels and flags from the database.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [setLabels, setFlags, setIsLoading, isLoading]);

  // Initialize defaults
  const initializeDefaults = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      // Check if any labels exist
      const { count, error: countError } = await supabase
        .from('annotation_labels')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // If no labels exist, populate with defaults from useDataInitialization
      if (count === 0) {
        // Implement initialization logic here or import from useDataInitialization
        console.log('No labels found, would add defaults here');
        // Will be handled by useDataInitialization if needed
      }
    } catch (error) {
      console.error('Error checking for existing data:', error);
    }
  }, [isInitialized]);
  
  // Make labels available globally for debugging and access by other components
  useEffect(() => {
    if (labels && labels.length > 0) {
      window._soccerLabels = labels;
    }
  }, [labels]);

  // Set up data loading once on mount
  useEffect(() => {
    loadData().catch(error => {
      console.error('Initial data loading failed:', error);
    });
  }, [loadData]);
  
  // Set up real-time subscription for changes
  useEffect(() => {
    // Load initial data handled in separate useEffect above
    
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
          loadData().catch(error => {
            console.error('Error reloading data after labels change:', error);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to annotation_labels changes');
        } else if (status === 'CHANNEL_ERROR') {
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
          loadData().catch(error => {
            console.error('Error reloading data after flags change:', error);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to annotation_flags changes');
        } else if (status === 'CHANNEL_ERROR') {
          toast({
            title: "Subscription Error", 
            description: "Failed to subscribe to real-time updates. Some changes may require refreshing.",
            variant: "destructive"
          });
        }
      });

    // Initialize defaults after loading if needed
    if (!isLoading && !isInitialized) {
      initializeDefaults().catch(error => {
        console.error('Error initializing defaults:', error);
      });
    }
      
    return () => {
      // Clean up subscriptions when component unmounts
      supabase.removeChannel(labelsSubscription);
      supabase.removeChannel(flagsSubscription);
    };
  }, [loadData, isLoading, isInitialized, initializeDefaults]);

  // Wrapper for deleteFlag to pass the current labels
  const deleteFlag = async (id: string) => {
    return deleteFlag_(id, labels);
  };

  return {
    labels,
    flags,
    isLoading,
    getQuickEvents,
    getLabelsByCategory,
    getFlagsByLabel,
    categories: defaultCategories,
    saveLabel,
    deleteLabel,
    saveFlag,
    deleteFlag
  };
}

export default useAnnotationLabels;
