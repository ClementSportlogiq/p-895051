
import { useUnifiedEventCompletion } from "../../useUnifiedEventCompletion";

export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Create a comprehensive reset function for wizard state
  const createWizardReset = () => {
    return () => {
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
  };

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

  // Complete the event creation with wizard reset
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic?.flagValues);
    return completeEvent(createWizardReset());
  };

  // Reset wizard - exposed publicly for the WizardStateContextValue
  const resetWizard = () => {
    createWizardReset()();
  };

  // Legacy method names for backward compatibility
  const resetState = resetWizard;

  return {
    completeEventCreation,
    resetState,
    resetWizard,
    cancelEvent: () => cancelEvent(createWizardReset())
  };
}
