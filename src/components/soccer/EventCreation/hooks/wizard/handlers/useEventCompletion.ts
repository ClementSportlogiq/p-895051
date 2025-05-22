
import { useToast } from "@/hooks/use-toast";
import { useEventValidation } from "./validation/useEventValidation";
import { useEventPayload } from "./event/useEventPayload";
import { useWizardReset } from "./reset/useWizardReset";
import { TeamType, GameEvent, Player } from "@/context/SoccerContext";

interface UseEventCompletionProps {
  selection: any;
  sockerContext: any;
  flagLogic: any;
  gameTime?: string;
  videoTime?: string;
  loggedVideoTime?: string;
  setLoggedVideoTime?: (time: string) => void;
}

export function useEventCompletion({ 
  selection, 
  sockerContext, 
  flagLogic,
  gameTime = "",
  videoTime = "",
  loggedVideoTime = "",
  setLoggedVideoTime
}: UseEventCompletionProps) {
  const { toast } = useToast();
  
  // Use extracted modules
  const { validateEvent } = useEventValidation({ sockerContext });
  const { createEventPayload } = useEventPayload({ 
    sockerContext, 
    gameTime, 
    videoTime, 
    loggedVideoTime 
  });
  const { resetWizard } = useWizardReset({ selection, flagLogic });

  // Complete the event creation with all validation and proper event creation
  const completeEventCreation = () => {
    console.log("Completing event creation with flags:", flagLogic.flagValues);
    
    // Validate required fields first
    if (!validateEvent()) {
      console.log("Event validation failed during flag completion");
      return;
    }
    
    // Create the complete event payload
    const eventPayload = createEventPayload();
    if (!eventPayload) {
      console.error("Failed to create event payload");
      return;
    }
    
    // Add event to context
    try {
      sockerContext.addEvent(eventPayload);
      console.log("Event added:", eventPayload);
      
      // Reset the logged video time if applicable
      if (setLoggedVideoTime) {
        setLoggedVideoTime("");
      }
      
      // Reset wizard state first to ensure UI resets immediately
      resetWizard();
      
      // Then reset the soccer context
      setTimeout(() => {
        sockerContext.resetEventSelection();
        console.log("Soccer context reset completed after wizard reset");
      }, 0);
      
      // Show success toast
      toast({
        title: "Event Saved",
        description: `${eventPayload.eventName} event has been saved`
      });
      
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        title: "Error Saving Event",
        description: "There was a problem saving your event"
      });
    }
  };

  // Legacy method - now just calls resetWizard for backwards compatibility
  const resetState = () => {
    console.log("resetState called - redirecting to centralized resetWizard");
    resetWizard();
  };

  return {
    completeEventCreation,
    resetState,
    resetWizard
  };
}
