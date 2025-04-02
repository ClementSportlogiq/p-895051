
import React, { useState, useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";

type WizardStep = "default" | "pressure" | "bodyPart";
type EventCategory = "offense" | "defense" | "reception" | "goalkeeper" | "deadball" | "playerAction" | "infractions";

interface TreeEvent {
  id: string;
  name: string;
  hotkey: string;
}

export const EventTree: React.FC = () => {
  const { 
    selectedTeam, 
    setSelectedEventCategory, 
    setSelectedEventType,
    setSelectedEventDetails
  } = useSoccer();
  const [currentStep, setCurrentStep] = useState<WizardStep>("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

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
    { id: "pass", name: "Pass", hotkey: "Q" },
    { id: "cross", name: "Cross", hotkey: "W" },
    { id: "shot", name: "Shot", hotkey: "E" },
    { id: "failedShot", name: "Failed Shot", hotkey: "R" },
    { id: "blockedShot", name: "Blocked Shot", hotkey: "A" },
    { id: "goal", name: "Goal", hotkey: "S" },
    { id: "ownGoal", name: "Own Goal", hotkey: "D" },
    { id: "shootoutGoal", name: "Shoot-out Goal", hotkey: "F" },
  ];

  // Define pressure options
  const pressureOptions = [
    { id: "pressure", name: "Pressure", hotkey: "Q" },
    { id: "noPressure", name: "No Pressure", hotkey: "W" },
  ];

  // Define body part options
  const bodyPartOptions = [
    { id: "leftFoot", name: "Left Foot", hotkey: "Q" },
    { id: "rightFoot", name: "Right Foot", hotkey: "W" },
    { id: "head", name: "Head", hotkey: "E" },
    { id: "other", name: "Other", hotkey: "R" },
    { id: "leftHand", name: "Left Hand", hotkey: "A" },
    { id: "rightHand", name: "Right Hand", hotkey: "S" },
    { id: "bothHands", name: "Both Hands", hotkey: "D" },
  ];

  // Get current events based on the selected category
  const getCurrentEvents = () => {
    switch (selectedCategory) {
      case "offense":
        return offenseEvents;
      // Add more cases for other categories as needed
      default:
        return [];
    }
  };

  // Handle hotkeys for event selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (currentStep === "default") {
        // Quick events (Q, W, E, R)
        if (["Q", "W", "E", "R"].includes(key)) {
          const event = quickEvents.find(evt => evt.hotkey === key);
          if (event) {
            handleEventSelect(event);
          }
        } 
        // Categories (A, S, D, F, Z, X, C)
        else if (["A", "S", "D", "F", "Z", "X", "C"].includes(key)) {
          const category = categories.find(cat => cat.hotkey === key);
          if (category) {
            handleCategorySelect(category.id as EventCategory);
          }
        }
      } 
      else if (currentStep === "pressure") {
        // Pressure options (Q, W)
        if (["Q", "W"].includes(key)) {
          const pressure = pressureOptions.find(opt => opt.hotkey === key);
          if (pressure) {
            handlePressureSelect(pressure);
          }
        }
      }
      else if (currentStep === "bodyPart") {
        // Body part options (Q, W, E, R, A, S, D)
        if (["Q", "W", "E", "R", "A", "S", "D"].includes(key)) {
          const bodyPart = bodyPartOptions.find(opt => opt.hotkey === key);
          if (bodyPart) {
            handleBodyPartSelect(bodyPart);
          }
        }
      }
      else if (selectedCategory && currentStep !== "pressure" && currentStep !== "bodyPart") {
        // Event selection from category
        if (["Q", "W", "E", "R", "A", "S", "D", "F"].includes(key)) {
          const events = getCurrentEvents();
          const event = events.find(evt => evt.hotkey === key);
          if (event) {
            handleEventSelect(event);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, selectedCategory]);

  // Log video time when category or event is selected
  useEffect(() => {
    if (selectedCategory || selectedEvent) {
      const event = new CustomEvent("getVideoTime", {});
      window.dispatchEvent(event);
    }
  }, [selectedCategory, selectedEvent]);

  // Update context with selected details
  useEffect(() => {
    setSelectedEventCategory(selectedCategory);
    
    // Set event details based on selection steps
    let details = "";
    if (selectedEvent) {
      details = selectedEvent;
      if (selectedPressure) {
        details += ` (${selectedPressure})`;
      }
      if (selectedBodyPart) {
        details += ` - ${selectedBodyPart}`;
      }
    }
    
    setSelectedEventType(details);
    
    // Set additional details for context
    const additionalDetails = {
      pressure: selectedPressure,
      bodyPart: selectedBodyPart
    };
    
    setSelectedEventDetails(additionalDetails);
  }, [selectedEvent, selectedPressure, selectedBodyPart, selectedCategory]);

  const resetWizard = () => {
    setCurrentStep("default");
    setSelectedCategory(null);
    setSelectedEvent(null);
    setSelectedPressure(null);
    setSelectedBodyPart(null);
    setSelectedEventCategory(null);
    setSelectedEventType(null);
    setSelectedEventDetails(null);
  };

  const handleCategorySelect = (category: EventCategory) => {
    setSelectedCategory(category);
  };

  const handleEventSelect = (event: TreeEvent) => {
    setSelectedEvent(event.name);
    // If Pass is selected, go to pressure selection
    if (event.id === "pass") {
      setCurrentStep("pressure");
    }
  };

  const handlePressureSelect = (pressure: TreeEvent) => {
    setSelectedPressure(pressure.name);
    setCurrentStep("bodyPart");
  };

  const handleBodyPartSelect = (bodyPart: TreeEvent) => {
    setSelectedBodyPart(bodyPart.name);
    // This is the last step for this flow
  };

  const handleBack = () => {
    if (currentStep === "bodyPart") {
      setCurrentStep("pressure");
      setSelectedBodyPart(null);
    } 
    else if (currentStep === "pressure") {
      setCurrentStep("default");
      setSelectedEvent(null);
      setSelectedPressure(null);
    } 
    else if (selectedCategory) {
      setSelectedCategory(null);
      setSelectedEvent(null);
      setCurrentStep("default");
    }
  };

  const renderButtonRow = (items: TreeEvent[], handler: (item: TreeEvent) => void, start: number = 0, end?: number) => {
    const displayItems = end ? items.slice(start, end) : items.slice(start);
    
    return (
      <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
        {displayItems.map((item) => (
          <button
            key={item.id}
            className="self-stretch bg-[rgba(8,35,64,1)] text-white gap-2 my-auto px-2 py-1.5 hover:bg-[#0e4f93] transition-colors"
            onClick={() => handler(item)}
          >
            {item.name} ({item.hotkey})
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      {/* Back button (appears after first selection) */}
      {(currentStep !== "default" || selectedCategory) && (
        <button 
          onClick={handleBack}
          className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 mb-3 hover:bg-[#6b7883] transition-colors"
        >
          Back
        </button>
      )}

      {/* Default View - Quick Events */}
      {currentStep === "default" && !selectedCategory && (
        <>
          <div className="text-black max-md:max-w-full">
            Quick Events (Press SHIFT for 1-touch events)
          </div>
          {renderButtonRow(quickEvents, handleEventSelect)}
        </>
      )}

      {/* Default View - Event Categories */}
      {currentStep === "default" && (
        <>
          <div className="text-black mt-4">Event Categories</div>
          {renderButtonRow(categories.slice(0, 4), handleCategorySelect)}
          {renderButtonRow(categories.slice(4), handleCategorySelect)}
        </>
      )}

      {/* Selected Category Events */}
      {selectedCategory && currentStep === "default" && (
        <>
          <div className="text-black max-md:max-w-full">
            {categories.find(c => c.id === selectedCategory)?.name} Events
          </div>
          {selectedCategory === "offense" && (
            <>
              {renderButtonRow(offenseEvents.slice(0, 4), handleEventSelect)}
              {renderButtonRow(offenseEvents.slice(4, 8), handleEventSelect)}
            </>
          )}
        </>
      )}

      {/* Pressure Selection */}
      {currentStep === "pressure" && (
        <>
          <div className="text-black max-md:max-w-full">
            Select Pressure
          </div>
          {renderButtonRow(pressureOptions, handlePressureSelect)}
        </>
      )}

      {/* Body Part Selection */}
      {currentStep === "bodyPart" && (
        <>
          <div className="text-black max-md:max-w-full">
            Select Body Part
          </div>
          {renderButtonRow(bodyPartOptions.slice(0, 4), handleBodyPartSelect)}
          {renderButtonRow(bodyPartOptions.slice(4), handleBodyPartSelect)}
        </>
      )}
    </div>
  );
};

export default EventTree;
