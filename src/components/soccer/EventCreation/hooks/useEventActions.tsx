
import { useSoccer } from "@/context/SoccerContext";
import { 
  useEventValidation, 
  useKeyboardShortcuts,
  useVideoTimeCapture
} from "./eventActions";
import { useWizardState } from "./useWizardState";
import { useEventCompletion } from "./wizard/handlers/useEventCompletion";

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
  const sockerContext = useSoccer();
  
  // Get access to wizard state for proper reset
  const wizardState = useWizardState();
  const { resetWizard, selection, flagLogic } = wizardState;
  
  // Use the unified event completion hook
  const { completeEventCreation } = useEventCompletion({
    selection,
    sockerContext,
    flagLogic,
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  });
  
  // Capture video time when event type is selected (changed from category to type)
  useVideoTimeCapture({
    selectedEventType: sockerContext.selectedEventType,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  });

  const handleSaveEvent = () => {
    console.log("Save button clicked, delegating to completeEventCreation");
    completeEventCreation();
  };

  const handleCancelEvent = () => {
    console.log("Cancel event handler called directly");
    
    // Clear any logged video time
    setLoggedVideoTime("");
    
    // Reset wizard state first to ensure UI resets immediately
    console.log("Calling resetWizard from handleCancelEvent");
    resetWizard(); 
    
    // Reset soccer context state after wizard reset
    setTimeout(() => {
      sockerContext.resetEventSelection();
      console.log("Soccer context reset completed after wizard reset");
    }, 0);
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
