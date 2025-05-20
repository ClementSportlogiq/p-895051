
import React from "react";
import DefaultView from "./DefaultView";
import OffenseEvents from "./OffenseEvents";
import PressureStep from "./PressureStep";
import BodyPartStep from "./BodyPartStep";
import FlagStep from "./FlagStep";
import { useWizardState } from "./hooks/useWizardState";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { pressureOptions, bodyPartOptions, TreeEvent } from "./eventData";
import { AnnotationLabel } from "@/types/annotation";

export const EventWizard: React.FC = () => {
  const {
    currentStep,
    selectedCategory,
    flagsForLabel,
    currentFlagIndex,
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handlePressureSelect,
    handleBodyPartSelect,
    handleFlagValueSelect,
    handleBack
  } = useWizardState();

  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // Setup keyboard event handlers
  useEventTreeKeyboard({
    currentStep,
    selectedCategory,
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

export default EventWizard;
