
import React from "react";
import { useWizardState } from "./hooks/useWizardState";
import { useStateValidation } from "./hooks/useStateValidation";
import { useRenderConditions } from "./hooks/useRenderConditions";
import { RenderGuard } from "./components/RenderGuard";
import { WizardContainer } from "./components/WizardContainer";
import { useState } from "react";

// REMOVED: Any React.memo usage to ensure fresh rendering
export const EventWizard: React.FC = () => {
  const [isStateStale, setIsStateStale] = useState(false);

  // Get state from useWizardState directly
  const wizardState = useWizardState();
  const {
    currentStep,
    selectedCategory,
  } = wizardState;

  console.log("🔄 EventWizard state capture (Direct):", {
    currentStep,
    selectedCategory,
    timestamp: new Date().toISOString()
  });

  // State validation and freshness tracking
  const { validateStateConsistency } = useStateValidation({
    wizardState,
    currentStep,
    selectedCategory,
    onStateStale: setIsStateStale
  });

  // Get render conditions
  const renderConditions = useRenderConditions({
    wizardState,
    isStateStale,
    validateStateConsistency
  });

  console.log("🎯 EventWizard render decision:", {
    currentStep,
    selectedCategory,
    isStateStale,
    willRender: isStateStale ? "BLOCKED (state settling)" : 
                                renderConditions.shouldDisplayDefaultView ? "DefaultView" : 
                                renderConditions.shouldDisplayFlag ? "FlagStep" : "DefaultView (fallback)"
  });

  // Render guard for state synchronization
  if (isStateStale) {
    return <RenderGuard isStateStale={isStateStale} />;
  }

  return (
    <WizardContainer 
      wizardState={wizardState}
      renderConditions={renderConditions}
    />
  );
};

// CRITICAL: Export without React.memo to ensure fresh rendering
export default EventWizard;
