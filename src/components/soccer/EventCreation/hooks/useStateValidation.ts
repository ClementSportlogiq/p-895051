
import { useEffect, useRef } from "react";
import { WizardStateContextValue } from "./wizard/types";

interface UseStateValidationProps {
  wizardState: WizardStateContextValue;
  currentStep: string;
  selectedCategory: string | null;
  onStateStale: (isStale: boolean) => void;
}

export function useStateValidation({
  wizardState,
  currentStep,
  selectedCategory,
  onStateStale
}: UseStateValidationProps) {
  const renderBlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add explicit wizardState object reference tracking
  useEffect(() => {
    console.log("🔄 EventWizard wizardState object changed:", {
      currentStep,
      selectedCategory,
      wizardStateRef: wizardState,
      timestamp: new Date().toISOString()
    });
  }, [wizardState, currentStep, selectedCategory]);

  // State freshness validation
  useEffect(() => {
    // Validate that destructured values match the wizardState object
    if (wizardState.currentStep !== currentStep || wizardState.selectedCategory !== selectedCategory) {
      console.warn("⚠️ Stale state detected in EventWizard - destructured values don't match wizardState object", {
        destructured: { currentStep, selectedCategory },
        wizardStateObject: { currentStep: wizardState.currentStep, selectedCategory: wizardState.selectedCategory }
      });
      onStateStale(true);
      return;
    }

    // Clear any existing timeout
    if (renderBlockTimeoutRef.current) {
      clearTimeout(renderBlockTimeoutRef.current);
    }
    
    // Allow rendering
    onStateStale(false);
    
    return () => {
      if (renderBlockTimeoutRef.current) {
        clearTimeout(renderBlockTimeoutRef.current);
      }
    };
  }, [wizardState, currentStep, selectedCategory, onStateStale]);

  // State freshness validation function
  const validateStateConsistency = () => {
    const expectedResetState = currentStep === "default" && selectedCategory === null;
    const isInExpectedResetState = expectedResetState;
    
    if (!isInExpectedResetState && wizardState.flagsForLabel.length === 0 && wizardState.availableFlags.length === 0) {
      console.warn("⚠️ Potential stale state detected in EventWizard render", {
        currentStep,
        selectedCategory,
        flagsForLabel: wizardState.flagsForLabel.length,
        availableFlags: wizardState.availableFlags.length
      });
      return false;
    }
    return true;
  };

  return { validateStateConsistency };
}
