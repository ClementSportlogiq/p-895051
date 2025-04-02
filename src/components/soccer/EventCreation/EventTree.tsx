
import React, { useState, useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";

type WizardStep = "quick" | "categories" | "events";
type EventCategory = "offense" | "defense" | "reception" | "goalkeeper" | "deadball" | "playerAction" | "infractions";

interface TreeEvent {
  id: string;
  name: string;
  hotkey: string;
}

export const EventTree: React.FC = () => {
  const { selectedPlayer, selectedTeam } = useSoccer();
  const [currentStep, setCurrentStep] = useState<WizardStep>("quick");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [videoTime, setVideoTime] = useState<string | null>(null);
  const [gameTime, setGameTime] = useState<string | null>(null);

  // Define event categories with their hotkeys
  const categories = [
    { id: "offense", name: "Offense", hotkey: "A" },
    { id: "defense", name: "Defense", hotkey: "S" },
    { id: "reception", name: "Reception/LBR", hotkey: "D" },
    { id: "goalkeeper", name: "Goalkeeper", hotkey: "F" },
    { id: "deadball", name: "Deadball", hotkey: "Z" },
    { id: "playerAction", name: "Player Action", hotkey: "X" },
    { id: "infractions", name: "Infractions", hotkey: "C" },
  ];

  // Define quick events with their hotkeys
  const quickEvents = [
    { id: "pass", name: "Pass", hotkey: "Q" },
    { id: "reception", name: "Reception", hotkey: "W" },
    { id: "lbr", name: "LBR", hotkey: "E" },
    { id: "interception", name: "Interception", hotkey: "R" },
  ];

  // Define offense events
  const offenseEvents = [
    { id: "dribble", name: "Dribble", hotkey: "Q" },
    { id: "cross", name: "Cross", hotkey: "W" },
    { id: "shot", name: "Shot", hotkey: "E" },
    { id: "goal", name: "Goal", hotkey: "R" },
  ];

  // Define defense events
  const defenseEvents = [
    { id: "tackle", name: "Tackle", hotkey: "Q" },
    { id: "block", name: "Block", hotkey: "W" },
    { id: "clearance", name: "Clearance", hotkey: "E" },
    { id: "deflection", name: "Deflection", hotkey: "R" },
  ];

  // Get current events based on the selected category
  const getCurrentEvents = () => {
    switch (selectedCategory) {
      case "offense":
        return offenseEvents;
      case "defense":
        return defenseEvents;
      // Add more cases for other categories as needed
      default:
        return [];
    }
  };

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

  // Handle hotkeys for event selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      // Quick events or first row (Q, W, E, R)
      if (currentStep === "quick" && ["Q", "W", "E", "R"].includes(key)) {
        const event = quickEvents.find(evt => evt.hotkey === key);
        if (event) {
          handleEventSelect(event);
        }
      } 
      // Categories or second row (A, S, D, F)
      else if ((currentStep === "quick" || currentStep === "categories") && ["A", "S", "D", "F"].includes(key)) {
        const category = categories.find(cat => cat.hotkey === key);
        if (category) {
          handleCategorySelect(category.id as EventCategory);
        }
      }
      // Third row (Z, X, C, V)
      else if (currentStep === "quick" && ["Z", "X", "C", "V"].includes(key)) {
        const category = categories.find(cat => cat.hotkey === key);
        if (category) {
          handleCategorySelect(category.id as EventCategory);
        }
      }
      // Event selection from category
      else if (currentStep === "events" && ["Q", "W", "E", "R"].includes(key)) {
        const events = getCurrentEvents();
        const event = events.find(evt => evt.hotkey === key);
        if (event) {
          handleEventSelect(event);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, selectedCategory]);

  const handleCategorySelect = (category: EventCategory) => {
    setSelectedCategory(category);
    setCurrentStep("events");
    // Log video time when category is selected
    if (!videoTime) {
      const event = new CustomEvent("getVideoTime", {});
      window.dispatchEvent(event);
    }
  };

  const handleEventSelect = (event: TreeEvent) => {
    setSelectedEvent(event.name);
    // Log video time if not already logged
    if (!videoTime) {
      const event = new CustomEvent("getVideoTime", {});
      window.dispatchEvent(event);
    }
  };

  const handleBack = () => {
    if (currentStep === "events") {
      setCurrentStep("categories");
      setSelectedCategory(null);
    } else {
      setCurrentStep("quick");
    }
    setSelectedEvent(null);
  };

  const renderButtonRow = (items: TreeEvent[]) => (
    <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
      {items.map((item) => (
        <button
          key={item.id}
          className="self-stretch bg-[rgba(8,35,64,1)] text-white gap-2 my-auto px-2 py-1.5 hover:bg-[#0e4f93] transition-colors"
          onClick={() => 
            item.id.includes("pass") || item.id.includes("reception") || item.id.includes("lbr") || item.id.includes("interception") 
              ? handleEventSelect(item) 
              : handleCategorySelect(item.id as EventCategory)
          }
        >
          {item.name} ({item.hotkey})
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      {/* Event Receipt - Shows selected details */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedPlayer && (
          <div className="bg-[#082340] px-2 py-1 rounded-md text-white">
            {selectedTeam} #{selectedPlayer.number} {selectedPlayer.name}
          </div>
        )}
        {videoTime && (
          <div className="bg-[#082340] px-2 py-1 rounded-md text-white">
            {videoTime}
          </div>
        )}
        {selectedCategory && (
          <div className="bg-[#082340] px-2 py-1 rounded-md text-white">
            {categories.find(c => c.id === selectedCategory)?.name}
          </div>
        )}
        {selectedEvent && (
          <div className="bg-[#082340] px-2 py-1 rounded-md text-white">
            {selectedEvent}
          </div>
        )}
        {!selectedPlayer && !selectedCategory && !selectedEvent && (
          <div className="border border-[rgba(137,150,159,1)] text-[rgba(137,150,159,1)] px-2 py-1 rounded-md">
            Select An Event
          </div>
        )}
      </div>

      {/* Back button (appears after first selection) */}
      {(currentStep === "events" || selectedCategory) && (
        <button 
          onClick={handleBack}
          className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 mb-3 hover:bg-[#6b7883] transition-colors"
        >
          Back
        </button>
      )}

      {/* Quick Events */}
      {currentStep === "quick" && (
        <>
          <div className="text-black max-md:max-w-full">
            Quick Events (Press SHIFT for 1-touch events)
          </div>
          {renderButtonRow(quickEvents)}
        </>
      )}

      {/* Event Categories */}
      {(currentStep === "quick" || currentStep === "categories") && (
        <>
          <div className="text-black mt-4">Event Categories</div>
          <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
            {categories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5 hover:bg-[#0e4f93] transition-colors"
                onClick={() => handleCategorySelect(category.id as EventCategory)}
              >
                {category.name} ({category.hotkey})
              </button>
            ))}
          </div>
          <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
            {categories.slice(4).map((category) => (
              <button
                key={category.id}
                className="self-stretch bg-[rgba(8,35,64,1)] gap-2 my-auto px-2 py-1.5 hover:bg-[#0e4f93] transition-colors"
                onClick={() => handleCategorySelect(category.id as EventCategory)}
              >
                {category.name} ({category.hotkey})
              </button>
            ))}
          </div>
        </>
      )}

      {/* Events for selected category */}
      {currentStep === "events" && selectedCategory && (
        <>
          <div className="text-black max-md:max-w-full">
            {categories.find(c => c.id === selectedCategory)?.name} Events
          </div>
          {renderButtonRow(getCurrentEvents())}
        </>
      )}
    </div>
  );
};

export default EventTree;
