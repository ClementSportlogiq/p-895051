
import { useState, useEffect } from "react";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { AnnotationFlag, FlagCondition } from "@/types/annotation";

export function useFlagLogic() {
  const { getDefaultFlagDefinitions } = useAnnotationLabels();
  const [currentLabelId, setCurrentLabelId] = useState<string | null>(null);
  const [flagsForLabel, setFlagsForLabel] = useState<AnnotationFlag[]>([]);
  const [availableFlags, setAvailableFlags] = useState<AnnotationFlag[]>([]);
  const [currentFlagIndex, setCurrentFlagIndex] = useState<number>(0);
  const [flagValues, setFlagValues] = useState<Record<string, string>>({});
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>([]);

  // Reset flag values when changing label
  const resetFlagValues = () => {
    setFlagValues({});
    setCurrentFlagIndex(0);
  };

  // Fixed comprehensive reset function - ensures proper empty initial state
  const resetFlagLogic = () => {
    console.log("Resetting flag logic - before:", {
      currentLabelId,
      flagsForLabel: flagsForLabel.length,
      availableFlags: availableFlags.length,
      currentFlagIndex,
      flagValues: Object.keys(flagValues),
      flagConditions: flagConditions.length
    });
    
    setCurrentLabelId(null);
    
    // CRITICAL FIX: Set flagsForLabel to empty array during reset
    // This ensures the wizard starts with no flags loaded, matching the working completion pathway
    // Default flags should only be loaded when a specific event/label is selected
    setFlagsForLabel([]); // Changed from getDefaultFlagDefinitions() to []
    setAvailableFlags([]);
    setCurrentFlagIndex(0);
    setFlagValues({});
    
    // Reset flagConditions to empty array - no default conditions without flags
    setFlagConditions([]);
    
    console.log("Flag logic reset - flagsForLabel set to empty array for correct initial state");
  };

  // Load default flags when a label is selected (not during reset)
  const loadFlagsForLabel = (labelId: string) => {
    setCurrentLabelId(labelId);
    
    // Now load the default flags for this specific label
    const defaultFlags = getDefaultFlagDefinitions();
    setFlagsForLabel(defaultFlags);
    
    // Generate default flag conditions from the loaded flags
    const defaultFlagConditions: FlagCondition[] = defaultFlags.flatMap(flag => 
      flag.values?.flatMap(value => ({
        flagId: flag.id,
        value: value.value,
        flagsToHideIds: []
      })) || []
    );
    setFlagConditions(defaultFlagConditions);
    
    console.log(`Loaded ${defaultFlags.length} flags for label ${labelId}`);
  };

  // Update available flags based on current selections and flag conditions
  useEffect(() => {
    if (flagsForLabel.length === 0) {
      setAvailableFlags([]);
      return;
    }

    // Start with all flags for the label
    let newAvailableFlags = [...flagsForLabel];

    // If we have flag values and conditions, filter out flags that should be hidden
    if (Object.keys(flagValues).length > 0 && flagConditions.length > 0) {
      // For each selected flag value
      Object.entries(flagValues).forEach(([flagId, value]) => {
        // Find conditions that match this flag and value
        const matchingConditions = flagConditions.filter(
          condition => condition.flagId === flagId && condition.value === value
        );

        // Get all flags to hide based on matching conditions
        const flagsToHide = matchingConditions.flatMap(
          condition => condition.flagsToHideIds || []
        );

        // Filter out flags that should be hidden
        if (flagsToHide.length > 0) {
          newAvailableFlags = newAvailableFlags.filter(
            flag => !flagsToHide.includes(flag.id)
          );
        }
      });
    }

    setAvailableFlags(newAvailableFlags);
  }, [flagsForLabel, flagValues, flagConditions]);

  // Get the current flag
  const currentFlag = availableFlags.length > 0 && currentFlagIndex < availableFlags.length
    ? availableFlags[currentFlagIndex]
    : null;

  return {
    currentLabelId,
    setCurrentLabelId,
    flagsForLabel,
    setFlagsForLabel,
    availableFlags,
    setAvailableFlags,
    currentFlagIndex,
    setCurrentFlagIndex,
    flagValues,
    setFlagValues,
    resetFlagValues,
    resetFlagLogic,
    loadFlagsForLabel, // New function to load flags when a label is selected
    currentFlag,
    flagConditions,
    setFlagConditions
  };
}
