
import React from "react";
import { useWizardState } from "./hooks/useWizardState";
import DefaultView from "./DefaultView";
import FlagStep from "./FlagStep";

export const EventWizard: React.FC = () => {
  // Direct state consumption from useWizardState
  const {
    currentStep,
    selectedCategory,
    selectedEvent,
    selectedEventName,
    currentLabelId,
    flagsForLabel,
    availableFlags,
    currentFlagIndex,
    flagConditions,
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handleFlagValueSelect,
    handleBack,
    resetWizard
  } = useWizardState();

  // Get current flag simply from flagsForLabel array
  const currentFlag = flagsForLabel.length > 0 && currentFlagIndex < flagsForLabel.length
    ? flagsForLabel[currentFlagIndex]
    : null;

  // Simple conditional rendering logic
  const shouldShowDefaultView = currentStep === "default" && selectedCategory === null;
  const shouldShowCategoryView = currentStep === "default" && selectedCategory !== null;
  const shouldShowFlagStep = currentStep === "flag" && currentFlag !== null;

  // Generate simple keys for component remounting
  const getViewKey = () => {
    if (shouldShowDefaultView) return "default-main";
    if (shouldShowCategoryView) return `category-${selectedCategory}`;
    if (shouldShowFlagStep) return `flag-${currentFlag?.id || 'none'}`;
    return "default-fallback";
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

      {/* Simple conditional rendering */}
      {(shouldShowDefaultView || shouldShowCategoryView) && (
        <DefaultView 
          key={getViewKey()}
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}
      
      {shouldShowFlagStep && (
        <FlagStep 
          key={getViewKey()}
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default EventWizard;
