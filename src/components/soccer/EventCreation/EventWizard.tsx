
import React, { useEffect } from "react";
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
    resetCounter, // ADDED: Get reset counter for forcing re-mounts
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handleFlagValueSelect,
    handleBack
  } = useWizardState();

  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // ADDED: Component lifecycle logging to verify proper mounting
  useEffect(() => {
    console.log("🔄 EventWizard mounted/re-mounted", { 
      currentStep, 
      selectedCategory, 
      resetCounter,
      timestamp: new Date().toISOString() 
    });
    
    return () => {
      console.log("🔄 EventWizard unmounting", { resetCounter });
    };
  }, [resetCounter]); // Depend on resetCounter to log on forced re-mounts

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
  
  // STRENGTHENED: Enhanced shouldDisplayFlag logic with explicit boolean checks
  const shouldDisplayFlag = Boolean(
    currentStep === "flag" && 
    currentFlag && 
    currentFlag.id && 
    availableFlags.length > 0 && 
    availableFlags.some(f => f && f.id === currentFlag.id)
  );

  // STRENGTHENED: Explicit check for DefaultView display conditions
  const shouldDisplayDefaultView = Boolean(
    currentStep === "default" || 
    (currentStep !== "flag" || !shouldDisplayFlag)
  );

  // Enhanced debug logging to track rendering conditions
  console.log("🎯 EventWizard render decision:", {
    currentStep,
    selectedCategory,
    currentFlag: currentFlag?.id || 'none',
    availableFlagsCount: availableFlags.length,
    shouldDisplayFlag,
    shouldDisplayDefaultView,
    resetCounter,
    willRender: shouldDisplayDefaultView ? "DefaultView" : shouldDisplayFlag ? "FlagStep" : "DefaultView (fallback)"
  });

  // CRITICAL: Generate more specific dynamic keys for component identity
  const defaultViewKey = selectedCategory 
    ? `category-${selectedCategory}-${resetCounter}` 
    : `default-main-${resetCounter}`;
  
  const flagStepKey = currentFlag 
    ? `flag-${currentFlag.id}-${resetCounter}` 
    : `empty-flag-${resetCounter}`;

  return (
    <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      {/* Back button (appears after first selection) */}
      {(currentStep !== "default" || selectedCategory) && (
        <button 
          key={`back-${resetCounter}`} // ADDED: Dynamic key for back button
          onClick={handleBack}
          className="bg-[rgba(137,150,159,1)] text-white px-3 py-1 mb-3 hover:bg-[#6b7883] transition-colors"
        >
          Back
        </button>
      )}

      {/* FIXED: Strengthened conditional rendering with explicit priority and unique keys */}
      {shouldDisplayDefaultView && (
        <DefaultView 
          key={defaultViewKey} // CRITICAL: Unique key forces re-mount on state changes
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect}
          onEventSelect={handleEventSelect}
        />
      )}
      
      {/* FIXED: Only render FlagStep when explicitly required AND prevent overlap */}
      {!shouldDisplayDefaultView && shouldDisplayFlag && (
        <FlagStep 
          key={flagStepKey} // CRITICAL: Unique key forces re-mount on flag changes
          flag={currentFlag} 
          onFlagValueSelect={handleFlagValueSelect} 
        />
      )}
    </div>
  );
};

export default EventWizard;
