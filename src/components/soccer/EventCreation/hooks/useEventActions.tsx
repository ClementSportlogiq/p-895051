
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
    
    // Use unified completion with the consolidated reset function
    const success = completeEvent(resetWizard);
    
    if (success) {
      console.log("Event saved successfully, state reset");
    }
  };

  const handleCancelEvent = () => {
    // Use unified cancellation with the consolidated reset function
    cancelEvent(resetWizard);
    
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
