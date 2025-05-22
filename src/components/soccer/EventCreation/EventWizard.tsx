
import React, { useEffect } from "react";
import DefaultView from "./DefaultView";
import OffenseEvents from "./OffenseEvents";
import PressureStep from "./PressureStep";
import BodyPartStep from "./BodyPartStep";
import FlagStep from "./FlagStep";
import { useWizardState } from "./hooks/useWizardState";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { pressureOptions, bodyPartOptions } from "./eventData";

export const EventWizard: React.FC = () => {
  const {
    currentStep,
    selectedCategory,
    flagsForLabel,
    availableFlags,
    currentFlagIndex,
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handlePressureSelect,
    handleBodyPartSelect,
    handleFlagValueSelect,
    handleBack
  } = useWizardState();
  
  // Add effect to log state changes for debugging
  useEffect(() => {
    console.log("EventWizard rendering with currentStep:", currentStep, "selectedCategory:", selectedCategory);
  }, [currentStep, selectedCategory]);

  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // Setup keyboard event handlers
  useEventTreeKeyboard({
    currentStep,
    selectedCategory,
    flagsForLabel,
    availableFlags,
    currentFlagIndex,
    handleQuickEventSelect,
    handleCategorySelect,
    handleEventSelect: (eventId) => {
      // Find event in the appropriate category
      if (selectedCategory) {
        const events = getLabelsByCategory(selectedCategory);
        const event = events.find(evt => evt.id === eventId);
        if (event) {
          handleEventSelect(event);
          return;
        }
      }
      
      // Try in quick events if not found in category
      const quickEvent = getQuickEvents().find(evt => evt.id === eventId);
      if (quickEvent) {
        handleEventSelect(quickEvent);
      }
    },
    handlePressureSelect: (pressureId) => {
      const pressure = pressureOptions.find(p => p.id === pressureId);
      if (pressure) {
        handlePressureSelect(pressure);
      }
    },
    handleBodyPartSelect: (bodyPartId) => {
      const bodyPart = bodyPartOptions.find(bp => bp.id === bodyPartId);
      if (bodyPart) {
        handleBodyPartSelect(bodyPart);
      }
    },
    handleFlagValueSelect
  });

  // Get current flag to display
  const currentFlag = flagsForLabel[currentFlagIndex];
  // Check if the current flag should be displayed based on available flags
  const shouldDisplayFlag = currentFlag && availableFlags.some(f => f.id === currentFlag.id);

  // Force render the default view when currentStep is "default" and no category is selected
  if (currentStep === "default" && !selectedCategory) {
    return (
      <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
        {/* Back button would not appear in initial state */}
        <DefaultView 
          selectedCategory={null} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      </div>
    );
  }

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
      
      {/* Flag Selection - only show flags that aren't hidden by conditions */}
      {currentStep === "flag" && shouldDisplayFlag && (
        <FlagStep 
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default EventWizard;
