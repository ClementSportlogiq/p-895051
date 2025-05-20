
import React, { useState, useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";
import DefaultView from "./DefaultView";
import OffenseEvents from "./OffenseEvents";
import PressureStep from "./PressureStep";
import BodyPartStep from "./BodyPartStep";
import FlagStep from "./FlagStep";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { WizardStep, EventCategory, AnnotationLabel, AnnotationFlag } from "@/types/annotation";
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
    categories,
    getFlagsByLabel
  } = useAnnotationLabels();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>("default");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  
  // New state for handling flag steps
  const [currentLabelId, setCurrentLabelId] = useState<string | null>(null);
  const [flagsForLabel, setFlagsForLabel] = useState<AnnotationFlag[]>([]);
  const [currentFlagIndex, setCurrentFlagIndex] = useState<number>(0);
  const [flagValues, setFlagValues] = useState<Record<string, string>>({});

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
      
      // Add flag values to details if available
      const flagDetails = Object.entries(flagValues);
      if (flagDetails.length > 0) {
        flagDetails.forEach(([flagName, value]) => {
          details += ` | ${flagName}: ${value}`;
        });
      }
    }
    
    setSelectedEventType(details);
    
    // Set additional details for context
    const additionalDetails = {
      pressure: selectedPressure,
      bodyPart: selectedBodyPart,
      flags: flagValues
    };
    
    setSelectedEventDetails(additionalDetails);
  }, [selectedEvent, selectedPressure, selectedBodyPart, selectedCategory, flagValues, setSelectedEventCategory, setSelectedEventType, setSelectedEventDetails]);

  const resetWizard = () => {
    setCurrentStep("default");
    setSelectedCategory(null);
    setSelectedEvent(null);
    setSelectedPressure(null);
    setSelectedBodyPart(null);
    setCurrentLabelId(null);
    setFlagsForLabel([]);
    setCurrentFlagIndex(0);
    setFlagValues({});
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
    setCurrentLabelId(event.id);
    
    // Check if the event has associated flags
    if (event.flags && event.flags.length > 0) {
      setFlagsForLabel(event.flags);
      setCurrentFlagIndex(0);
      setCurrentStep("flag");
    } 
    // If Pass is selected, go to pressure selection
    else if (event.id === "pass") {
      setCurrentStep("pressure");
    }
  };

  const handlePressureSelect = (pressure: AnnotationLabel) => {
    setSelectedPressure(pressure.name);
    setCurrentStep("bodyPart");
  };

  const handleBodyPartSelect = (bodyPart: AnnotationLabel) => {
    setSelectedBodyPart(bodyPart.name);
    
    // After body part, check if there are flags to process
    if (currentLabelId) {
      const eventWithFlags = labels.find(l => l.id === currentLabelId);
      if (eventWithFlags?.flags && eventWithFlags.flags.length > 0) {
        setFlagsForLabel(eventWithFlags.flags);
        setCurrentFlagIndex(0);
        setCurrentStep("flag");
      }
    }
  };
  
  const handleFlagValueSelect = (value: string) => {
    const currentFlag = flagsForLabel[currentFlagIndex];
    
    // Store selected flag value
    setFlagValues(prev => ({
      ...prev,
      [currentFlag.name]: value
    }));
    
    // Move to next flag if available
    if (currentFlagIndex < flagsForLabel.length - 1) {
      setCurrentFlagIndex(prev => prev + 1);
    }
    // If no more flags, we're done
  };

  // Setup keyboard event handlers
  const { labels } = useAnnotationLabels();
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
    },
    // Add handler for flag values
    handleFlagValueSelect: (flagValueIndex) => {
      if (currentStep === "flag" && flagsForLabel.length > 0) {
        const currentFlag = flagsForLabel[currentFlagIndex];
        if (flagValueIndex < currentFlag.values.length) {
          handleFlagValueSelect(currentFlag.values[flagValueIndex]);
        }
      }
    }
  });

  const handleBack = () => {
    if (currentStep === "flag") {
      // If we're on the first flag, go back to the previous step
      if (currentFlagIndex === 0) {
        if (selectedBodyPart) {
          // If we came from bodyPart step
          setCurrentStep("bodyPart");
        } else if (selectedPressure) {
          // If we came from pressure step
          setCurrentStep("pressure");
        } else {
          // If we came directly from event selection
          setCurrentStep("default");
        }
      } else {
        // Go back to the previous flag
        setCurrentFlagIndex(prev => prev - 1);
        // Remove the value for the current flag
        const currentFlag = flagsForLabel[currentFlagIndex];
        const newFlagValues = { ...flagValues };
        delete newFlagValues[currentFlag.name];
        setFlagValues(newFlagValues);
      }
    }
    else if (currentStep === "bodyPart") {
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
      
      {/* Flag Selection - dynamic based on selected event */}
      {currentStep === "flag" && flagsForLabel.length > 0 && (
        <FlagStep 
          flag={flagsForLabel[currentFlagIndex]} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default EventTree;
