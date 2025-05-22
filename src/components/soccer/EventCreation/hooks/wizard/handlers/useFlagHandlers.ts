
export function useFlagHandlers({ flagLogic, selection, completeAndMoveOn }) {
  // Handle flag value selection
  const handleFlagValueSelect = (value: string) => {
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
        const conditionsForFlag = flagLogic.flagConditions.filter(
          c => c.flagId === currentFlag.id && c.value === value
        );
        
        if (conditionsForFlag && conditionsForFlag.length > 0) {
          // Update available flags based on conditions
          const updatedAvailableFlags = flagLogic.availableFlags.filter(
            af => !conditionsForFlag.some(c => c.flagsToHideIds.includes(af.id))
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
            console.log("All flags complete, calling completeAndMoveOn");
            completeAndMoveOn();
          }
        } else {
          // This is the last flag, save the event
          console.log("Last flag selected, calling completeAndMoveOn");
          completeAndMoveOn();
        }
      }
    }
  };

  // Utility to get flag name by ID
  const getFlagNameById = (flags: any[], flagId: string): string => {
    const flag = flags.find(f => f.id === flagId);
    return flag ? flag.name : flagId;
  };

  return {
    handleFlagValueSelect,
    getFlagNameById
  };
}
