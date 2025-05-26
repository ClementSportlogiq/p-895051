
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { EventCategory, AnnotationLabel } from "@/types/annotation";

interface DefaultViewProps {
  selectedCategory: EventCategory | null;
  onCategorySelect: (category: EventCategory) => void;
  onEventSelect: (event: AnnotationLabel) => void;
}

export const DefaultView: React.FC<DefaultViewProps> = ({ 
  selectedCategory, 
  onCategorySelect, 
  onEventSelect 
}) => {
  const { getQuickEvents, categories, getLabelsByCategory } = useAnnotationLabels();
  
  // Get quick events from admin configuration (limited to 4 as specified)
  const quickEvents = getQuickEvents().slice(0, 4);
  
  const handleCategorySelect = (item: AnnotationLabel | { id: string; name: string; hotkey: string }) => {
    onCategorySelect(item.id as EventCategory);
  };

  // If no category is selected, show the main default view
  if (!selectedCategory) {
    return (
      <>
        {/* Quick Events Section - Prominently displayed with exactly 4 events */}
        <div className="mb-6">
          <div className="text-black font-medium mb-3 max-md:max-w-full">
            Quick Events (Press SHIFT for 1-touch events)
          </div>
          <EventButtonRow items={quickEvents} onSelect={onEventSelect} />
        </div>

        {/* Event Categories Section - Main categories from admin configuration */}
        <div className="mb-4">
          <div className="text-black font-medium mb-3">Event Categories</div>
          <EventButtonRow 
            items={categories.slice(0, 4)} 
            onSelect={handleCategorySelect} 
          />
          {categories.length > 4 && (
            <EventButtonRow 
              items={categories.slice(4)} 
              onSelect={handleCategorySelect} 
            />
          )}
        </div>
      </>
    );
  }

  // If a category is selected, show category-specific events
  const categoryEvents = getLabelsByCategory(selectedCategory);
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <>
      <div className="text-black font-medium mb-3 max-md:max-w-full">
        {selectedCategoryData?.name} Events
      </div>
      
      {/* Display events for the selected category */}
      {categoryEvents.length > 0 ? (
        <>
          <EventButtonRow 
            items={categoryEvents.slice(0, 4)} 
            onSelect={onEventSelect} 
          />
          {categoryEvents.length > 4 && (
            <EventButtonRow 
              items={categoryEvents.slice(4, 8)} 
              onSelect={onEventSelect} 
            />
          )}
        </>
      ) : (
        <div className="text-gray-500 italic">
          No events configured for this category. Please configure events in the Annotations Admin Page.
        </div>
      )}
    </>
  );
};

export default DefaultView;
