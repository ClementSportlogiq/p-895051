
import { AnnotationLabel } from "@/types/annotation";

export function useEventNavigation({ selection, event, flagLogic }) {
  // Determine next step based on event selected
  const determineNextStep = (event: AnnotationLabel) => {
    const goToFlag = hasAvailableFlags(event);
    const goToBodyPart = needsBodyPartSelection(event);

    if (goToFlag) {
      selection.setCurrentStep("flag");
    } else if (goToBodyPart || goToPressure(event)) {
      // Some events go directly to body part selection (e.g. heading)
      if (goToBodyPart && !goToPressure(event)) {
        selection.setCurrentStep("bodyPart");
      } else {
        selection.setCurrentStep("pressure");
      }
    } else {
      // Return to default view if no additional info needed
      selection.setCurrentStep("default");
    }
  };

  // Check if event needs pressure selection
  const goToPressure = (event: AnnotationLabel) => {
    const needsPressure = ["pass", "reception", "shot", "cross", "clearance"];
    return needsPressure.includes(event.id);
  };

  // Check if event needs body part selection
  const needsBodyPartSelection = (event: AnnotationLabel) => {
    const needsBodyPart = ["pass", "shot", "reception", "header", "cross", "clearance"];
    return needsBodyPart.includes(event.id);
  };

  // Check if event has available flags
  const hasAvailableFlags = (event: AnnotationLabel) => {
    return flagLogic.availableFlags.length > 0 && event.flags && event.flags.length > 0;
  };

  return {
    determineNextStep,
    goToPressure,
    needsBodyPartSelection,
    hasAvailableFlags
  };
}
