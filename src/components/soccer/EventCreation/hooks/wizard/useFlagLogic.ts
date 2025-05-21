
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

  // Modified helper function to hide specific flags based on conditions
  const determineAvailableFlags = (label: AnnotationLabel, currentValues: Record<string, string>) => {
    if (!label.flags) {
      return [];
    }
    
    // Start with all flags (the base set)
    let flags = [...label.flags];
    
    // Create a set of flag IDs that should be hidden based on conditions
    const flagsToHideSet = new Set<string>();
    
    // Check each flag condition if available
    if (label.flag_conditions) {
      label.flag_conditions.forEach((condition: FlagCondition) => {
        // Get the selected value for the flag in the condition
        const selectedValue = currentValues[getFlagNameById(flags, condition.flagId)];
        
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
    return flags.filter(flag => !flagsToHideSet.has(flag.id));
  };
  
  // Helper to get flag name from ID
  const getFlagNameById = (flags: AnnotationFlag[], flagId: string): string => {
    const flag = flags.find(f => f.id === flagId);
    return flag ? flag.name : '';
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
    getFlagNameById
  };
}
