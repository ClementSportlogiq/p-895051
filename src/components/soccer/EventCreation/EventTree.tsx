
import React, { useState, useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";
import DefaultView from "./DefaultView";
import OffenseEvents from "./OffenseEvents";
import PressureStep from "./PressureStep";
import BodyPartStep from "./BodyPartStep";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { WizardStep, EventCategory, AnnotationLabel } from "@/types/annotation";
import { pressureOptions, bodyPartOptions } from "./eventData";

export const EventTree: React.FC = () => {
  const { 
    setSelectedEventCategory, 
    setSelectedEventType,
    setSelectedEventDetails
  } = useSoccer();
  
  const { 
    getQuickEvents, 
    getLabelsByCategory, 
    categories 
  } = useAnnotationLabels();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

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
  }, [selectedEvent, selectedPressure, selectedBodyPart, selectedCategory, setSelectedEventCategory, setSelectedEventType, setSelectedEventDetails]);

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

  // Handler for quick events
  const handleQuickEventSelect = (eventId: string) => {
    const event = getQuickEvents().find(evt => evt.id === eventId);
    if (event) {
      handleEventSelect(event);
    }
  };

  const handleEventSelect = (event: AnnotationLabel) => {
    setSelectedEvent(event.name);
    // If Pass is selected, go to pressure selection
    if (event.id === "pass") {
      setCurrentStep("pressure");
    }
  };

  const handlePressureSelect = (pressure: AnnotationLabel) => {
    setSelectedPressure(pressure.name);
    setCurrentStep("bodyPart");
  };

  const handleBodyPartSelect = (bodyPart: AnnotationLabel) => {
    setSelectedBodyPart(bodyPart.name);
    // This is the last step for this flow
  };

  // Setup keyboard event handlers
  useEventTreeKeyboard({
    currentStep,
    selectedCategory,
    handleQuickEventSelect: (eventId) => {
      const event = getQuickEvents().find(evt => evt.id === eventId);
      if (event) {
        handleEventSelect(event);
      }
    },
    handleCategorySelect,
    handleEventSelect: (eventId) => {
      // Find event in the appropriate category
      const events = selectedCategory ? 
        getLabelsByCategory(selectedCategory).find(evt => evt.id === eventId) : 
        getQuickEvents().find(evt => evt.id === eventId);
      
      if (events) {
        handleEventSelect(events);
      }
    },
    handlePressureSelect: (pressureId) => {
      const pressure = pressureOptions.find(p => p.id === pressureId) as unknown as AnnotationLabel;
      if (pressure) {
        handlePressureSelect(pressure);
      }
    },
    handleBodyPartSelect: (bodyPartId) => {
      const bodyPart = bodyPartOptions.find(bp => bp.id === bodyPartId) as unknown as AnnotationLabel;
      if (bodyPart) {
        handleBodyPartSelect(bodyPart);
      }
    }
  });

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

      {/* Default View */}
      {currentStep === "default" && (
        <DefaultView 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}

      {/* Selected Category Events */}
      {selectedCategory === "offense" && currentStep === "default" && (
        <OffenseEvents onEventSelect={handleEventSelect} />
      )}

      {/* Pressure Selection */}
      {currentStep === "pressure" && (
        <PressureStep onPressureSelect={handlePressureSelect} />
      )}

      {/* Body Part Selection */}
      {currentStep === "bodyPart" && (
        <BodyPartStep onBodyPartSelect={handleBodyPartSelect} />
      )}
    </div>
  );
};

export default EventTree;
