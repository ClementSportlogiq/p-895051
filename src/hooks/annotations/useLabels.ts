
import { useState, useEffect } from 'react';
import { AnnotationLabel, EventCategory } from '@/types/annotation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { defaultQuickEvents, defaultCategories } from './constants';
import { processFlags, processConditions } from './utils';

export function useLabels() {
  const [labels, setLabels] = useState<AnnotationLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process labels: convert flags from JSON strings to objects
  const processLabels = (labelsData: any[], processedFlags: any[]) => {
    return labelsData.map((label: any) => {
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
  };

  // Get the most used labels from each category, limited to 4 for quick events
  const getQuickEvents = (): AnnotationLabel[] => {
    // Get the most used labels from each category, limited to 4 for quick events
    return labels.slice(0, 4);
  };

  const getLabelsByCategory = (category: EventCategory): AnnotationLabel[] => {
    return labels.filter(label => label.category === category);
  };

  // Save label to database, ensuring flag conditions are properly persisted
  const saveLabel = async (label: AnnotationLabel) => {
    try {
      // Extract flag IDs for storage
      const flagIds = label.flags?.map(flag => flag.id) || [];
      
      // Convert flag_conditions to support the new structure with flagsToHideIds
      const flagConditionsJson = label.flag_conditions 
        ? JSON.stringify(label.flag_conditions.map(condition => ({
            flagId: condition.flagId,
            value: condition.value,
            flagsToHideIds: condition.flagsToHideIds || [] // Ensure array even if coming from legacy data
          })))
        : null;
      
      const { error } = await supabase
        .from('annotation_labels')
        .upsert({
          id: label.id,
          name: label.name,
          category: label.category,
          hotkey: label.hotkey,
          description: label.description || '',
          flags: flagIds,
          flag_conditions: flagConditionsJson
        });
      
      if (error) throw error;
      
      // No need to manually update the state as the subscription will trigger a reload
      return true;
    } catch (error) {
      console.error('Error saving label:', error);
      toast({
        title: "Error saving label",
        description: "Could not save label to the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete label from database
  const deleteLabel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('annotation_labels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // No need to manually update the state as the subscription will trigger a reload
      return true;
    } catch (error) {
      console.error('Error deleting label:', error);
      toast({
        title: "Error deleting label",
        description: "Could not delete label from the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    labels,
    setLabels,
    isLoading,
    setIsLoading,
    processLabels,
    getQuickEvents,
    getLabelsByCategory,
    saveLabel,
    deleteLabel
  };
}
