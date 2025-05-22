
export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Complete the event creation
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic.flagValues);
    
    // Save event to context
    const eventData = {
      category: selection.selectedCategory,
      eventId: selection.selectedEvent,
      pressure: selection.selectedPressure,
      bodyPart: selection.selectedBodyPart,
      flags: flagLogic.flagValues
    };
    
    // Add to events list
    if (sockerContext.addEvent && eventData.eventId) {
      sockerContext.addEvent(eventData);
      
      // Reset after adding - call resetWizard instead of resetState
      resetWizard();
      console.log("Event created and wizard reset");
    }
  };

  // Reset wizard state
  const resetState = () => {
    selection.setSelectedCategory(null);
    selection.setSelectedEvent(null);
    selection.setSelectedEventName(null);
    selection.setSelectedPressure(null);
    selection.setSelectedBodyPart(null);
    flagLogic.setCurrentLabelId("");
    flagLogic.setFlagsForLabel([]);
    flagLogic.setCurrentFlagIndex(0);
    flagLogic.setFlagValues({});
    flagLogic.setAvailableFlags([]);
    // Also reset flag conditions to prevent issues with subsequent events
    flagLogic.setFlagConditions([]);
    console.log("Wizard state fully reset");
  };

  // Reset wizard - exposed publicly for the WizardStateContextValue
  const resetWizard = () => {
    resetState();
    // Reset to default view
    selection.setCurrentStep("default");
  };

  return {
    completeEventCreation,
    resetState,
    resetWizard
  };
}
