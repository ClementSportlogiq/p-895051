
import { useMemo } from "react";
import { useBasicEventHandlers } from "./handlers/useBasicEventHandlers";
import { useBackHandler } from "./handlers/useBackHandler";
import { useFlagHandlers } from "./handlers/useFlagHandlers";
import { useEventNavigation } from "./handlers/useEventNavigation";
import { useEventCompletion } from "./handlers/useEventCompletion";
import { useSelectionHandlers } from "./handlers/useSelectionHandlers";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { AnnotationLabel } from "@/types/annotation";

interface UseWizardHandlersProps {
  selection: any;
  flagLogic: any;
  sockerContext: any;
}

export function useWizardHandlers({ selection, flagLogic, sockerContext }: UseWizardHandlersProps) {
  const { labels, getLabelsByCategory } = useAnnotationLabels();
  
  // Event completion handler for passing to various hooks
  const { completeEventCreation, resetWizard, resetState } = useEventCompletion({
    selection,
    flagLogic,
    sockerContext
  });
  
  // Basic event handlers
  const basicHandlers = useBasicEventHandlers({
    selection,
    sockerContext
  });
  
  // Flag handlers
  const flagHandlers = useFlagHandlers({
    selection,
    flagLogic,
    completeAndMoveOn: completeEventCreation
  });
  
  // Selection handlers (pressure and body part)
  const selectionHandlers = useSelectionHandlers({
    selection,
    sockerContext,
    completeEventCreation
  });
  
  // Back button handler
  const { handleBack } = useBackHandler({
    selection,
    flagLogic
  });
  
  // Event navigation
  const navigation = useEventNavigation({
    selection,
    flagLogic
  });
  
  // Define a custom event select handler that incorporates navigation logic and flag conditions
  const handleEventSelect = (event: AnnotationLabel) => {
    // Call the basic handler first to set the selected event
    basicHandlers.handleEventSelect(event);
    
    // Update flag conditions from selected event
    if (event && event.flag_conditions) {
      flagLogic.setFlagConditions(event.flag_conditions);
    } else {
      flagLogic.setFlagConditions([]);
    }
    
    // Determine and set the next step based on the selected event
    navigation.determineNextStep(event);
    
    // Set flag-related state if needed
    if (event.flags && event.flags.length > 0) {
      flagLogic.setCurrentLabelId(event.id);
      flagLogic.setFlagsForLabel(event.flags);
    }
  };
  
  return {
    ...basicHandlers,
    ...flagHandlers,
    ...selectionHandlers,
    handleBack,
    handleEventSelect,
    resetWizard,
    resetState // Explicitly expose resetState
  };
}
