
import { useUnifiedEventCompletion } from "../../useUnifiedEventCompletion";

export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Get the unified completion system with wizard-specific context
  const { completeEvent, cancelEvent } = useUnifiedEventCompletion({
    gameTime: sockerContext?.selectedGameTime || "",
    videoTime: sockerContext?.selectedVideoTime || "",
    contextOverrides: {
      selectedPlayer: sockerContext?.selectedPlayer,
      selectedTeam: sockerContext?.selectedTeam,
      selectedLocation: sockerContext?.selectedLocation,
      selectedEventCategory: selection?.selectedCategory,
      selectedEventType: selection?.selectedEventName || selection?.selectedEvent,
      selectedEventDetails: {
        flags: flagLogic?.flagValues || {}
      }
    }
  });

  // Single comprehensive reset function for all wizard state
  const resetWizard = () => {
    try {
      // Reset selection state
      if (selection) {
        selection.setSelectedCategory(null);
        selection.setSelectedEvent(null);
        selection.setSelectedEventName(null);
        selection.setFlagConditions([]);
        selection.setCurrentStep("default");
      }
      
      // Reset flag state
      if (flagLogic) {
        flagLogic.setCurrentLabelId("");
        flagLogic.setFlagsForLabel([]);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
      }
      
      // Reset soccer context
      if (sockerContext && sockerContext.resetEventSelection) {
        sockerContext.resetEventSelection();
      }
      
      console.log("Wizard state fully reset");
    } catch (error) {
      console.error("Error in wizard reset:", error);
    }
  };

  // Complete the event creation with wizard reset
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic?.flagValues);
    return completeEvent(resetWizard);
  };

  return {
    completeEventCreation,
    resetWizard,
    cancelEvent: () => cancelEvent(resetWizard)
  };
}
