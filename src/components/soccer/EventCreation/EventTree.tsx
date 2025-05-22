
import React, { useEffect } from "react";
import EventWizard from "./EventWizard";
import { useSoccer } from "@/context/SoccerContext";
import { useWizardState } from "./hooks/useWizardState";

export const EventTree: React.FC = () => {
  const { resetEventSelection } = useSoccer();
  const { resetWizard } = useWizardState();
  
  // Listen for cancel event to reset the event tree
  useEffect(() => {
    const handleCancelEvent = () => {
      console.log("Cancel event detected in EventTree, resetting wizard state");
      
      // First reset the wizard state to ensure UI is properly reset
      resetWizard();
      
      // Then reset the soccer context
      setTimeout(() => {
        resetEventSelection();
        console.log("EventTree: Soccer context reset completed after wizard reset");
      }, 0);
    };
    
    window.addEventListener("cancelEvent", handleCancelEvent);
    
    return () => {
      window.removeEventListener("cancelEvent", handleCancelEvent);
    };
  }, [resetEventSelection, resetWizard]);

  return <EventWizard />;
};

export default EventTree;
