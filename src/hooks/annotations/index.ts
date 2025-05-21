
import { useState, useEffect, useCallback } from 'react';
import { AnnotationLabel, EventCategory, AnnotationFlag } from '@/types/annotation';
import { useLabels } from './useLabels';
import { useFlags } from './useFlags';
import { useDataInitialization } from './useDataInitialization';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { defaultCategories } from './constants';

// Add global window augmentation
declare global {
  interface Window {
    _soccerLabels?: AnnotationLabel[];
  }
}

export function useAnnotationLabels() {
  const { 
    labels, 
    setLabels, 
    isLoading, 
    setIsLoading, 
    processLabels, 
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
  
  // Make labels available globally for debugging and access by other components
  useEffect(() => {
    if (labels && labels.length > 0) {
      window._soccerLabels = labels;
    }
  }, [labels]);
  
  // Memoize the loadData function to prevent infinite re-renders
  const loadData = useCallback(async () => {
    try {
      const {
        loadData: innerLoadData
      } = useDataInitialization(setLabels, setFlags, setIsLoading, processLabels);
      
      return innerLoadData();
    } catch (error) {
      console.error('Error in loadData:', error);
      setIsLoading(false); // Make sure to set loading to false on error
      throw error;
    }
  }, [setLabels, setFlags, setIsLoading, processLabels]);
  
  const {
    initializeDefaults,
    isInitialized
  } = useDataInitialization(setLabels, setFlags, setIsLoading, processLabels);
  
  // Set up real-time subscription for changes
  useRealtimeSubscription(loadData);
  
  // Initialize defaults after loading
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      initializeDefaults().catch(error => {
        console.error('Error initializing defaults:', error);
      });
    }
  }, [isLoading, isInitialized, initializeDefaults]);

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
