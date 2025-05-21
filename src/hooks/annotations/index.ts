
import { useState, useEffect, useCallback } from 'react';
import { AnnotationLabel, EventCategory, AnnotationFlag } from '@/types/annotation';
import { useLabels } from './useLabels';
import { useFlags } from './useFlags';
import { useDataInitialization } from './useDataInitialization';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { defaultCategories } from './constants';

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
  
  // Memoize the loadData function to prevent infinite re-renders
  const loadData = useCallback(async () => {
    const {
      loadData: innerLoadData
    } = useDataInitialization(setLabels, setFlags, setIsLoading, processLabels);
    
    return innerLoadData();
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
      initializeDefaults();
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
