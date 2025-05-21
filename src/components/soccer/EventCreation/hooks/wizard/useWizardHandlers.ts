
import { useState } from "react";
import { AnnotationLabel, EventCategory } from "@/types/annotation";

export function useWizardHandlers({ 
  selection, 
  flagLogic, 
  sockerContext 
}) {
  // Handle category selection
  const handleCategorySelect = (category: EventCategory) => {
    selection.setSelectedCategory(category);
  };

  // Handle event selection for quick events
  const handleQuickEventSelect = (eventId: string) => {
    const { getLabelsByCategory, getQuickEvents } = sockerContext.annotationLabels;
    
    // Find the event in all categories
    const allEvents = getQuickEvents();
    const event = allEvents.find(evt => evt.id === eventId);
    
    if (event) {
      handleEventSelect(event);
    }
  };

  // Handle event selection
  const handleEventSelect = (event: AnnotationLabel) => {
    selection.setSelectedEvent(event.id);
    
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
      determineNextStep(event);
    } else {
      // If no flags, go to pressure step
      selection.setCurrentStep("pressure");
    }
  };

  // Determine next step based on event selected
  const determineNextStep = (event: AnnotationLabel) => {
    const goToFlag = hasAvailableFlags(event);
    const goToBodyPart = needsBodyPartSelection(event);

    if (goToFlag) {
      selection.setCurrentStep("flag");
    } else if (goToBodyPart || goToPressure(event)) {
      // Some events go directly to body part selection (e.g. heading)
      if (goToBodyPart && !goToPressure(event)) {
        selection.setCurrentStep("bodyPart");
      } else {
        selection.setCurrentStep("pressure");
      }
    } else {
      // Return to default view if no additional info needed
      selection.setCurrentStep("default");
      handleBack(); // Complete the event and go back to start
    }
  };

  // Check if event needs pressure selection
  const goToPressure = (event: AnnotationLabel) => {
    const needsPressure = ["pass", "reception", "shot", "cross", "clearance"];
    return needsPressure.includes(event.id);
  };

  // Check if event needs body part selection
  const needsBodyPartSelection = (event: AnnotationLabel) => {
    const needsBodyPart = ["pass", "shot", "reception", "header", "cross", "clearance"];
    return needsBodyPart.includes(event.id);
  };

  // Check if event has available flags
  const hasAvailableFlags = (event: AnnotationLabel) => {
    return flagLogic.availableFlags.length > 0 && event.flags && event.flags.length > 0;
  };

  // Handle pressure selection
  const handlePressureSelect = (pressure: { id: string; name: string }) => {
    selection.setSelectedPressure(pressure.id);
    
    // Check if body part selection is needed
    if (needsBodyPartSelection({ id: selection.selectedEvent || "" } as AnnotationLabel)) {
      selection.setCurrentStep("bodyPart");
    } else {
      // If no body part needed, go to default view
      selection.setCurrentStep("default");
      completeEventCreation();
    }
  };

  // Handle body part selection
  const handleBodyPartSelect = (bodyPart: { id: string; name: string }) => {
    selection.setSelectedBodyPart(bodyPart.id);
    selection.setCurrentStep("default");
    completeEventCreation();
  };

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
        const conditionsForFlag = flagLogic.getFlagConditions(flagLogic.currentLabelId, currentFlag.id, value);
        
        if (conditionsForFlag.length > 0) {
          // Update available flags based on conditions
          const updatedAvailableFlags = flagLogic.determineAvailableFlags(
            flagLogic.flagsForLabel,
            flagLogic.getFlagConditions(flagLogic.currentLabelId)
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
            completeAndMoveOn();
          }
        } else {
          completeAndMoveOn();
        }
      }
    }
  };
  
  // Helper to move to next step after flags
  const completeAndMoveOn = () => {
    // Check if event needs body part or pressure selection
    const needsBodyPart = needsBodyPartSelection({ id: selection.selectedEvent || "" } as AnnotationLabel);
    const needsPressure = goToPressure({ id: selection.selectedEvent || "" } as AnnotationLabel);
    
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

  // Handle back button
  const handleBack = () => {
    // Logic for back button depends on current step
    if (selection.currentStep === "pressure") {
      // Go back to category view or default view
      if (selection.selectedEvent) {
        const hasFlags = flagLogic.flagsForLabel.length > 0;
        if (hasFlags) {
          selection.setCurrentStep("flag");
          flagLogic.setCurrentFlagIndex(Math.max(0, flagLogic.flagsForLabel.length - 1));
        } else {
          selection.setCurrentStep("default");
        }
      } else {
        selection.setCurrentStep("default");
      }
    } else if (selection.currentStep === "bodyPart") {
      // Go back to pressure or flag step
      if (selection.selectedPressure) {
        selection.setCurrentStep("pressure");
      } else {
        const hasFlags = flagLogic.flagsForLabel.length > 0;
        if (hasFlags) {
          selection.setCurrentStep("flag");
          flagLogic.setCurrentFlagIndex(Math.max(0, flagLogic.flagsForLabel.length - 1));
        } else {
          selection.setCurrentStep("default");
        }
      }
    } else if (selection.currentStep === "flag") {
      // Go back to previous flag or default view
      if (flagLogic.currentFlagIndex > 0) {
        flagLogic.setCurrentFlagIndex(flagLogic.currentFlagIndex - 1);
      } else {
        selection.setCurrentStep("default");
      }
    } else {
      // From default view with a category selected, go back to main categories
      if (selection.selectedCategory) {
        selection.setSelectedCategory(null);
      }
    }
  };

  // Utility to get flag name by ID
  const getFlagNameById = (flags: any[], flagId: string): string => {
    const flag = flags.find(f => f.id === flagId);
    return flag ? flag.name : flagId;
  };

  // Reset wizard - exposed publicly for the WizardStateContextValue
  const resetWizard = () => {
    resetState();
    // Reset to default view
    selection.setCurrentStep("default");
  };

  return {
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handlePressureSelect,
    handleBodyPartSelect,
    handleFlagValueSelect,
    handleBack,
    getFlagNameById,
    resetWizard // Export the resetWizard function
  };
}

export default useWizardHandlers;
