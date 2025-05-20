
import { useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

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
    selectedPlayer, 
    selectedTeam, 
    selectedLocation, 
    selectedEventCategory,
    selectedEventType,
    selectedEventDetails,
    addEvent,
    resetEventSelection
  } = useSoccer();
  
  const { toast } = useToast();

  // Update logged time when user selects an event category
  useEffect(() => {
    if (selectedEventCategory && !loggedVideoTime) {
      setLoggedVideoTime(videoTime);
    }
  }, [selectedEventCategory, videoTime, loggedVideoTime, setLoggedVideoTime]);

  // Handle save button and keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "b" || e.key === "B") {
        handleSaveEvent();
      }
      if (e.key === "Escape") {
        handleCancelEvent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPlayer, selectedTeam, selectedLocation, selectedEventType]);

  const handleSaveEvent = () => {
    if (!selectedPlayer) {
      toast({
        variant: "destructive",
        title: "Missing Player",
        description: "Please select a player before saving the event"
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Missing Location",
        description: "Please select a field location before saving the event"
      });
      return;
    }

    if (!selectedEventType) {
      toast({
        variant: "destructive",
        title: "Missing Event",
        description: "Please select an event before saving"
      });
      return;
    }

    const displayName = `${selectedPlayer.number} ${selectedPlayer.name} (${selectedTeam})`;
    
    addEvent({
      id: uuidv4(),
      gameTime,
      videoTime: loggedVideoTime || videoTime,
      player: selectedPlayer,
      team: selectedTeam,
      location: selectedLocation,
      eventName: displayName,
      eventDetails: selectedEventType,
      category: selectedEventCategory,
      additionalDetails: selectedEventDetails || undefined
    });

    // Reset the logged video time after adding event
    setLoggedVideoTime("");

    toast({
      title: "Event Saved",
      description: `${displayName} event has been saved`
    });
  };

  const handleCancelEvent = () => {
    resetEventSelection();
    setLoggedVideoTime("");
    toast({
      title: "Event cancelled",
      description: "The event creation has been cancelled"
    });
  };

  return {
    handleSaveEvent,
    handleCancelEvent
  };
}

export default useEventActions;
