
import { useEffect, useRef } from "react";
import { WizardStateContextValue } from "./wizard/types";

interface UseStateValidationProps {
  wizardState: WizardStateContextValue;
  currentStep: string;
  selectedCategory: string | null;
  resetCounter: number;
  onStateStale: (isStale: boolean) => void;
}

export function useStateValidation({
  wizardState,
  currentStep,
  selectedCategory,
  resetCounter,
  onStateStale
}: UseStateValidationProps) {
  const lastResetCounterRef = useRef<number>(0);
  const renderBlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      onStateStale(true);
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
      onStateStale(true);
      renderBlockTimeoutRef.current = setTimeout(() => {
        onStateStale(false);
        console.log("🔄 State synchronization complete, allowing fresh render");
      }, 10);
      
      lastResetCounterRef.current = resetCounter;
    } else {
      onStateStale(false);
    }
    
    return () => {
      if (renderBlockTimeoutRef.current) {
        clearTimeout(renderBlockTimeoutRef.current);
      }
    };
  }, [wizardState, currentStep, selectedCategory, resetCounter, onStateStale]);

  // State freshness validation function
  const validateStateConsistency = () => {
    const expectedResetState = currentStep === "default" && selectedCategory === null;
    const isInExpectedResetState = expectedResetState;
    
    if (!isInExpectedResetState && wizardState.flagsForLabel.length === 0 && wizardState.availableFlags.length === 0) {
      console.warn("⚠️ Potential stale state detected in EventWizard render", {
        currentStep,
        selectedCategory,
        flagsForLabel: wizardState.flagsForLabel.length,
        availableFlags: wizardState.availableFlags.length,
        resetCounter
      });
      return false;
    }
    return true;
  };

  return { validateStateConsistency };
}
