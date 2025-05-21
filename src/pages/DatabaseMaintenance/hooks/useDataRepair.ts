
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useDataRepair() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  // Fix all flag issues
  const fixAllFlagIssues = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      // Fetch all flags and labels to work with
      const { data: flagsData, error: flagsError } = await supabase
        .from('annotation_flags')
        .select('*');
      
      if (flagsError) {
        console.error('Error fetching flags:', flagsError);
        throw flagsError;
      }
      
      const { data: labelsData, error: labelsError } = await supabase
        .from('annotation_labels')
        .select('*');
      
      if (labelsError) {
        console.error('Error fetching labels:', labelsError);
        throw labelsError;
      }

      // Safety check
      if (!flagsData || !labelsData) {
        throw new Error('Failed to fetch data for repair');
      }
      
      const flagsById = Object.fromEntries(flagsData.map((flag: any) => [flag.id, flag]));
      
      // Process each flag and fix any issues
      for (const flag of flagsData) {
        // Fix flag values format
        let values = flag.values;
        let needsUpdate = false;
        
        // Convert string to array if needed
        if (typeof values === 'string') {
          try {
            values = JSON.parse(values);
            needsUpdate = true;
          } catch (e) {
            // If parsing fails, treat as a single value
            values = [values];
            needsUpdate = true;
          }
        } else if (!Array.isArray(values) && values && typeof values === 'object') {
          // Convert object to array
          values = [values];
          needsUpdate = true;
        } else if (!values) {
          // Initialize empty array
          values = [];
          needsUpdate = true;
        }
        
        // Convert string values to object format
        if (Array.isArray(values)) {
          const newValues = values.map((val, index) => {
            if (typeof val === 'string') {
              needsUpdate = true;
              return {
                value: val,
                hotkey: String.fromCharCode(81 + index) // Start from Q (ASCII 81)
              };
            } else if (typeof val === 'object' && val !== null && 'value' in val && 'hotkey' in val) {
              return val;
            } else {
              needsUpdate = true;
              return {
                value: String(val),
                hotkey: String.fromCharCode(81 + index)
              };
            }
          });
          
          if (needsUpdate) {
            console.log(`Updating flag ${flag.id} (${flag.name}) values`);
            // Update flag in database
            const { error: updateError } = await supabase
              .from('annotation_flags')
              .update({ values: newValues })
              .eq('id', flag.id);
              
            if (updateError) {
              console.error(`Error updating flag ${flag.id}:`, updateError);
            }
          }
        }
      }
      
      // Fix label issues
      for (const label of labelsData) {
        let needsUpdate = false;
        
        // Initialize empty flags array if needed
        if (!label.flags) {
          label.flags = [];
          needsUpdate = true;
        }
        
        // Check for references to non-existent flags
        if (Array.isArray(label.flags)) {
          const validFlags = label.flags.filter((flagId: string) => flagsById[flagId]);
          
          if (validFlags.length !== label.flags.length) {
            console.log(`Fixing label ${label.id} (${label.name}) invalid flag references`);
            needsUpdate = true;
            label.flags = validFlags;
          }
        }
        
        // Fix flag conditions
        if (label.flag_conditions) {
          try {
            const conditions = typeof label.flag_conditions === 'string' 
              ? JSON.parse(label.flag_conditions) 
              : label.flag_conditions;
              
            if (Array.isArray(conditions)) {
              let conditionsChanged = false;
              
              // Filter out conditions with invalid flag references
              const validConditions = conditions.filter((condition: any) => 
                flagsById[condition.flagId]
              );
              
              if (validConditions.length !== conditions.length) {
                conditionsChanged = true;
              }
              
              // Convert legacy nextFlagId to flagsToHideIds
              const updatedConditions = validConditions.map((condition: any) => {
                let changed = false;
                
                // Convert legacy nextFlagId to flagsToHideIds if needed
                if ('nextFlagId' in condition && !('flagsToHideIds' in condition)) {
                  condition = {
                    ...condition,
                    flagsToHideIds: condition.nextFlagId ? [condition.nextFlagId] : []
                  };
                  changed = true;
                }
                
                // Ensure flagsToHideIds only contains valid flag IDs
                if (condition.flagsToHideIds) {
                  const validHideIds = condition.flagsToHideIds.filter((id: string) => flagsById[id]);
                  
                  if (validHideIds.length !== condition.flagsToHideIds.length) {
                    condition.flagsToHideIds = validHideIds;
                    changed = true;
                  }
                }
                
                return changed ? condition : condition;
              });
              
              if (conditionsChanged || updatedConditions.some((_, i) => updatedConditions[i] !== validConditions[i])) {
                console.log(`Fixing label ${label.id} (${label.name}) flag conditions`);
                label.flag_conditions = updatedConditions;
                needsUpdate = true;
              }
            }
          } catch (e) {
            // If parsing fails, initialize empty array
            console.log(`Resetting label ${label.id} (${label.name}) invalid flag conditions`);
            label.flag_conditions = [];
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          // Update label in database
          const { error: updateError } = await supabase
            .from('annotation_labels')
            .update({ 
              flags: label.flags,
              flag_conditions: typeof label.flag_conditions === 'string' 
                ? label.flag_conditions 
                : JSON.stringify(label.flag_conditions)
            })
            .eq('id', label.id);
            
          if (updateError) {
            console.error(`Error updating label ${label.id}:`, updateError);
          }
        }
      }
      
      toast({
        title: "Repair Completed",
        description: "Database flag issues have been repaired successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error fixing flag issues:', error);
      setLastError(error);
      toast({
        title: "Repair Failed",
        description: `An error occurred while fixing flag issues: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    lastError,
    fixAllFlagIssues
  };
}

export default useDataRepair;
