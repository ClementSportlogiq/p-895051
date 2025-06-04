
import { useState, useEffect } from 'react';
import { AnnotationLabel, EventCategory, AnnotationFlag } from '@/types/annotation';
import { useLabels } from './useLabels';
import { useFlags } from './useFlags';
import { useCategories } from './useCategories';
import { useDataInitialization } from './useDataInitialization';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { useDefaultWizardConfig } from '../useDefaultWizardConfig';

export function useAnnotationLabels() {
  const { 
    labels, 
    setLabels, 
    isLoading, 
    setIsLoading, 
    processLabels, 
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

  const {
    categories,
    setCategories,
    loadCategories,
    saveCategory,
    deleteCategory
  } = useCategories();

  const { getConfiguredQuickEvents, getConfiguredFlagDefinitions } = useDefaultWizardConfig();
  
  const {
    loadData,
    initializeDefaults,
    isInitialized
  } = useDataInitialization(setLabels, setFlags, setIsLoading, processLabels);
  
  // Enhanced real-time subscription to include categories
  const enhancedLoadData = async () => {
    await loadData();
    await loadCategories();
  };

  // Set up real-time subscription for changes
  useRealtimeSubscription(enhancedLoadData);
  
  // Initialize defaults after loading
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      initializeDefaults();
    }
  }, [isLoading, isInitialized]);

  // Get quick events from explicit admin configuration
  const getQuickEvents = (): AnnotationLabel[] => {
    const configuredEvents = getConfiguredQuickEvents(labels);
    
    // Return configured events if available, otherwise fallback to first 4 labels
    if (configuredEvents.length > 0) {
      return configuredEvents.slice(0, 4);
    }
    
    // Fallback to the first 4 labels if no explicit configuration
    return labels.slice(0, 4);
  };

  // Get default flag definitions from explicit admin configuration
  const getDefaultFlagDefinitions = (): AnnotationFlag[] => {
    const configuredFlags = getConfiguredFlagDefinitions(flags);
    
    // Return configured flags if available, otherwise return all available flags
    if (configuredFlags.length > 0) {
      return configuredFlags;
    }
    
    // Fallback to all flags if no explicit configuration
    return flags || [];
  };

  // Wrapper for deleteFlag to pass the current labels
  const deleteFlag = async (id: string) => {
    return deleteFlag_(id, labels);
  };

  return {
    labels,
    flags,
    categories,
    isLoading,
    getQuickEvents,
    getLabelsByCategory,
    getFlagsByLabel,
    getDefaultFlagDefinitions,
    saveLabel,
    deleteLabel,
    saveFlag,
    deleteFlag,
    saveCategory,
    deleteCategory
  };
}

export default useAnnotationLabels;
