
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
    selectedEventType,
    resetEventSelection
  } = useSoccer();
  
  // Get access to wizard state for proper reset
  const { resetWizard } = useWizardState();
  
  // Get the unified completion system
  const { completeEvent, cancelEvent } = useUnifiedEventCompletion({
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
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
    
    // Use unified completion with custom reset that includes wizard reset
    const success = completeEvent(() => {
      resetWizard();
    });
    
    if (success) {
      console.log("Event saved successfully, state reset");
    }
  };

  const handleCancelEvent = () => {
    // Use unified cancellation with custom reset that includes wizard reset
    cancelEvent(() => {
      resetEventSelection();
      resetWizard();
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
