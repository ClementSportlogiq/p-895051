
import { useState } from "react";
import { EventCategory, FlagCondition } from "@/types/annotation";

export function useSelectionState() {
  // Main wizard state
  const [currentStep, setCurrentStep] = useState<"default" | "flag">("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>([]);
  
  // Enhanced reset function with logging and explicit null setting
  const resetSelectionState = () => {
    console.log("Resetting selection state - before:", {
      currentStep,
      selectedCategory,
      selectedEvent,
      selectedEventName,
      flagConditions: flagConditions.length
    });
    
    // Explicitly reset all selection state to their default values
    setCurrentStep("default");
    setSelectedCategory(null); // This is crucial for visual reset
    setSelectedEvent(null);
    setSelectedEventName(null);
    setFlagConditions([]);
    
    console.log("Selection state reset - all selections cleared, currentStep set to default");
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
