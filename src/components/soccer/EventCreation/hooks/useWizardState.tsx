
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
    selectedPressure: selection.selectedPressure,
    selectedBodyPart: selection.selectedBodyPart,
    selectedCategory: selection.selectedCategory,
    flagValues: flagLogic.flagValues
  });

  // Get handlers
  const handlers = useWizardHandlers({
    selection,
    flagLogic,
    sockerContext
  });

  // Return the public API
  return {
    currentStep: selection.currentStep,
    selectedCategory: selection.selectedCategory,
    selectedEvent: selection.selectedEvent,
    currentLabelId: flagLogic.currentLabelId,
    flagsForLabel: flagLogic.flagsForLabel,
    availableFlags: flagLogic.availableFlags,
    currentFlagIndex: flagLogic.currentFlagIndex,
    ...handlers,
    resetWizard: handlers.resetWizard // Explicitly include resetWizard
  };
}
