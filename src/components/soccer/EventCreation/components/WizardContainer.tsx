
import React from "react";
import DefaultView from "../DefaultView";
import FlagStep from "../FlagStep";
import { WizardStateContextValue } from "../hooks/wizard/types";

interface WizardContainerProps {
  wizardState: WizardStateContextValue;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  wizardState
}) => {
  const {
    currentStep,
    selectedCategory,
    currentFlagIndex,
    flagsForLabel,
    handleCategorySelect,
    handleEventSelect,
    handleFlagValueSelect,
    handleBack
  } = wizardState;

  // Get current flag to display
  const currentFlag = flagsForLabel[currentFlagIndex];

  // Simple conditional rendering
  const shouldShowDefaultView = currentStep === "default";
  const shouldShowFlagStep = currentStep === "flag" && currentFlag;

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
      {shouldShowDefaultView && (
        <DefaultView 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}
      
      {shouldShowFlagStep && (
        <FlagStep 
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default WizardContainer;
