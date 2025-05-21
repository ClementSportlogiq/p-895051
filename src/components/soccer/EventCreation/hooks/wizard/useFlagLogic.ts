import { useState, useEffect } from "react";
import { 
  AnnotationFlag, 
  AnnotationLabel,
  FlagCondition
} from "@/types/annotation";

export function useFlagLogic() {
  // Flag handling state
  const [currentLabelId, setCurrentLabelId] = useState<string | null>(null);
  const [flagsForLabel, setFlagsForLabel] = useState<AnnotationFlag[]>([]);
  const [currentFlagIndex, setCurrentFlagIndex] = useState<number>(0);
  const [flagValues, setFlagValues] = useState<Record<string, string>>({});
  const [availableFlags, setAvailableFlags] = useState<AnnotationFlag[]>([]);

  // Get flag conditions for a label
  const getFlagConditions = (labelId: string | null, flagId?: string, value?: string): FlagCondition[] => {
    try {
      if (!labelId) return [];
      
      // Implementation of flag conditions logic
      const allLabels = window._soccerLabels || [];
      const label = allLabels.find(l => l.id === labelId);
      
      if (!label || !label.flag_conditions) return [];
      
      // If flagId and value are provided, filter conditions for that specific flag and value
      if (flagId && value) {
        return label.flag_conditions.filter(
          condition => condition.flagId === flagId && condition.value === value
        );
      }
      
      // Otherwise return all conditions for the label
      return label.flag_conditions;
    } catch (error) {
      console.error("Error getting flag conditions:", error);
      return [];
    }
  };

  // Modified helper function to hide specific flags based on conditions
  const determineAvailableFlags = (flags: AnnotationFlag[], conditions: FlagCondition[]): AnnotationFlag[] => {
    if (!flags || flags.length === 0) {
      return [];
    }
    
    try {
      // Start with all flags (the base set)
      let availableFlags = [...flags];
      
      // Create a set of flag IDs that should be hidden based on conditions
      const flagsToHideSet = new Set<string>();
      
      // Check each flag condition if available
      if (conditions && conditions.length > 0) {
        conditions.forEach((condition: FlagCondition) => {
          // Get the selected value for the flag in the condition
          const selectedValue = flagValues[condition.flagId];
          
          // If the selected value matches this condition, then hide the specified flags
          if (selectedValue === condition.value && condition.flagsToHideIds) {
            // Add each flag ID in the flagsToHideIds array to the hidden set
            condition.flagsToHideIds.forEach(flagId => {
              flagsToHideSet.add(flagId);
            });
          }
        });
      }
      
      // Return only the flags that should be available (not hidden)
      return availableFlags.filter(flag => !flagsToHideSet.has(flag.id));
    } catch (error) {
      console.error("Error determining available flags:", error);
      return flags; // Return original flags on error
    }
  };
  
  // Helper to get flag name from ID
  const getFlagNameById = (flags: AnnotationFlag[], flagId: string): string => {
    try {
      const flag = flags.find(f => f.id === flagId);
      return flag ? flag.name : '';
    } catch (error) {
      console.error("Error getting flag name by ID:", error);
      return '';
    }
  };

  return {
    currentLabelId,
    setCurrentLabelId,
    flagsForLabel,
    setFlagsForLabel,
    currentFlagIndex,
    setCurrentFlagIndex,
    flagValues,
    setFlagValues,
    availableFlags,
    setAvailableFlags,
    determineAvailableFlags,
    getFlagNameById,
    getFlagConditions
  };
}
