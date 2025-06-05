
import React, { useEffect } from "react";
import EventWizard from "./EventWizard";
import { useSoccer } from "@/context/SoccerContext";

export const EventTree: React.FC = () => {
  const { resetEventSelection } = useSoccer();
  
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

  // Simplified: EventWizard no longer needs a key prop for forced remounting
  return <EventWizard />;
};

export default EventTree;
