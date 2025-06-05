
import React, { useEffect, useState } from "react";
import { useWizardState } from "./hooks/useWizardState";
import useEventTreeKeyboard from "./useEventTreeKeyboard";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { useStateValidation } from "./hooks/useStateValidation";
import { useRenderConditions } from "./hooks/useRenderConditions";
import RenderGuard from "./components/RenderGuard";
import WizardContainer from "./components/WizardContainer";

export const EventWizard: React.FC = () => {
  // CRITICAL FIX: Add state freshness tracking
  const [isStateStale, setIsStateStale] = useState(false);

  // CRITICAL FIX: Use direct state destructuring instead of problematic useMemo wrapper
  const wizardState = useWizardState();
  const {
    currentStep,
    selectedCategory,
    flagsForLabel,
    availableFlags,
    currentFlagIndex,
    resetCounter,
    handleQuickEventSelect,
    handleCategorySelect,
    handleEventSelect,
    handleFlagValueSelect
  } = wizardState;

  const { getLabelsByCategory, getQuickEvents } = useAnnotationLabels();

  // Use state validation hook
  const { validateStateConsistency } = useStateValidation({
    wizardState,
    currentStep,
    selectedCategory,
    resetCounter,
    onStateStale: setIsStateStale
  });

  // Use render conditions hook
  const {
    shouldDisplayFlag,
    shouldDisplayDefaultView,
    defaultViewKey,
    flagStepKey
  } = useRenderConditions({
    wizardState,
    isStateStale,
    validateStateConsistency
  });

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

  // Render blocking for state synchronization
  if (isStateStale) {
    return <RenderGuard isStateStale={isStateStale} />;
  }

  return (
    <WizardContainer
      wizardState={wizardState}
      shouldDisplayDefaultView={shouldDisplayDefaultView}
      shouldDisplayFlag={shouldDisplayFlag}
      defaultViewKey={defaultViewKey}
      flagStepKey={flagStepKey}
      validateStateConsistency={validateStateConsistency}
    />
  );
};

export default EventWizard;
