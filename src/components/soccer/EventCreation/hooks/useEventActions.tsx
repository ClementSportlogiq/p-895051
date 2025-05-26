
import { useSoccer } from "@/context/SoccerContext";
import { useKeyboardShortcuts, useVideoTimeCapture } from "./eventActions";
import { useUnifiedEventCompletion } from "./useUnifiedEventCompletion";
import { useWizardState } from "./useWizardState";

interface UseEventActionsProps {
  gameTime: string;
  videoTime: string;
  loggedVideoTime: string;
  setLoggedVideoTime: (time: string) => void;
}

export function useEventActions({ 
  gameTime, 
  videoTime, 
  loggedVideoTime, 
  setLoggedVideoTime 
}: UseEventActionsProps) {
  const { 
    selectedEventType
  } = useSoccer();
  
  // Get access to wizard state for reset functionality
  const wizardState = useWizardState();
  
  // Get the unified completion system with wizard integration
  const { completeEvent, cancelEvent } = useUnifiedEventCompletion({
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime,
    wizardState: {
      selection: {
        setSelectedCategory: wizardState.handleCategorySelect ? () => wizardState.handleCategorySelect(null) : undefined,
        setSelectedEvent: () => {}, // This will be handled by the wizard reset
        setSelectedEventName: () => {}, // This will be handled by the wizard reset
        setFlagConditions: () => {}, // This will be handled by the wizard reset
        setCurrentStep: () => {} // This will be handled by the wizard reset
      },
      flagLogic: {} // Flag logic will be handled by the wizard reset
    }
  });

  // Capture video time when event type is selected
  useVideoTimeCapture({
    selectedEventType,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  });

  const handleSaveEvent = () => {
    console.log("Saving event...");
    
    // Use unified completion with wizard reset
    const success = completeEvent(() => {
      // Use the wizard's own reset function for complete state cleanup
      if (wizardState.resetWizard) {
        wizardState.resetWizard();
      }
    });
    
    if (success) {
      console.log("Event saved successfully, state reset");
    }
  };

  const handleCancelEvent = () => {
    // Use unified cancellation with wizard reset
    cancelEvent(() => {
      // Use the wizard's own reset function for complete state cleanup
      if (wizardState.resetWizard) {
        wizardState.resetWizard();
      }
    });
    
    console.log("Event creation cancelled, state reset");
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSaveEvent,
    onCancel: handleCancelEvent
  });

  return {
    handleSaveEvent,
    handleCancelEvent
  };
}

export default useEventActions;
