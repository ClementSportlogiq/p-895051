
import { useSoccer, TeamType } from "@/context/SoccerContext";
import { useEventValidation } from "./eventActions/useEventValidation";
import { useSaveEvent } from "./eventActions/useSaveEvent";

interface UseUnifiedEventCompletionProps {
  gameTime?: string;
  videoTime?: string;
  loggedVideoTime?: string;
  setLoggedVideoTime?: (time: string) => void;
  // Optional context overrides for wizard usage
  contextOverrides?: {
    selectedPlayer?: any;
    selectedTeam?: TeamType;
    selectedLocation?: any;
    selectedEventCategory?: string;
    selectedEventType?: string;
    selectedEventDetails?: any;
  };
  // Optional wizard state for direct wizard resets
  wizardState?: {
    selection?: any;
    flagLogic?: any;
  };
}

export function useUnifiedEventCompletion({
  gameTime = "",
  videoTime = "",
  loggedVideoTime = "",
  setLoggedVideoTime,
  contextOverrides,
  wizardState
}: UseUnifiedEventCompletionProps = {}) {
  const soccerContext = useSoccer();
  const { validateEvent, toast } = useEventValidation();
  const { createEventPayload } = useSaveEvent();

  // Use context overrides if provided, otherwise use soccer context
  const getEffectiveContext = () => {
    if (contextOverrides) {
      return {
        selectedPlayer: contextOverrides.selectedPlayer ?? soccerContext.selectedPlayer,
        selectedTeam: contextOverrides.selectedTeam ?? soccerContext.selectedTeam,
        selectedLocation: contextOverrides.selectedLocation ?? soccerContext.selectedLocation,
        selectedEventCategory: contextOverrides.selectedEventCategory ?? soccerContext.selectedEventCategory,
        selectedEventType: contextOverrides.selectedEventType ?? soccerContext.selectedEventType,
        selectedEventDetails: contextOverrides.selectedEventDetails ?? soccerContext.selectedEventDetails
      };
    }
    return {
      selectedPlayer: soccerContext.selectedPlayer,
      selectedTeam: soccerContext.selectedTeam,
      selectedLocation: soccerContext.selectedLocation,
      selectedEventCategory: soccerContext.selectedEventCategory,
      selectedEventType: soccerContext.selectedEventType,
      selectedEventDetails: soccerContext.selectedEventDetails
    };
  };

  // Unified reset function that handles both wizard and non-wizard scenarios
  const performReset = () => {
    try {
      // Reset wizard state if provided
      if (wizardState) {
        // Reset selection state
        if (wizardState.selection) {
          wizardState.selection.setSelectedCategory(null);
          wizardState.selection.setSelectedEvent(null);
          wizardState.selection.setSelectedEventName(null);
          wizardState.selection.setFlagConditions([]);
          wizardState.selection.setCurrentStep("default");
        }
        
        // Reset flag state
        if (wizardState.flagLogic) {
          wizardState.flagLogic.setCurrentLabelId("");
          wizardState.flagLogic.setFlagsForLabel([]);
          wizardState.flagLogic.setCurrentFlagIndex(0);
          wizardState.flagLogic.setFlagValues({});
          wizardState.flagLogic.setAvailableFlags([]);
        }
      }
      
      // Always reset soccer context
      soccerContext.resetEventSelection();
      
      // Reset logged video time if setter is provided
      if (setLoggedVideoTime) {
        setLoggedVideoTime("");
      }
      
      console.log("Event state fully reset via unified system");
    } catch (error) {
      console.error("Error in unified reset:", error);
    }
  };

  const completeEvent = (customResetCallback?: () => void) => {
    const context = getEffectiveContext();
    
    console.log("Completing event with unified system...");
    
    // Validate event data
    if (!validateEvent(context.selectedPlayer, context.selectedLocation)) {
      console.log("Event validation failed");
      return false;
    }

    // Determine video time to use
    const videoTimeToUse = loggedVideoTime || videoTime;

    // Create event payload
    const eventPayload = createEventPayload(
      gameTime,
      videoTimeToUse,
      videoTime,
      context.selectedPlayer,
      context.selectedTeam as TeamType,
      context.selectedLocation,
      context.selectedEventCategory,
      context.selectedEventType,
      context.selectedEventDetails
    );
    
    try {
      // Add the event
      soccerContext.addEvent(eventPayload);
      console.log("Event added:", eventPayload);

      // Use custom reset callback if provided, otherwise use unified reset
      if (customResetCallback) {
        customResetCallback();
      } else {
        performReset();
      }

      // Show success toast
      toast({
        title: "Event Saved",
        description: `${context.selectedEventType || 'Event'} has been saved`
      });
      
      console.log("Event completed successfully via unified system");
      return true;
    } catch (error) {
      console.error("Error completing event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event"
      });
      return false;
    }
  };

  const cancelEvent = (customResetCallback?: () => void) => {
    // Use custom reset callback if provided, otherwise use unified reset
    if (customResetCallback) {
      customResetCallback();
    } else {
      performReset();
    }
    
    toast({
      title: "Event cancelled",
      description: "The event creation has been cancelled"
    });
    
    console.log("Event creation cancelled via unified system");
  };

  return {
    completeEvent,
    cancelEvent,
    performReset,
    validateEvent,
    createEventPayload
  };
}

export default useUnifiedEventCompletion;
