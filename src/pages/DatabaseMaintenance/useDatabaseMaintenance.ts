
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DatabaseStats, FlagIssue, AffectedItem } from './types';
import { AnnotationFlag, AnnotationLabel, FlagValue } from '@/types/annotation';
import { processFlags, processConditions } from '@/hooks/annotations/utils';

const initialStats: DatabaseStats = {
  labelCount: 0,
  flagCount: 0,
  flagValuesCount: 0,
  labelIssuesCount: 0,
  flagIssuesCount: 0,
  flagValueIssuesCount: 0
};

export function useDatabaseMaintenance() {
  const [stats, setStats] = useState<DatabaseStats>(initialStats);
  const [flagIssues, setFlagIssues] = useState<FlagIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Run database diagnostics
  const runDiagnostics = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch raw data from database to do integrity checks
      const { data: labelsData, error: labelsError } = await supabase
        .from('annotation_labels')
        .select('*');
      
      if (labelsError) throw labelsError;

      const { data: flagsData, error: flagsError } = await supabase
        .from('annotation_flags')
        .select('*');
      
      if (flagsError) throw flagsError;
      
      // Process flags with special error handling to catch issues
      const processedFlags: AnnotationFlag[] = [];
      const flagIssues: FlagIssue[] = [];
      
      // Count flag values
      let totalFlagValues = 0;
      let flagValueIssuesCount = 0;
      
      // Check for flag data issues
      flagsData.forEach((flag: any) => {
        try {
          let values: (string | FlagValue)[] = [];
          let hasIssue = false;
          
          // Check flag values
          if (!flag.values) {
            hasIssue = true;
            flagIssues.push({
              type: 'Missing Flag Values',
              description: `Flag "${flag.name}" has no values defined`,
              severity: 'high',
              affectedItems: [{ id: flag.id, name: flag.name, type: 'flag' }]
            });
          } else if (typeof flag.values === 'string') {
            try {
              values = JSON.parse(flag.values);
            } catch (e) {
              hasIssue = true;
              flagValueIssuesCount++;
              flagIssues.push({
                type: 'Invalid Flag Values Format',
                description: `Flag "${flag.name}" has values stored as invalid JSON string`,
                severity: 'high',
                affectedItems: [{ id: flag.id, name: flag.name, type: 'flag' }]
              });
            }
          } else if (Array.isArray(flag.values)) {
            values = flag.values;
          } else if (typeof flag.values === 'object' && flag.values !== null) {
            // Handle case where values is an object but not an array
            hasIssue = true;
            flagValueIssuesCount++;
            flagIssues.push({
              type: 'Incorrect Flag Values Structure',
              description: `Flag "${flag.name}" has values stored as an object instead of an array`,
              severity: 'medium',
              affectedItems: [{ id: flag.id, name: flag.name, type: 'flag' }]
            });
            values = [flag.values];
          }
          
          // Check flag values structure
          if (Array.isArray(values)) {
            totalFlagValues += values.length;
            
            values.forEach((val, index) => {
              // Check if value is a string (legacy format)
              if (typeof val === 'string') {
                flagValueIssuesCount++;
                // Don't create duplicate issues for the same flag
                if (!hasIssue) {
                  hasIssue = true;
                  flagIssues.push({
                    type: 'Legacy Flag Value Format',
                    description: `Flag "${flag.name}" has values in legacy string format instead of object format`,
                    severity: 'medium',
                    affectedItems: [{ id: flag.id, name: flag.name, type: 'flag' }]
                  });
                }
              } else if (typeof val !== 'object' || val === null || !('value' in val) || !('hotkey' in val)) {
                flagValueIssuesCount++;
                // Don't create duplicate issues for the same flag
                if (!hasIssue) {
                  hasIssue = true;
                  flagIssues.push({
                    type: 'Invalid Flag Value Structure',
                    description: `Flag "${flag.name}" has values with incorrect structure (missing value or hotkey)`,
                    severity: 'high',
                    affectedItems: [{ id: flag.id, name: flag.name, type: 'flag' }]
                  });
                }
              }
            });
          }
          
          // Add to processed flags regardless of issues to provide complete data
          processedFlags.push({
            ...flag,
            order_priority: flag.order_priority || 0,
            values: Array.isArray(values) ? values.map((val, index) => {
              if (typeof val === 'string') {
                return {
                  value: val,
                  hotkey: String.fromCharCode(81 + index) // Start from Q (ASCII 81)
                };
              } else if (typeof val === 'object' && val !== null && 'value' in val && 'hotkey' in val) {
                return val;
              } else {
                return {
                  value: String(val),
                  hotkey: String.fromCharCode(81 + index)
                };
              }
            }) : []
          });
        } catch (error) {
          console.error(`Error processing flag ${flag.id}:`, error);
          flagIssues.push({
            type: 'Flag Processing Error',
            description: `Error processing flag "${flag.name || flag.id}": ${error}`,
            severity: 'high',
            affectedItems: [{ id: flag.id, name: flag.name || flag.id, type: 'flag' }]
          });
        }
      });
      
      // Check for label issues with flag references
      let labelIssuesCount = 0;
      
      labelsData.forEach((label: any) => {
        if (!label.flags) {
          labelIssuesCount++;
          flagIssues.push({
            type: 'Missing Label Flags',
            description: `Label "${label.name}" has no flags array defined`,
            severity: 'medium',
            affectedItems: [{ id: label.id, name: label.name, type: 'label' }]
          });
        } else if (Array.isArray(label.flags)) {
          // Check for references to non-existent flags
          const invalidFlags = label.flags.filter((flagId: string) => 
            !flagsData.some((flag: any) => flag.id === flagId)
          );
          
          if (invalidFlags.length > 0) {
            labelIssuesCount++;
            flagIssues.push({
              type: 'Invalid Flag References',
              description: `Label "${label.name}" references ${invalidFlags.length} non-existent flag(s)`,
              severity: 'high',
              affectedItems: [
                { id: label.id, name: label.name, type: 'label' },
                ...invalidFlags.map((flagId: string) => ({ 
                  id: flagId, 
                  name: `Unknown flag (${flagId.substring(0, 8)}...)`,
                  type: 'missing-flag'
                }))
              ]
            });
          }
        }
        
        // Check flag conditions
        if (label.flag_conditions) {
          try {
            const conditions = typeof label.flag_conditions === 'string' 
              ? JSON.parse(label.flag_conditions) 
              : label.flag_conditions;
              
            if (Array.isArray(conditions)) {
              const invalidConditions = conditions.filter((condition: any) => {
                // Check if flagId exists
                const flagExists = flagsData.some((flag: any) => flag.id === condition.flagId);
                
                // Check flagsToHideIds (if they exist)
                let invalidHideFlags = false;
                if (condition.flagsToHideIds && Array.isArray(condition.flagsToHideIds)) {
                  invalidHideFlags = condition.flagsToHideIds.some((hideId: string) => 
                    !flagsData.some((flag: any) => flag.id === hideId)
                  );
                }
                
                // Check legacy nextFlagId (if it exists)
                let invalidNextFlag = false;
                if (condition.nextFlagId) {
                  invalidNextFlag = !flagsData.some((flag: any) => flag.id === condition.nextFlagId);
                }
                
                return !flagExists || invalidHideFlags || invalidNextFlag;
              });
              
              if (invalidConditions.length > 0) {
                labelIssuesCount++;
                flagIssues.push({
                  type: 'Invalid Flag Conditions',
                  description: `Label "${label.name}" has ${invalidConditions.length} invalid flag condition(s)`,
                  severity: 'medium',
                  affectedItems: [{ id: label.id, name: label.name, type: 'label' }]
                });
              }
            }
          } catch (error) {
            labelIssuesCount++;
            flagIssues.push({
              type: 'Flag Conditions Parse Error',
              description: `Label "${label.name}" has invalid flag_conditions JSON`,
              severity: 'high',
              affectedItems: [{ id: label.id, name: label.name, type: 'label' }]
            });
          }
        }
      });
      
      // Update stats
      setStats({
        labelCount: labelsData.length,
        flagCount: flagsData.length,
        flagValuesCount: totalFlagValues,
        labelIssuesCount,
        flagIssuesCount: flagIssues.filter(issue => 
          issue.affectedItems.some(item => item.type === 'flag')
        ).length,
        flagValueIssuesCount
      });
      
      // Set flag issues
      setFlagIssues(flagIssues);
      
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast({
        title: "Diagnostics Error",
        description: "An error occurred while running database diagnostics.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fix all flag issues
  const fixAllFlagIssues = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch all flags and labels to work with
      const { data: flagsData, error: flagsError } = await supabase
        .from('annotation_flags')
        .select('*');
      
      if (flagsError) throw flagsError;
      
      const { data: labelsData, error: labelsError } = await supabase
        .from('annotation_labels')
        .select('*');
      
      if (labelsError) throw labelsError;
      
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
                label.flag_conditions = updatedConditions;
                needsUpdate = true;
              }
            }
          } catch (e) {
            // If parsing fails, initialize empty array
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
      
      // Re-run diagnostics to update stats and issues
      await runDiagnostics();
      
      toast({
        title: "Repair Completed",
        description: "Database flag issues have been repaired successfully.",
      });
    } catch (error) {
      console.error('Error fixing flag issues:', error);
      toast({
        title: "Repair Failed",
        description: "An error occurred while fixing flag issues.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [runDiagnostics]);
  
  // Run diagnostics on initial load
  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);
  
  return {
    stats,
    flagIssues,
    isLoading,
    runDiagnostics,
    fixAllFlagIssues
  };
}
