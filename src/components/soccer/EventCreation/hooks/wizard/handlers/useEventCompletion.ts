
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
        
        // Reset after adding
        resetWizard();
        console.log("Event created and wizard reset");
      } catch (error) {
        console.error("Error adding event:", error);
      }
    } else {
      console.warn("Could not add event: addEvent function or eventId is missing");
    }
  };

  // Reset all wizard state - thorough reset of all state variables
  const resetWizard = () => {
    console.log("resetWizard called - forcing complete wizard state reset");
    
    try {
      // Reset selection state - order matters for UI update
      // First reset the currentStep to ensure view changes immediately
      if (selection) {
        console.log("Before reset - currentStep:", selection.currentStep, "selectedCategory:", selection.selectedCategory);
        
        // Reset step first to trigger UI update
        selection.setCurrentStep("default");
        
        // Then reset all other selection states
        selection.setSelectedCategory(null);
        selection.setSelectedEvent(null);
        selection.setSelectedEventName(null);
        selection.setSelectedPressure(null);
        selection.setSelectedBodyPart(null);
        selection.setFlagConditions([]);
        
        console.log("After reset - currentStep:", "default", "selectedCategory:", null);
      }
      
      // Reset flag state
      if (flagLogic) {
        flagLogic.setCurrentLabelId("");
        flagLogic.setFlagsForLabel([]);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
      }
      
      // Force a UI update with a small delay if needed
      setTimeout(() => {
        console.log("Verifying reset state - currentStep should be 'default'");
        if (selection) {
          console.log("Verification - currentStep:", selection.currentStep, "selectedCategory:", selection.selectedCategory);
        }
      }, 0);
      
    } catch (error) {
      console.error("Error in resetWizard:", error);
    }
  };

  // Legacy method - now just calls resetWizard for backwards compatibility
  const resetState = () => {
    console.log("resetState called - redirecting to centralized resetWizard");
    resetWizard();
  };

  return {
    completeEventCreation,
    resetState,
    resetWizard
  };
}
