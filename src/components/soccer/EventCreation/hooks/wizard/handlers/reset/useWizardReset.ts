
interface UseWizardResetProps {
  selection: any;
  flagLogic: any;
}

export function useWizardReset({ selection, flagLogic }: UseWizardResetProps) {
  
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

  return { resetWizard };
}
