
import { AnnotationLabel } from "@/types/annotation";

export function useSelectionHandlers({ 
  selection, 
  sockerContext,
  completeEventCreation
}) {
  // Handle pressure selection
  const handlePressureSelect = (pressure: { id: string; name: string }) => {
    selection.setSelectedPressure(pressure.id);
    
    // Check if body part selection is needed
    if (needsBodyPartSelection({ id: selection.selectedEvent || "" } as AnnotationLabel)) {
      selection.setCurrentStep("bodyPart");
    } else {
      // If no body part needed, go to default view
      selection.setCurrentStep("default");
      completeEventCreation();
    }
  };

  // Check if event needs body part selection
  const needsBodyPartSelection = (event: AnnotationLabel) => {
    const needsBodyPart = ["pass", "shot", "reception", "header", "cross", "clearance"];
    return needsBodyPart.includes(event.id);
  };

  // Handle body part selection
  const handleBodyPartSelect = (bodyPart: { id: string; name: string }) => {
    selection.setSelectedBodyPart(bodyPart.id);
    selection.setCurrentStep("default");
    completeEventCreation();
  };

  return {
    handlePressureSelect,
    handleBodyPartSelect
  };
}
