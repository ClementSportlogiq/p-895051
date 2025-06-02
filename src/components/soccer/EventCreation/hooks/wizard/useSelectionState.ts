
import { useState } from "react";
import { EventCategory, FlagCondition } from "@/types/annotation";

export function useSelectionState() {
  // Main wizard state
  const [currentStep, setCurrentStep] = useState<"default" | "flag">("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>([]);
  
  // Enhanced reset function with logging
  const resetSelectionState = () => {
    console.log("Resetting selection state - before:", {
      currentStep,
      selectedCategory,
      selectedEvent,
      selectedEventName,
      flagConditions: flagConditions.length
    });
    
    setCurrentStep("default");
    setSelectedCategory(null);
    setSelectedEvent(null);
    setSelectedEventName(null);
    setFlagConditions([]);
    
    console.log("Selection state reset to defaults");
  };
  
  return {
    currentStep,
    setCurrentStep,
    selectedCategory,
    setSelectedCategory,
    selectedEvent,
    setSelectedEvent,
    selectedEventName,
    setSelectedEventName,
    flagConditions,
    setFlagConditions,
    resetSelectionState
  };
}
