
import { useUnifiedEventCompletion } from "../../useUnifiedEventCompletion";

export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Get the unified completion system with wizard-specific context and state
  const { completeEvent, cancelEvent, performReset } = useUnifiedEventCompletion({
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
    },
    wizardState: {
      resetWizard: () => {
        // Comprehensive wizard reset using individual state reset functions
        console.log("Event completion triggering comprehensive wizard reset");
        
        if (selection?.resetSelectionState) {
          selection.resetSelectionState();
        }
        
        if (flagLogic?.resetFlagLogic) {
          flagLogic.resetFlagLogic();
        }
        
        // Reset soccer context
        if (sockerContext?.resetEventSelection) {
          sockerContext.resetEventSelection();
        }
      }
    }
  });

  // Complete the event creation using the unified system
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic?.flagValues);
    return completeEvent();
  };

  // Reset wizard using the unified system
  const resetWizard = () => {
    performReset();
  };

  return {
    completeEventCreation,
    resetWizard,
    cancelEvent: () => cancelEvent()
  };
}
