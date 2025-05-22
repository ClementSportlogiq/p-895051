
export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Complete the event creation
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic.flagValues);
    
    // Safety check for selection and sockerContext
    if (!selection || !sockerContext) {
      console.error("Missing selection or sockerContext in completeEventCreation");
      return;
    }
    
    // Save event to context
    const eventData = {
      category: selection.selectedCategory,
      eventId: selection.selectedEvent,
      pressure: selection.selectedPressure,
      bodyPart: selection.selectedBodyPart,
      flags: flagLogic?.flagValues || {}
    };
    
    // Add to events list - with safety check
    if (sockerContext.addEvent && eventData.eventId) {
      try {
        sockerContext.addEvent(eventData);
        
        // Reset after adding - call resetWizard instead of resetState
        resetWizard();
        console.log("Event created and wizard reset");
      } catch (error) {
        console.error("Error adding event:", error);
      }
    } else {
      console.warn("Could not add event: addEvent function or eventId is missing");
    }
  };

  // Reset wizard state
  const resetState = () => {
    try {
      // Reset selection state
      if (selection) {
        selection.setSelectedCategory(null);
        selection.setSelectedEvent(null);
        selection.setSelectedEventName(null);
        selection.setSelectedPressure(null);
        selection.setSelectedBodyPart(null);
      }
      
      // Reset flag state
      if (flagLogic) {
        flagLogic.setCurrentLabelId("");
        flagLogic.setFlagsForLabel([]);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
        // Also reset flag conditions to prevent issues with subsequent events
        flagLogic.setFlagConditions([]);
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
  };

  return {
    completeEventCreation,
    resetState,
    resetWizard
  };
}
