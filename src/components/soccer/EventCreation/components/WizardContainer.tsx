
import React from "react";
import DefaultView from "../DefaultView";
import FlagStep from "../FlagStep";
import { WizardStateContextValue } from "../hooks/wizard/types";

interface WizardContainerProps {
  wizardState: WizardStateContextValue;
  renderConditions: {
    shouldDisplayFlag: boolean;
    shouldDisplayDefaultView: boolean;
    defaultViewKey: string;
    flagStepKey: string;
  };
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  wizardState,
  renderConditions
}) => {
  const {
    currentStep,
    selectedCategory,
    currentFlagIndex,
    flagsForLabel,
    availableFlags,
    handleCategorySelect,
    handleEventSelect,
    handleFlagValueSelect,
    handleBack
  } = wizardState;

  const {
    shouldDisplayFlag,
    shouldDisplayDefaultView,
    defaultViewKey,
    flagStepKey
  } = renderConditions;

  // Get current flag to display - with enhanced defensive checks
  const currentFlag = flagsForLabel[currentFlagIndex];

  // Enhanced debug logging to track rendering conditions
  console.log("🎯 EventWizard render decision:", {
    currentStep,
    selectedCategory,
    currentFlag: currentFlag?.id || 'none',
    availableFlagsCount: availableFlags.length,
    shouldDisplayFlag,
    shouldDisplayDefaultView,
    wizardStateMatches: wizardState.currentStep === currentStep && wizardState.selectedCategory === selectedCategory,
    willRender: shouldDisplayDefaultView ? "DefaultView" : 
                shouldDisplayFlag ? "FlagStep" : "DefaultView (fallback)"
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

      {/* Strengthened conditional rendering with explicit priority and unique keys */}
      {shouldDisplayDefaultView && (
        <DefaultView 
          key={defaultViewKey}
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}
      
      {/* Only render FlagStep when explicitly required AND prevent overlap */}
      {!shouldDisplayDefaultView && shouldDisplayFlag && (
        <FlagStep 
          key={flagStepKey}
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default WizardContainer;
