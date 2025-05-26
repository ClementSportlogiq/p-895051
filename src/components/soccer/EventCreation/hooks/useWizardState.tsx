
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

  // Unified reset function that handles all wizard state
  const resetWizard = () => {
    try {
      // Reset selection state
      selection.setSelectedCategory(null);
      selection.setSelectedEvent(null);
      selection.setSelectedEventName(null);
      selection.setFlagConditions([]);
      selection.setCurrentStep("default");
      
      // Reset flag state
      flagLogic.setCurrentLabelId("");
      flagLogic.setFlagsForLabel([]);
      flagLogic.setCurrentFlagIndex(0);
      flagLogic.setFlagValues({});
      flagLogic.setAvailableFlags([]);
      
      // Reset soccer context
      sockerContext.resetEventSelection();
      
      console.log("Wizard state fully reset");
    } catch (error) {
      console.error("Error in wizard reset:", error);
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
