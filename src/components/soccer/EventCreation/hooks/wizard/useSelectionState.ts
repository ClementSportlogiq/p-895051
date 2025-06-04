
import { useState } from "react";
import { EventCategory, FlagCondition } from "@/types/annotation";
import { WizardStep } from "@/types/annotation";

export function useSelectionState() {
  // Main wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null); // Changed back to string
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>([]);
  
  // ADDED: Reset counter to force component re-mounting on reset
  const [resetCounter, setResetCounter] = useState<number>(0);
  
  // Enhanced reset function with logging and explicit null setting
  const resetSelectionState = () => {
    console.log("Resetting selection state - before:", {
      currentStep,
      selectedCategory,
      selectedEvent,
      selectedEventName,
      flagConditions: flagConditions.length,
      resetCounter
    });
    
    // Explicitly reset all selection state to their default values
    setCurrentStep("default");
    setSelectedCategory(null); // This is crucial for visual reset
    setSelectedEvent(null);
    setSelectedEventName(null);
    setFlagConditions([]);
    
    // CRITICAL: Increment reset counter to force component re-mounting
    setResetCounter(prev => prev + 1);
    
    console.log("Selection state reset - all selections cleared, currentStep set to default, resetCounter incremented");
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
    resetCounter, // ADDED: Expose reset counter
    resetSelectionState
  };
}
