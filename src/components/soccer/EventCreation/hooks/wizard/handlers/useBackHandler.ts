
export function useBackHandler({ selection, flagLogic }) {
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

  return { handleBack };
}
