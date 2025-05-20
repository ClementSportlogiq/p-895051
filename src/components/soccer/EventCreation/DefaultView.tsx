
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
  const { getQuickEvents, categories } = useAnnotationLabels();
  
  const handleCategorySelect = (item: AnnotationLabel | { id: string; name: string; hotkey: string }) => {
    onCategorySelect(item.id as EventCategory);
  };

  return (
    <>
      {!selectedCategory && (
        <>
          <div className="text-black max-md:max-w-full">
            Quick Events (Press SHIFT for 1-touch events)
          </div>
          <EventButtonRow items={getQuickEvents()} onSelect={onEventSelect} />
        </>
      )}
      
      {selectedCategory && (
        <div className="text-black max-md:max-w-full">
          {categories.find(c => c.id === selectedCategory)?.name} Events
        </div>
      )}
      
      <div className="text-black mt-4">Event Categories</div>
      <EventButtonRow 
        items={categories.slice(0, 4)} 
        onSelect={handleCategorySelect} 
      />
      <EventButtonRow 
        items={categories.slice(4)} 
        onSelect={handleCategorySelect} 
      />
    </>
  );
};

export default DefaultView;
