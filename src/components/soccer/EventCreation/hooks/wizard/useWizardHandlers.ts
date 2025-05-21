
import { useState } from "react";
import { AnnotationLabel, EventCategory } from "@/types/annotation";
import { useBasicEventHandlers } from "./handlers/useBasicEventHandlers";
import { useEventNavigation } from "./handlers/useEventNavigation";
import { useSelectionHandlers } from "./handlers/useSelectionHandlers";
import { useFlagHandlers } from "./handlers/useFlagHandlers";
import { useEventCompletion } from "./handlers/useEventCompletion";
import { useBackHandler } from "./handlers/useBackHandler";

export function useWizardHandlers({ 
  selection, 
  flagLogic, 
  sockerContext 
}) {
  // Get basic event handlers (category and event selection)
  const basicHandlers = useBasicEventHandlers({ selection, sockerContext });
  
  // Get event completion functions
  const { completeEventCreation, resetState, resetWizard } = useEventCompletion({ 
    selection, 
    sockerContext, 
    flagLogic 
  });
  
  // Helper to move to next step after flags
  const completeAndMoveOn = () => {
    // Check if event needs body part or pressure selection
    const needsBodyPart = eventNavigation.needsBodyPartSelection({ id: selection.selectedEvent || "" } as AnnotationLabel);
    const needsPressure = eventNavigation.goToPressure({ id: selection.selectedEvent || "" } as AnnotationLabel);
    
    if (needsBodyPart && !needsPressure) {
      selection.setCurrentStep("bodyPart");
    } else if (needsPressure) {
      selection.setCurrentStep("pressure");
    } else {
      // If no additional steps needed, complete the event
      selection.setCurrentStep("default");
      completeEventCreation();
    }
  };
  
  // Get event navigation functions
  const eventNavigation = useEventNavigation({ 
    selection, 
    event: null, // We'll pass the event when calling
    flagLogic 
  });
  
  // Get selection handlers (pressure and body part)
  const selectionHandlers = useSelectionHandlers({
    selection,
    sockerContext,
    completeEventCreation
  });
  
  // Get flag handlers
  const flagHandlers = useFlagHandlers({
    flagLogic,
    selection,
    completeAndMoveOn
  });
  
  // Get back button handler
  const { handleBack } = useBackHandler({
    selection,
    flagLogic
  });
  
  // Override handleEventSelect to combine basic handler with navigation
  const handleEventSelect = (event: AnnotationLabel) => {
    // Use basic handler to set selection
    basicHandlers.handleEventSelect(event);
    
    // Setup flags if this event has them
    if (event.flags && event.flags.length > 0) {
      flagLogic.setCurrentLabelId(event.id);
      flagLogic.setFlagsForLabel(event.flags);
      flagLogic.setCurrentFlagIndex(0);
      
      // Process flags based on conditions
      const updatedAvailableFlags = flagLogic.determineAvailableFlags(
        event.flags,
        event.flag_conditions || []
      );
      flagLogic.setAvailableFlags(updatedAvailableFlags);
      
      // Next step in wizard based on flags and business logic
      eventNavigation.determineNextStep(event);
    } else {
      // If no flags, go to pressure step
      selection.setCurrentStep("pressure");
    }
  };
  
  return {
    handleCategorySelect: basicHandlers.handleCategorySelect,
    handleQuickEventSelect: basicHandlers.handleQuickEventSelect,
    handleEventSelect,
    handlePressureSelect: selectionHandlers.handlePressureSelect,
    handleBodyPartSelect: selectionHandlers.handleBodyPartSelect,
    handleFlagValueSelect: flagHandlers.handleFlagValueSelect,
    handleBack,
    getFlagNameById: flagHandlers.getFlagNameById,
    resetWizard
  };
}

export default useWizardHandlers;
