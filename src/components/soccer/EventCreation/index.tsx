
import React, { useEffect, useState } from "react";
import KeyActorSelector from "./KeyActorSelector";
import EventTree from "./EventTree";
import LocationPicker from "./LocationPicker";
import { useSoccer } from "@/context/SoccerContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export const EventCreation: React.FC = () => {
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
  const [gameTime, setGameTime] = useState<string>("05:30");
  const [videoTime, setVideoTime] = useState<string>("00:00:00:00");
  const [loggedVideoTime, setLoggedVideoTime] = useState<string>("");

  // One-time handler for initial video time
  useEffect(() => {
    const handleInitialTimeUpdate = (e: CustomEvent) => {
      if (!loggedVideoTime) {
        setLoggedVideoTime(e.detail.videoTime);
      }
    };

    window.addEventListener("videoTimeUpdate", handleInitialTimeUpdate as EventListener);
    
    // Request current video time
    const timeUpdateEvent = new CustomEvent("getVideoTimeRequest");
    window.dispatchEvent(timeUpdateEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener("videoTimeUpdate", handleInitialTimeUpdate as EventListener);
    };
  }, [loggedVideoTime]);

  // Separate effect for current time (for display/save purposes)
  useEffect(() => {
    const handleTimeUpdate = (e: CustomEvent) => {
      setGameTime(e.detail.gameTime);
      setVideoTime(e.detail.videoTime);
    };

    const handleGetVideoTime = () => {
      if (!loggedVideoTime) {
        // Dispatch an event to request current video time
        const timeUpdateEvent = new CustomEvent("getVideoTimeRequest");
        window.dispatchEvent(timeUpdateEvent);
      }
    };

    window.addEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
    window.addEventListener("getVideoTime", handleGetVideoTime as EventListener);
    
    return () => {
      window.removeEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
      window.removeEventListener("getVideoTime", handleGetVideoTime as EventListener);
    };
  }, [loggedVideoTime]);

  // Update logged time when user selects an event category
  useEffect(() => {
    if (selectedEventCategory && !loggedVideoTime) {
      setLoggedVideoTime(videoTime);
    }
  }, [selectedEventCategory, videoTime, loggedVideoTime]);

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

  // Render event receipt based on selected data
  const renderEventReceipt = () => {
    // If no selections have been made, show the default message
    if (!selectedPlayer && !selectedEventCategory && !selectedEventType && !loggedVideoTime) {
      return (
        <div className="border min-h-7 gap-2 px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] border-solid text-[rgba(137,150,159,1)]">
          Select An Event
        </div>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        {selectedPlayer && (
          <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
            {selectedTeam} #{selectedPlayer.number} {selectedPlayer.name}
          </div>
        )}
        
        {loggedVideoTime && (
          <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
            {loggedVideoTime}
          </div>
        )}
        
        {selectedEventCategory && (
          <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
            {selectedEventCategory}
          </div>
        )}
        
        {selectedEventType && (
          <div className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 rounded-2xl">
            {selectedEventType}
          </div>
        )}
        
        {/* Show Pressure pill in inactive state if not selected */}
        {!selectedEventDetails?.pressure && selectedEventType && selectedEventType.includes("Pass") && (
          <div className="border px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] text-[rgba(137,150,159,1)]">
            Pressure
          </div>
        )}
        
        {/* Show Body Part pill in inactive state if not selected */}
        {!selectedEventDetails?.bodyPart && selectedEventType && selectedEventType.includes("Pass") && (
          <div className="border px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] text-[rgba(137,150,159,1)]">
            Body Part
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border min-h-[397px] w-full overflow-hidden mt-[19px] border-black border-solid max-md:max-w-full">
      <KeyActorSelector />
      <div className="flex min-h-[237px] w-full items-stretch flex-wrap border-black border-t max-md:max-w-full">
        <EventTree />
        <LocationPicker />
      </div>
      <div className="flex min-h-12 w-full items-center gap-2.5 text-base font-normal pl-4 border-black border-t max-md:max-w-full">
        {renderEventReceipt()}
      </div>
      <div className="bg-white border flex w-full gap-4 text-base font-normal flex-wrap p-4 border-black border-solid max-md:max-w-full">
        <button 
          onClick={handleSaveEvent}
          className="self-stretch bg-[rgba(137,150,159,1)] min-w-60 gap-2 text-white flex-1 shrink basis-[0%] px-2 py-1.5 max-md:max-w-full hover:bg-[#082340] transition-colors"
        >
          Save (B or Enter)
        </button>
        <button 
          onClick={handleCancelEvent} 
          className="self-stretch bg-white border min-w-60 gap-2 text-[rgba(34,34,34,1)] flex-1 shrink basis-[0%] px-2 py-1.5 border-[rgba(137,150,159,1)] border-solid max-md:max-w-full hover:bg-gray-100 transition-colors"
        >
          Cancel (ESC)
        </button>
      </div>
    </div>
  );
};

export default EventCreation;
