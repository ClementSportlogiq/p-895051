
export function useEventCompletion({ selection, sockerContext, flagLogic }) {
  // Complete the event creation
  const completeEventCreation = () => {
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
      
      // Reset after adding
      resetState();
    }
  };

  // Reset wizard state
  const resetState = () => {
    selection.setSelectedCategory(null);
    selection.setSelectedEvent(null);
    selection.setSelectedPressure(null);
    selection.setSelectedBodyPart(null);
    flagLogic.setCurrentLabelId("");
    flagLogic.setFlagsForLabel([]);
    flagLogic.setCurrentFlagIndex(0);
    flagLogic.setFlagValues({});
    flagLogic.setAvailableFlags([]);
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
