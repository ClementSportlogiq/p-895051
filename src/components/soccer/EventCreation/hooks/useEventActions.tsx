
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
  
  // Get the unified completion system with proper wizard integration
  const { completeEvent, cancelEvent } = useUnifiedEventCompletion({
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime,
    wizardState: {
      resetWizard: wizardState.resetWizard
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
    console.log("=== SAVE EVENT INITIATED ===");
    
    // Use unified completion with wizard's own reset function
    const success = completeEvent(() => {
      console.log("Using wizard's resetWizard for save completion");
      wizardState.resetWizard();
    });
    
    if (success) {
      console.log("=== SAVE EVENT COMPLETED SUCCESSFULLY ===");
    } else {
      console.log("=== SAVE EVENT FAILED ===");
    }
  };

  const handleCancelEvent = () => {
    console.log("=== CANCEL EVENT INITIATED ===");
    
    // Use unified cancellation with wizard's own reset function
    cancelEvent(() => {
      console.log("Using wizard's resetWizard for cancel");
      wizardState.resetWizard();
    });
    
    console.log("=== CANCEL EVENT COMPLETED ===");
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
