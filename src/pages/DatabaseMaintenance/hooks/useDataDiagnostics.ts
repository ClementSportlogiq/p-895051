
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DatabaseStats, FlagIssue, AffectedItem } from '../types';
import { useDataService } from '@/hooks/annotations/useDataService';

const initialStats: DatabaseStats = {
  labelCount: 0,
  flagCount: 0,
  flagValuesCount: 0,
  labelIssuesCount: 0,
  flagIssuesCount: 0,
  flagValueIssuesCount: 0
};

export function useDataDiagnostics() {
  const [stats, setStats] = useState<DatabaseStats>(initialStats);
  const [flagIssues, setFlagIssues] = useState<FlagIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  const { loadData } = useDataService();
  
  // Run database diagnostics
  const runDiagnostics = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      console.log('Starting database diagnostics...');
      
      // Fetch raw data from database to do integrity checks
      const { data: labelsData, error: labelsError } = await supabase
        .from('annotation_labels')
        .select('*');
      
      if (labelsError) {
        console.error('Error fetching labels:', labelsError);
        throw labelsError;
      }

      const { data: flagsData, error: flagsError } = await supabase
        .from('annotation_flags')
        .select('*');
      
      if (flagsError) {
        console.error('Error fetching flags:', flagsError);
        throw flagsError;
      }
      
      console.log(`Fetched ${labelsData?.length || 0} labels and ${flagsData?.length || 0} flags`);
      
      // Safety check for null data
      const actualLabelsData = labelsData || [];
      const actualFlagsData = flagsData || [];
      
      // Process flags with special error handling to catch issues
      const flagIssues: FlagIssue[] = [];
      
      // Count flag values
      let totalFlagValues = 0;
      let flagValueIssuesCount = 0;
      
      // Check for flag data issues
      actualFlagsData.forEach((flag: any) => {
        try {
          let values: any[] = [];
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
            
            values.forEach((val) => {
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
      
      actualLabelsData.forEach((label: any) => {
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
            !actualFlagsData.some((flag: any) => flag.id === flagId)
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
                const flagExists = actualFlagsData.some((flag: any) => flag.id === condition.flagId);
                
                // Check flagsToHideIds (if they exist)
                let invalidHideFlags = false;
                if (condition.flagsToHideIds && Array.isArray(condition.flagsToHideIds)) {
                  invalidHideFlags = condition.flagsToHideIds.some((hideId: string) => 
                    !actualFlagsData.some((flag: any) => flag.id === hideId)
                  );
                }
                
                // Check legacy nextFlagId (if it exists)
                let invalidNextFlag = false;
                if (condition.nextFlagId) {
                  invalidNextFlag = !actualFlagsData.some((flag: any) => flag.id === condition.nextFlagId);
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
      const newStats: DatabaseStats = {
        labelCount: actualLabelsData.length,
        flagCount: actualFlagsData.length,
        flagValuesCount: totalFlagValues,
        labelIssuesCount,
        flagIssuesCount: flagIssues.filter(issue => 
          issue.affectedItems.some(item => item.type === 'flag')
        ).length,
        flagValueIssuesCount
      };
      
      console.log('Diagnostic results:', newStats);
      
      // Set flag issues
      setStats(newStats);
      setFlagIssues(flagIssues);
      
    } catch (error: any) {
      console.error('Error running diagnostics:', error);
      setLastError(error);
      toast({
        title: "Diagnostics Error",
        description: `An error occurred while running database diagnostics: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    flagIssues,
    isLoading,
    lastError,
    runDiagnostics
  };
}

export default useDataDiagnostics;
