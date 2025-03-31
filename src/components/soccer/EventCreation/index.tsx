
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
    addEvent 
  } = useSoccer();
  const { toast } = useToast();
  const [gameTime, setGameTime] = useState<string>("05:30");
  const [videoTime, setVideoTime] = useState<string>("00:00:00:00");

  // Update times from video player
  useEffect(() => {
    const handleTimeUpdate = (e: CustomEvent) => {
      setGameTime(e.detail.gameTime);
      setVideoTime(e.detail.videoTime);
    };

    window.addEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
    return () => {
      window.removeEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
    };
  }, []);

  // Handle save button and keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "b" || e.key === "B") {
        handleSaveEvent();
      }
      if (e.key === "Escape") {
        // Handle cancel
        toast({
          title: "Event creation cancelled",
          description: "The event creation has been cancelled"
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPlayer, selectedTeam, selectedLocation]);

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

    const eventName = `${selectedPlayer.number} ${selectedPlayer.name} (${selectedTeam})`;
    
    addEvent({
      id: uuidv4(),
      gameTime,
      videoTime,
      player: selectedPlayer,
      team: selectedTeam,
      location: selectedLocation,
      eventName,
      eventDetails: "Event Details"
    });

    toast({
      title: "Event Saved",
      description: `${eventName} event has been saved`
    });
  };

  return (
    <div className="bg-white border min-h-[397px] w-full overflow-hidden mt-[19px] border-black border-solid max-md:max-w-full">
      <KeyActorSelector />
      <div className="flex min-h-[237px] w-full items-stretch flex-wrap border-black border-t max-md:max-w-full">
        <EventTree />
        <LocationPicker />
      </div>
      <div className="flex min-h-12 w-full items-center gap-2.5 text-base text-[rgba(137,150,159,1)] font-normal pl-4 border-black border-t max-md:max-w-full">
        <div className="self-stretch border min-h-7 gap-2 my-auto px-3 py-1 rounded-2xl border-[rgba(137,150,159,1)] border-solid">
          {selectedPlayer 
            ? `Selected: ${selectedPlayer.number} ${selectedPlayer.name} (${selectedTeam})` 
            : "Select An Event"}
        </div>
      </div>
      <div className="bg-white border flex w-full gap-4 text-base font-normal flex-wrap p-4 border-black border-solid max-md:max-w-full">
        <button 
          onClick={handleSaveEvent}
          className="self-stretch bg-[rgba(137,150,159,1)] min-w-60 gap-2 text-white flex-1 shrink basis-[0%] px-2 py-1.5 max-md:max-w-full hover:bg-[#082340] transition-colors"
        >
          Save (B or Enter)
        </button>
        <button className="self-stretch bg-white border min-w-60 gap-2 text-[rgba(34,34,34,1)] flex-1 shrink basis-[0%] px-2 py-1.5 border-[rgba(137,150,159,1)] border-solid max-md:max-w-full hover:bg-gray-100 transition-colors">
          Cancel (ESC)
        </button>
      </div>
    </div>
  );
};

export default EventCreation;
