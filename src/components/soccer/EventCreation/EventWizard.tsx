
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
import { toast } from "@/components/ui/use-toast";

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

  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // Validate flag data
  useEffect(() => {
    if (currentStep === "flag" && (!flagsForLabel || flagsForLabel.length === 0)) {
      console.error("Flag step active but no flags available");
      toast({
        title: "Warning",
        description: "No flags available for this event. Please select another event.",
        variant: "destructive"
      });
      handleBack();
    }
  }, [currentStep, flagsForLabel]);

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
      try {
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
      } catch (error) {
        console.error("Error handling event selection:", error);
      }
    },
    handlePressureSelect: (pressureId) => {
      try {
        const pressure = pressureOptions.find(p => p.id === pressureId);
        if (pressure) {
          handlePressureSelect(pressure);
        }
      } catch (error) {
        console.error("Error handling pressure selection:", error);
      }
    },
    handleBodyPartSelect: (bodyPartId) => {
      try {
        const bodyPart = bodyPartOptions.find(bp => bp.id === bodyPartId);
        if (bodyPart) {
          handleBodyPartSelect(bodyPart);
        }
      } catch (error) {
        console.error("Error handling body part selection:", error);
      }
    },
    handleFlagValueSelect
  });

  // Get current flag to display with safety checks
  let currentFlag = null;
  try {
    currentFlag = flagsForLabel && flagsForLabel[currentFlagIndex];
  } catch (error) {
    console.error("Error accessing current flag:", error);
  }

  // Check if the current flag should be displayed based on available flags
  const shouldDisplayFlag = currentFlag && 
                            availableFlags && 
                            Array.isArray(availableFlags) && 
                            availableFlags.some(f => f && f.id === currentFlag.id);

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
      
      {/* Flag Selection - only show flags that aren't hidden by conditions and with safety checks */}
      {currentStep === "flag" && shouldDisplayFlag && currentFlag && (
        <FlagStep 
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default EventWizard;
