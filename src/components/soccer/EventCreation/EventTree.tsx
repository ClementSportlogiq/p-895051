
import React, { useEffect } from "react";
import EventWizard from "./EventWizard";
import { useSoccer } from "@/context/SoccerContext";
import { useWizardState } from "./hooks/useWizardState";

export const EventTree: React.FC = () => {
  const { resetEventSelection } = useSoccer();
  
  // CRITICAL FIX: Get resetCounter from useWizardState to force EventWizard remounting
  const { resetCounter } = useWizardState();
  
  // Listen for cancel event to reset the event tree
  useEffect(() => {
    const handleCancelEvent = () => {
      console.log("Cancel event detected in EventTree, resetting");
      resetEventSelection();
    };
    
    window.addEventListener("cancelEvent", handleCancelEvent);
    
    return () => {
      window.removeEventListener("cancelEvent", handleCancelEvent);
    };
  }, [resetEventSelection]);

  // CRITICAL FIX: Add key prop to force EventWizard remounting on state reset
  return <EventWizard key={`wizard-${resetCounter}`} />;
};

export default EventTree;
