import { useState, useEffect } from 'react';
import { AnnotationLabel, EventCategory, AnnotationCategory, AnnotationFlag, FlagValue } from '@/types/annotation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Default categories that are always available
export const defaultCategories: AnnotationCategory[] = [
  { id: "offense", name: "Offense", hotkey: "A" },
  { id: "defense", name: "Defense", hotkey: "S" },
  { id: "reception", name: "Reception/LBR", hotkey: "D" },
  { id: "goalkeeper", name: "Goalkeeper", hotkey: "F" },
  { id: "deadball", name: "Deadball", hotkey: "Z" },
  { id: "playerAction", name: "Player Action", hotkey: "X" },
  { id: "infractions", name: "Infractions", hotkey: "C" },
];

// Default quick events in case no custom labels are defined
const defaultQuickEvents: AnnotationLabel[] = [
  { id: "pass", name: "Pass", category: "offense", hotkey: "Q", description: "Standard pass" },
  { id: "reception", name: "Reception", category: "reception", hotkey: "W", description: "Ball reception" },
  { id: "lbr", name: "LBR", category: "reception", hotkey: "E", description: "Lost ball reception" },
  { id: "interception", name: "Interception", category: "defense", hotkey: "R", description: "Interception" },
];

export function useAnnotationLabels() {
  const [labels, setLabels] = useState<AnnotationLabel[]>([]);
  const [flags, setFlags] = useState<AnnotationFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Process flags: convert values from JSON to array if needed and ensure correct structure
  const processFlags = (flagsData: any[]): AnnotationFlag[] => {
    return flagsData.map((flag: any) => {
      let values: (string | FlagValue)[] = [];
      
      // Handle different data formats
      if (Array.isArray(flag.values)) {
        values = flag.values;
      } else if (typeof flag.values === 'string') {
        try {
          values = JSON.parse(flag.values);
        } catch (e) {
          values = [];
          console.error('Error parsing flag values', e);
        }
      }
      
      // Convert legacy string values to FlagValue objects if needed
      const processedValues = values.map((val: any, index) => {
        if (typeof val === 'string') {
          // Legacy format - create a FlagValue object with auto-assigned hotkey
          return {
            value: val,
            hotkey: String.fromCharCode(81 + index) // Start from Q (ASCII 81)
          };
        } else if (typeof val === 'object' && val !== null && 'value' in val && 'hotkey' in val) {
          // Already in the right format
          return val;
        } else {
          // Unexpected format - create a placeholder
          return {
            value: String(val),
            hotkey: String.fromCharCode(81 + index)
          };
        }
      });

      return {
        ...flag,
        order_priority: flag.order_priority || 0, // Use order_priority from database
        values: processedValues
      };
    });
  };

  // Load data from Supabase
  const loadData = async () => {
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

      // Process labels: convert flags from JSON strings to objects
      const processedLabels = labelsData.map((label: any) => {
        // Convert flags from IDs to actual flag objects
        const labelFlags = label.flags && Array.isArray(label.flags) 
          ? label.flags.map((flagId: string) => 
              processedFlags.find((f: any) => f.id === flagId)
            ).filter(Boolean)
          : [];
        
        return {
          ...label,
          flags: labelFlags
        };
      });

      setLabels(processedLabels.length > 0 ? processedLabels : defaultQuickEvents);
      setFlags(processedFlags);
      setIsInitialized(true);
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
  };

  // Initialize database with default values if empty
  const initializeDefaults = async () => {
    if (isInitialized) return;
    
    try {
      // Check if any labels exist
      const { count: labelCount, error: countError } = await supabase
        .from('annotation_labels')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // If no labels exist, populate with defaults
      if (labelCount === 0) {
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
  };

  useEffect(() => {
    loadData();
    
    // Set up real-time subscription for changes
    const labelsSubscription = supabase
      .channel('annotation_labels_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'annotation_labels' },
        () => loadData()
      )
      .subscribe();
    
    const flagsSubscription = supabase
      .channel('annotation_flags_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'annotation_flags' },
        () => loadData()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(labelsSubscription);
      supabase.removeChannel(flagsSubscription);
    };
  }, []);

  // Initialize defaults after loading
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      initializeDefaults();
    }
  }, [isLoading, isInitialized]);

  const getQuickEvents = (): AnnotationLabel[] => {
    // Get the most used labels from each category, limited to 4 for quick events
    return labels.slice(0, 4);
  };

  const getLabelsByCategory = (category: EventCategory): AnnotationLabel[] => {
    return labels.filter(label => label.category === category);
  };

  const getFlagsByLabel = (labelId: string): AnnotationFlag[] => {
    const label = labels.find(l => l.id === labelId);
    return label?.flags || [];
  };

  // Save label to database
  const saveLabel = async (label: AnnotationLabel) => {
    try {
      // Extract flag IDs for storage
      const flagIds = label.flags?.map(flag => flag.id) || [];
      
      const { error } = await supabase
        .from('annotation_labels')
        .upsert({
          id: label.id,
          name: label.name,
          category: label.category,
          hotkey: label.hotkey,
          description: label.description || '',
          flags: flagIds,
          flag_conditions: label.flag_conditions || []
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

  // Save flag to database
  const saveFlag = async (flag: AnnotationFlag) => {
    try {
      // For new flags, if id is empty string, let Supabase generate it
      const { error } = await supabase
        .from('annotation_flags')
        .upsert({
          id: flag.id,
          name: flag.name,
          description: flag.description || '',
          order_priority: flag.order_priority || 0, // Use order_priority instead of order
          // Convert FlagValue[] to JSON for storage
          values: JSON.stringify(flag.values)
        });
      
      if (error) throw error;
      
      // No need to manually update the state as the subscription will trigger a reload
      return true;
    } catch (error) {
      console.error('Error saving flag:', error);
      toast({
        title: "Error saving flag",
        description: "Could not save flag to the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete flag from database
  const deleteFlag = async (id: string) => {
    try {
      // First update any labels that use this flag
      for (const label of labels) {
        if (label.flags?.some(f => f.id === id)) {
          const updatedFlags = label.flags.filter(f => f.id !== id);
          const flagIds = updatedFlags.map(f => f.id);
          
          await supabase
            .from('annotation_labels')
            .update({ flags: flagIds })
            .eq('id', label.id);
        }
      }
      
      // Then delete the flag
      const { error } = await supabase
        .from('annotation_flags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // No need to manually update the state as the subscription will trigger a reload
      return true;
    } catch (error) {
      console.error('Error deleting flag:', error);
      toast({
        title: "Error deleting flag",
        description: "Could not delete flag from the database.",
        variant: "destructive"
      });
      return false;
    }
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
