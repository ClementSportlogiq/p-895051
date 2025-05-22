
import { EventCategory } from "@/types/annotation";

export function useBasicEventHandlers({ selection, sockerContext }) {
  // Handle category selection
  const handleCategorySelect = (category: EventCategory) => {
    selection.setSelectedCategory(category);
  };

  // Handle event selection for quick events
  const handleQuickEventSelect = (eventId: string) => {
    const { getLabelsByCategory, getQuickEvents } = sockerContext.annotationLabels;
    
    // Find the event in all categories
    const allEvents = getQuickEvents();
    const event = allEvents.find(evt => evt.id === eventId);
    
    if (event) {
      handleEventSelect(event);
    }
  };

  // Handle event selection
  const handleEventSelect = (event: any) => {
    selection.setSelectedEvent(event.id);
    return event;
  };

  return {
    handleCategorySelect,
    handleQuickEventSelect,
    handleEventSelect,
  };
}
