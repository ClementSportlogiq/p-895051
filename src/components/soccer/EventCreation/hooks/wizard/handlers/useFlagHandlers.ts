
export function useFlagHandlers({ flagLogic, selection, completeAndMoveOn }) {
  // Handle flag value selection
  const handleFlagValueSelect = (value: string) => {
    try {
      // Save flag value
      if (flagLogic.currentFlagIndex < flagLogic.flagsForLabel.length) {
        const currentFlag = flagLogic.flagsForLabel[flagLogic.currentFlagIndex];
        
        if (currentFlag) {
          // Update flag values
          flagLogic.setFlagValues({
            ...flagLogic.flagValues,
            [currentFlag.id]: value
          });
          
          // Apply conditions based on selection
          const conditionsForFlag = flagLogic.getFlagConditions(flagLogic.currentLabelId, currentFlag.id, value);
          
          if (conditionsForFlag && conditionsForFlag.length > 0) {
            // Update available flags based on conditions
            const updatedAvailableFlags = flagLogic.determineAvailableFlags(
              flagLogic.flagsForLabel,
              flagLogic.getFlagConditions(flagLogic.currentLabelId)
            );
            flagLogic.setAvailableFlags(updatedAvailableFlags);
          }
          
          // Move to the next flag
          const nextIndex = flagLogic.currentFlagIndex + 1;
          
          // If more flags, go to next flag
          if (nextIndex < flagLogic.flagsForLabel.length) {
            flagLogic.setCurrentFlagIndex(nextIndex);
            
            // Skip unavailable flags
            let checkIndex = nextIndex;
            while (
              checkIndex < flagLogic.flagsForLabel.length && 
              !flagLogic.availableFlags.some(af => af.id === flagLogic.flagsForLabel[checkIndex].id)
            ) {
              checkIndex++;
              flagLogic.setCurrentFlagIndex(checkIndex);
            }
            
            // If all remaining flags are hidden, finish the process
            if (checkIndex >= flagLogic.flagsForLabel.length) {
              completeAndMoveOn();
            }
          } else {
            completeAndMoveOn();
          }
        }
      }
    } catch (error) {
      console.error("Error handling flag value selection:", error);
      // Fallback to complete the process even on error
      completeAndMoveOn();
    }
  };

  // Utility to get flag name by ID
  const getFlagNameById = (flags: any[], flagId: string): string => {
    try {
      const flag = flags.find(f => f.id === flagId);
      return flag ? flag.name : flagId;
    } catch (error) {
      console.error("Error getting flag name by ID:", error);
      return flagId; // Return the ID as fallback
    }
  };

  return {
    handleFlagValueSelect,
    getFlagNameById
  };
}
