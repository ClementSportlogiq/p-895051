
import { WizardStateContextValue } from "./wizard/types";

interface UseRenderConditionsProps {
  wizardState: WizardStateContextValue;
  isStateStale: boolean;
  validateStateConsistency: () => boolean;
}

export function useRenderConditions({
  wizardState,
  isStateStale,
  validateStateConsistency
}: UseRenderConditionsProps) {
  const {
    currentStep,
    currentFlagIndex,
    flagsForLabel,
    availableFlags,
    resetCounter,
    selectedCategory
  } = wizardState;

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

  // FIXED: Generate specific dynamic keys for component identity
  // Since selectedCategory can be a string (like "offense"), not an object with id
  const defaultViewKey = selectedCategory 
    ? `category-${selectedCategory}-${resetCounter}` 
    : `default-main-${resetCounter}`;
  
  const flagStepKey = currentFlag 
    ? `flag-${currentFlag.id}-${resetCounter}` 
    : `empty-flag-${resetCounter}`;

  return {
    shouldDisplayFlag,
    shouldDisplayDefaultView,
    defaultViewKey,
    flagStepKey
  };
}
