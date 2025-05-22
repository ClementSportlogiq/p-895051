
import { useMemo } from "react";
import { useBasicEventHandlers } from "./handlers/useBasicEventHandlers";
import { useBackHandler } from "./handlers/useBackHandler";
import { useFlagHandlers } from "./handlers/useFlagHandlers";
import { useEventNavigation } from "./handlers/useEventNavigation";
import { useEventCompletion } from "./handlers/useEventCompletion";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { AnnotationLabel } from "@/types/annotation";

interface UseWizardHandlersProps {
  selection: any;
  flagLogic: any;
  sockerContext: any;
}

export function useWizardHandlers({ selection, flagLogic, sockerContext }: UseWizardHandlersProps) {
  const { labels, getLabelsByCategory } = useAnnotationLabels();
  
  // Basic event handlers
  const basicHandlers = useBasicEventHandlers({
    selection,
    sockerContext
  });
  
  // Flag handlers
  const flagHandlers = useFlagHandlers({
    selection,
    flagLogic
  });
  
  // Back button handler
  const { handleBack } = useBackHandler({
    selection,
    flagLogic
  });
  
  // Event navigation
  const { handleEventSelect } = useEventNavigation({
    selection,
    flagLogic
  });
  
  // Event completion handler
  const { resetWizard } = useEventCompletion({
    selection,
    flagLogic
  });
  
  // Define an enhanced event select handler that also loads flag conditions
  const handleEventSelectWithConditions = (event: AnnotationLabel) => {
    // Update flag conditions from selected event
    if (event && event.flag_conditions) {
      flagLogic.setFlagConditions(event.flag_conditions);
    } else {
      flagLogic.setFlagConditions([]);
    }
    
    // Call original handler
    handleEventSelect(event);
  };
  
  return {
    ...basicHandlers,
    ...flagHandlers,
    handleBack,
    handleEventSelect: handleEventSelectWithConditions,
    resetWizard
  };
}
