
import React from "react";
import DefaultView from "./DefaultView";
import FlagStep from "./FlagStep";
import { useWizardState } from "./hooks/useWizardState";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";

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
    handleFlagValueSelect,
    handleBack
  } = useWizardState();

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
      // Find event in the appropriate category or quick events
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
    handleFlagValueSelect
  });

  // Get current flag to display - with enhanced defensive checks
  const currentFlag = flagsForLabel[currentFlagIndex];
  
  // CRITICAL FIX: Strengthen shouldDisplayFlag logic to prevent race conditions
  // This addresses the core visual reset failure issue
  const shouldDisplayFlag = currentStep === "flag" && 
                           currentFlag && 
                           currentFlag.id && 
                           availableFlags.length > 0 && 
                           availableFlags.some(f => f && f.id === currentFlag.id);

  // Debug logging to track rendering conditions (can be removed after verification)
  console.log("EventWizard render conditions:", {
    currentStep,
    selectedCategory,
    currentFlag: currentFlag?.id || 'none',
    availableFlagsCount: availableFlags.length,
    shouldDisplayFlag,
    renderingComponent: currentStep === "default" ? "DefaultView" : shouldDisplayFlag ? "FlagStep" : "DefaultView (fallback)"
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

      {/* FIXED: Enhanced conditional rendering with explicit priority for currentStep */}
      {currentStep === "default" && (
        <DefaultView 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}
      
      {/* FIXED: Only show FlagStep when explicitly in flag step AND all conditions are met */}
      {currentStep === "flag" && shouldDisplayFlag && (
        <FlagStep 
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}

      {/* FIXED: Fallback to DefaultView if currentStep is not explicitly handled */}
      {currentStep !== "default" && currentStep !== "flag" && (
        <DefaultView 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}
    </div>
  );
};

export default EventWizard;
