
import { useState } from "react";
import { EventCategory } from "@/types/annotation";

export function useSelectionState() {
  // Main wizard state
  const [currentStep, setCurrentStep] = useState<"default" | "pressure" | "bodyPart" | "flag">("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  
  return {
    currentStep,
    setCurrentStep,
    selectedCategory,
    setSelectedCategory,
    selectedEvent,
    setSelectedEvent,
    selectedPressure,
    setSelectedPressure,
    selectedBodyPart,
    setSelectedBodyPart
  };
}
