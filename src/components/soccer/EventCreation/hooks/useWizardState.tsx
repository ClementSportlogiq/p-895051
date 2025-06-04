
import { useSoccer } from "@/context/SoccerContext";
import { useSelectionState } from "./wizard/useSelectionState";
import { useFlagLogic } from "./wizard/useFlagLogic";
import { useContextUpdater } from "./wizard/useContextUpdater";
import { useWizardHandlers } from "./wizard/useWizardHandlers";
import { WizardStateContextValue } from "./wizard/types";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";

export function useWizardState(): WizardStateContextValue {
  const sockerContext = useSoccer();
  const { flags } = useAnnotationLabels();
  
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
      
      // Store current team and player selections to preserve them
      const currentSelectedTeam = sockerContext.selectedTeam;
      const currentSelectedPlayer = sockerContext.selectedPlayer;
      
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
        flagLogic.setFlagsForLabel(flags || []);
        flagLogic.setCurrentFlagIndex(0);
        flagLogic.setFlagValues({});
        flagLogic.setAvailableFlags([]);
        // Generate default flag conditions from available flags
        const defaultFlagConditions = (flags || []).flatMap(flag => 
          flag.values?.flatMap(value => ({
            flagId: flag.id,
            value: value.value,
            flagsToHideIds: []
          })) || []
        );
        flagLogic.setFlagConditions(defaultFlagConditions);
      }
      
      // Reset soccer context with null check, but preserve team and player selections
      if (sockerContext && sockerContext.resetEventSelection) {
        sockerContext.resetEventSelection();
        
        // Restore team and player selections after context reset
        if (currentSelectedTeam && sockerContext.setSelectedTeam) {
          sockerContext.setSelectedTeam(currentSelectedTeam);
        }
        if (currentSelectedPlayer && sockerContext.setSelectedPlayer) {
          sockerContext.setSelectedPlayer(currentSelectedPlayer);
        }
      }
      
      // Validate reset state after a brief delay to ensure all state updates have completed
      setTimeout(() => {
        validateResetState(currentSelectedTeam, currentSelectedPlayer);
      }, 100);
      
      console.log("Wizard state comprehensive reset completed");
    } catch (error) {
      console.error("Error in wizard reset:", error);
    }
  };

  // State validation function to ensure complete reset while preserving team/player selections
  const validateResetState = (expectedTeam?: any, expectedPlayer?: any) => {
    const expectedFlagsCount = (flags || []).length;
    // Calculate expected flag conditions count (all flag values combinations)
    const expectedFlagConditionsCount = (flags || []).reduce((total, flag) => 
      total + (flag.values?.length || 0), 0
    );
    
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
        flagsForLabel: flagLogic.flagsForLabel.length === expectedFlagsCount, // Should contain all available flags
        availableFlags: flagLogic.availableFlags.length === 0, // Should be empty until a label is selected
        currentFlagIndex: flagLogic.currentFlagIndex === 0,
        flagValues: Object.keys(flagLogic.flagValues).length === 0,
        flagConditions: flagLogic.flagConditions.length === expectedFlagConditionsCount // Should contain all default flag conditions
      },
      soccerContext: {
        // Team and player should retain their values, not be forced to null
        selectedTeam: expectedTeam ? sockerContext.selectedTeam === expectedTeam : true, // Should retain value if it existed
        selectedPlayer: expectedPlayer ? sockerContext.selectedPlayer === expectedPlayer : true // Should retain value if it existed
      }
    };
    
    const allValid = Object.values(validationResults.selection).every(Boolean) &&
                    Object.values(validationResults.flagLogic).every(Boolean) &&
                    Object.values(validationResults.soccerContext).every(Boolean);
    
    if (allValid) {
      console.log("✅ Wizard reset validation PASSED - all state properly reset");
      console.log(`flagsForLabel correctly contains ${flagLogic.flagsForLabel.length} default flags`);
      console.log(`flagConditions correctly contains ${flagLogic.flagConditions.length} default conditions`);
      console.log(`selectedTeam correctly preserved: ${sockerContext.selectedTeam}`);
      console.log(`selectedPlayer correctly preserved: ${sockerContext.selectedPlayer?.number || 'none'}`);
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
          flagsForLabel: `${flagLogic.flagsForLabel.length} flags (expected: ${expectedFlagsCount})`,
          availableFlags: flagLogic.availableFlags.length,
          currentFlagIndex: flagLogic.currentFlagIndex,
          flagValues: flagLogic.flagValues,
          flagConditions: `${flagLogic.flagConditions.length} conditions (expected: ${expectedFlagConditionsCount})`
        },
        soccerContext: {
          selectedTeam: sockerContext.selectedTeam,
          selectedPlayer: sockerContext.selectedPlayer?.number || 'none'
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
