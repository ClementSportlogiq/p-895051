
import { useEventValidation } from "../../eventActions/useEventValidation";
import { useSaveEvent } from "../../eventActions/useSaveEvent";
import { TeamType } from "@/context/SoccerContext";

export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Get access to the same validation function used by handleSaveEvent
  const { validateEvent, toast } = useEventValidation();
  
  // Get access to the same event creation function used by handleSaveEvent
  const { createEventPayload } = useSaveEvent();
  
  // Complete the event creation
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic.flagValues);
    
    // Safety check for selection and sockerContext
    if (!selection || !sockerContext) {
      console.error("Missing selection or sockerContext in completeEventCreation");
      return;
    }
    
    // Validate selected player and location first - using the same validation as handleSaveEvent
    const selectedPlayer = sockerContext.selectedPlayer;
    const selectedLocation = sockerContext.selectedLocation;
    
    if (!validateEvent(selectedPlayer, selectedLocation)) {
      console.log("Event validation failed in completeEventCreation");
      return;
    }

    // Get the current video and game time from context
    const videoTime = sockerContext.selectedVideoTime || "";
    const gameTime = sockerContext.selectedGameTime || "";
    
    // Create consistent event details from wizard selections
    const eventDetails = {
      category: selection.selectedCategory,
      eventType: selection.selectedEvent,
      pressure: selection.selectedPressure,
      bodyPart: selection.selectedBodyPart,
      flags: flagLogic?.flagValues || {}
    };
    
    // Create event payload using the same function as handleSaveEvent
    const eventPayload = createEventPayload(
      gameTime,
      videoTime, // Using current video time as logged time is not available in this context
      videoTime,
      selectedPlayer,
      sockerContext.selectedTeam as TeamType,
      selectedLocation,
      selection.selectedCategory,
      selection.selectedEventName || selection.selectedEvent, // Use event name if available, otherwise use event ID
      eventDetails
    );
    
    // Save event to context using the same addEvent function
    try {
      sockerContext.addEvent(eventPayload);
      
      // Reset after adding
      resetWizard();
      console.log("Event created using createEventPayload and wizard reset");
      
      // Show success toast
      toast({
        title: "Event Saved",
        description: `${selection.selectedEventName || selection.selectedEvent} event has been saved`
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event"
      });
    }
  };

  // Reset wizard state - thorough reset of all state variables
  const resetState = () => {
    try {
      // Reset selection state
      if (selection) {
        selection.setSelectedCategory(null);
        selection.setSelectedEvent(null);
        selection.setSelectedEventName(null);
        selection.setSelectedPressure(null);
        selection.setSelectedBodyPart(null);
        selection.setFlagConditions([]);  // Add this to reset flag conditions
      }
      
      // Reset flag state - be thorough
      if (flagLogic) {
        flagLogic.setCurrentLabelId("");
        flagLogic.setFlagsForLabel([]);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
      }
      
      console.log("Wizard state fully reset");
    } catch (error) {
      console.error("Error in resetState:", error);
    }
  };

  // Reset wizard - exposed publicly for the WizardStateContextValue
  const resetWizard = () => {
    resetState();
    
    // Reset to default view - with safety check
    if (selection) {
      selection.setCurrentStep("default");
    }
    
    // Clear any selected category to ensure we return to the initial view
    if (sockerContext && sockerContext.resetEventSelection) {
      sockerContext.resetEventSelection();
    }
  };

  return {
    completeEventCreation,
    resetState,
    resetWizard
  };
}
