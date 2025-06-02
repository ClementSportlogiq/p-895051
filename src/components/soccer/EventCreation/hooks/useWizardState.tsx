
import { useSoccer } from "@/context/SoccerContext";
import { useSelectionState } from "./wizard/useSelectionState";
import { useFlagLogic } from "./wizard/useFlagLogic";
import { useContextUpdater } from "./wizard/useContextUpdater";
import { useWizardHandlers } from "./wizard/useWizardHandlers";
import { WizardStateContextValue } from "./wizard/types";

export function useWizardState(): WizardStateContextValue {
  const sockerContext = useSoccer();
  
  // Get state from modular hooks
  const selection = useSelectionState();
  const flagLogic = useFlagLogic();
  
  // Update context based on current selections
  useContextUpdater({
    selectedEvent: selection.selectedEvent,
    selectedEventName: selection.selectedEventName,
    selectedCategory: selection.selectedCategory,
    flagValues: flagLogic.flagValues
  });

  // Get handlers
  const handlers = useWizardHandlers({
    selection,
    flagLogic,
    sockerContext
  });

  // Enhanced comprehensive reset function with state validation
  const resetWizard = () => {
    try {
      console.log("Starting comprehensive wizard reset...");
      
      // Reset selection state using its own reset function
      if (selection.resetSelectionState) {
        selection.resetSelectionState();
      } else {
        // Fallback to manual reset
        selection.setSelectedCategory(null);
        selection.setSelectedEvent(null);
        selection.setSelectedEventName(null);
        selection.setFlagConditions([]);
        selection.setCurrentStep("default");
      }
      
      // Reset flag state using its own reset function
      if (flagLogic.resetFlagLogic) {
        flagLogic.resetFlagLogic();
      } else {
        // Fallback to manual reset
        flagLogic.setCurrentLabelId(null);
        flagLogic.setFlagsForLabel([]);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
        flagLogic.setFlagConditions([]);
      }
      
      // Reset soccer context with null check
      if (sockerContext && sockerContext.resetEventSelection) {
        sockerContext.resetEventSelection();
      }
      
      // Validate reset state after a brief delay to ensure all state updates have completed
      setTimeout(() => {
        validateResetState();
      }, 100);
      
      console.log("Wizard state comprehensive reset completed");
    } catch (error) {
      console.error("Error in wizard reset:", error);
    }
  };

  // State validation function to ensure complete reset
  const validateResetState = () => {
    const validationResults = {
      selection: {
        currentStep: selection.currentStep === "default",
        selectedCategory: selection.selectedCategory === null,
        selectedEvent: selection.selectedEvent === null,
        selectedEventName: selection.selectedEventName === null,
        flagConditions: selection.flagConditions.length === 0
      },
      flagLogic: {
        currentLabelId: flagLogic.currentLabelId === null,
        flagsForLabel: flagLogic.flagsForLabel.length === 0,
        availableFlags: flagLogic.availableFlags.length === 0,
        currentFlagIndex: flagLogic.currentFlagIndex === 0,
        flagValues: Object.keys(flagLogic.flagValues).length === 0
      }
    };
    
    const allValid = Object.values(validationResults.selection).every(Boolean) &&
                    Object.values(validationResults.flagLogic).every(Boolean);
    
    if (allValid) {
      console.log("✅ Wizard reset validation PASSED - all state properly reset");
    } else {
      console.warn("❌ Wizard reset validation FAILED:", validationResults);
      console.warn("Current state values:", {
        selection: {
          currentStep: selection.currentStep,
          selectedCategory: selection.selectedCategory,
          selectedEvent: selection.selectedEvent,
          selectedEventName: selection.selectedEventName,
          flagConditions: selection.flagConditions
        },
        flagLogic: {
          currentLabelId: flagLogic.currentLabelId,
          flagsForLabel: flagLogic.flagsForLabel,
          availableFlags: flagLogic.availableFlags,
          currentFlagIndex: flagLogic.currentFlagIndex,
          flagValues: flagLogic.flagValues
        }
      });
    }
  };

  // Return the public API with all required properties
  return {
    currentStep: selection.currentStep,
    selectedCategory: selection.selectedCategory,
    selectedEvent: selection.selectedEvent,
    selectedEventName: selection.selectedEventName,
    currentLabelId: flagLogic.currentLabelId,
    flagsForLabel: flagLogic.flagsForLabel,
    availableFlags: flagLogic.availableFlags,
    currentFlagIndex: flagLogic.currentFlagIndex,
    flagConditions: selection.flagConditions,
    handleCategorySelect: handlers.handleCategorySelect,
    handleQuickEventSelect: handlers.handleQuickEventSelect,
    handleEventSelect: handlers.handleEventSelect,
    handleFlagValueSelect: handlers.handleFlagValueSelect,
    handleBack: handlers.handleBack,
    resetWizard
  };
}
