
import { useSoccer } from "@/context/SoccerContext";
import { useSelectionState } from "./wizard/useSelectionState";
import { useFlagLogic } from "./wizard/useFlagLogic";
import { useContextUpdater } from "./wizard/useContextUpdater";
import { useWizardHandlers } from "./wizard/useWizardHandlers";
import { WizardStateContextValue } from "./wizard/types";

export function useWizardState(): WizardStateContextValue {
  const soccerContext = useSoccer();
  
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
    sockerContext: soccerContext
  });

  // Simplified comprehensive reset function
  const resetWizard = () => {
    console.log("Starting simplified wizard reset...");
    
    // Store current team and player selections to preserve them
    const currentSelectedTeam = soccerContext.selectedTeam;
    const currentSelectedPlayer = soccerContext.selectedPlayer;
    
    // Reset selection state directly
    selection.resetSelectionState();
    
    // Reset flag state directly
    flagLogic.resetFlagLogic();
    
    // Reset soccer context but preserve team and player selections
    if (soccerContext && soccerContext.resetEventSelection) {
      soccerContext.resetEventSelection();
      
      // Restore team and player selections after context reset
      if (currentSelectedTeam && soccerContext.setSelectedTeam) {
        soccerContext.setSelectedTeam(currentSelectedTeam);
      }
      if (currentSelectedPlayer && soccerContext.setSelectedPlayer) {
        soccerContext.setSelectedPlayer(currentSelectedPlayer);
      }
    }
    
    // Validate reset state
    setTimeout(() => {
      validateResetState(currentSelectedTeam, currentSelectedPlayer);
    }, 100);
    
    console.log("Simplified wizard reset completed");
  };

  // Simplified state validation function
  const validateResetState = (expectedTeam?: any, expectedPlayer?: any) => {
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
        flagValues: Object.keys(flagLogic.flagValues).length === 0,
        flagConditions: flagLogic.flagConditions.length === 0
      },
      soccerContext: {
        selectedTeam: expectedTeam ? soccerContext.selectedTeam === expectedTeam : true,
        selectedPlayer: expectedPlayer ? soccerContext.selectedPlayer === expectedPlayer : true
      }
    };
    
    const allValid = Object.values(validationResults.selection).every(Boolean) &&
                    Object.values(validationResults.flagLogic).every(Boolean) &&
                    Object.values(validationResults.soccerContext).every(Boolean);
    
    if (allValid) {
      console.log("✅ Simplified wizard reset validation PASSED - all state correctly reset");
      console.log(`currentStep: ${selection.currentStep} (expected: default)`);
      console.log(`selectedCategory: ${selection.selectedCategory} (expected: null)`);
      console.log(`flagsForLabel: ${flagLogic.flagsForLabel.length} items (expected: 0)`);
      console.log(`flagConditions: ${flagLogic.flagConditions.length} items (expected: 0)`);
      console.log(`flagValues: ${Object.keys(flagLogic.flagValues).length} items (expected: 0)`);
      console.log(`selectedTeam preserved: ${soccerContext.selectedTeam}`);
      console.log(`selectedPlayer preserved: ${soccerContext.selectedPlayer?.number || 'none'}`);
    } else {
      console.warn("❌ Simplified wizard reset validation FAILED:", validationResults);
      console.warn("Current state values:", {
        currentStep: selection.currentStep,
        selectedCategory: selection.selectedCategory,
        selectedEvent: selection.selectedEvent,
        selectedEventName: selection.selectedEventName,
        flagsForLabel: flagLogic.flagsForLabel.length,
        availableFlags: flagLogic.availableFlags.length,
        currentFlagIndex: flagLogic.currentFlagIndex,
        flagValues: Object.keys(flagLogic.flagValues).length,
        flagConditions: flagLogic.flagConditions.length,
        selectedTeam: soccerContext.selectedTeam,
        selectedPlayer: soccerContext.selectedPlayer?.number || 'none'
      });
    }
  };

  // Return the simplified public API
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
