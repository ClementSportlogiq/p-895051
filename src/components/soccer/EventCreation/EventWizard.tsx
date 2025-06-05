
import React, { useEffect, useMemo, useRef, useState } from "react";
import DefaultView from "./DefaultView";
import FlagStep from "./FlagStep";
import { useWizardState } from "./hooks/useWizardState";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";

export const EventWizard: React.FC = () => {
  // CRITICAL FIX: Add state freshness tracking
  const [isStateStale, setIsStateStale] = useState(false);
  const lastResetCounterRef = useRef<number>(0);
  const renderBlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // CRITICAL FIX: Use direct state destructuring instead of problematic useMemo wrapper
  const wizardState = useWizardState();
  const {
    currentStep,
    selectedCategory,
    flagsForLabel,
    availableFlags,
    currentFlagIndex,
    resetCounter,
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
    handleFlagValueSelect,
    handleBack
  } = wizardState;

  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // CRITICAL FIX: Add explicit wizardState object reference tracking
  useEffect(() => {
    console.log("🔄 EventWizard wizardState object changed:", {
      currentStep,
      selectedCategory,
      resetCounter,
      wizardStateRef: wizardState,
      timestamp: new Date().toISOString()
    });
  }, [wizardState, currentStep, selectedCategory, resetCounter]);

  // CRITICAL FIX: Add state freshness validation
  useEffect(() => {
    const isExpectedResetState = currentStep === "default" && selectedCategory === null;
    
    // Validate that destructured values match the wizardState object
    if (wizardState.currentStep !== currentStep || wizardState.selectedCategory !== selectedCategory) {
      console.warn("⚠️ Stale state detected in EventWizard - destructured values don't match wizardState object", {
        destructured: { currentStep, selectedCategory },
        wizardStateObject: { currentStep: wizardState.currentStep, selectedCategory: wizardState.selectedCategory },
        resetCounter
      });
      setIsStateStale(true);
      return;
    }

    // Check for reset condition and manage render blocking
    if (resetCounter > lastResetCounterRef.current) {
      console.log("🔄 Reset detected, managing state synchronization", {
        oldResetCounter: lastResetCounterRef.current,
        newResetCounter: resetCounter
      });
      
      // Clear any existing timeout
      if (renderBlockTimeoutRef.current) {
        clearTimeout(renderBlockTimeoutRef.current);
      }
      
      // Briefly block rendering to allow state to fully settle
      setIsStateStale(true);
      renderBlockTimeoutRef.current = setTimeout(() => {
        setIsStateStale(false);
        console.log("🔄 State synchronization complete, allowing fresh render");
      }, 10);
      
      lastResetCounterRef.current = resetCounter;
    } else {
      setIsStateStale(false);
    }
    
    return () => {
      if (renderBlockTimeoutRef.current) {
        clearTimeout(renderBlockTimeoutRef.current);
      }
    };
  }, [wizardState, currentStep, selectedCategory, resetCounter]);

  // Component lifecycle logging
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
  }, [resetCounter]);

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

  // State freshness validation function
  const validateStateConsistency = () => {
    const expectedResetState = currentStep === "default" && selectedCategory === null;
    const isInExpectedResetState = expectedResetState;
    
    if (!isInExpectedResetState && flagsForLabel.length === 0 && availableFlags.length === 0) {
      console.warn("⚠️ Potential stale state detected in EventWizard render", {
        currentStep,
        selectedCategory,
        flagsForLabel: flagsForLabel.length,
        availableFlags: availableFlags.length,
        resetCounter
      });
      return false;
    }
    return true;
  };

  // Get current flag to display - with enhanced defensive checks
  const currentFlag = flagsForLabel[currentFlagIndex];
  
  // Enhanced shouldDisplayFlag logic with explicit boolean checks and state validation
  const shouldDisplayFlag = Boolean(
    !isStateStale &&
    validateStateConsistency() &&
    currentStep === "flag" && 
    currentFlag && 
    currentFlag.id && 
    availableFlags.length > 0 && 
    availableFlags.some(f => f && f.id === currentFlag.id)
  );

  // Explicit check for DefaultView display conditions with state validation
  const shouldDisplayDefaultView = Boolean(
    !isStateStale &&
    validateStateConsistency() &&
    (currentStep === "default" || (currentStep !== "flag" || !shouldDisplayFlag))
  );

  // Enhanced debug logging to track rendering conditions
  console.log("🎯 EventWizard render decision:", {
    currentStep,
    selectedCategory,
    currentFlag: currentFlag?.id || 'none',
    availableFlagsCount: availableFlags.length,
    shouldDisplayFlag,
    shouldDisplayDefaultView,
    isStateStale,
    resetCounter,
    wizardStateMatches: wizardState.currentStep === currentStep && wizardState.selectedCategory === selectedCategory,
    willRender: isStateStale ? "BLOCKED (state settling)" : 
                shouldDisplayDefaultView ? "DefaultView" : 
                shouldDisplayFlag ? "FlagStep" : "DefaultView (fallback)"
  });

  // Generate specific dynamic keys for component identity
  const defaultViewKey = selectedCategory 
    ? `category-${selectedCategory}-${resetCounter}` 
    : `default-main-${resetCounter}`;
  
  const flagStepKey = currentFlag 
    ? `flag-${currentFlag.id}-${resetCounter}` 
    : `empty-flag-${resetCounter}`;

  // Render blocking for state synchronization
  if (isStateStale) {
    console.log("🛑 Render blocked: waiting for state synchronization");
    return (
      <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      {/* Back button (appears after first selection) */}
      {(currentStep !== "default" || selectedCategory) && (
        <button 
          key={`back-${resetCounter}`}
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

export default EventWizard;
