
import React from "react";
import EventButtonRow from "./EventButtonRow";
import { categories, quickEvents, TreeEvent, EventCategory } from "./eventData";

interface DefaultViewProps {
  selectedCategory: EventCategory | null;
  onCategorySelect: (category: EventCategory) => void;
  onEventSelect: (event: TreeEvent) => void;
}

export const DefaultView: React.FC<DefaultViewProps> = ({ 
  selectedCategory, 
  onCategorySelect, 
  onEventSelect 
}) => {
  const handleCategorySelect = (item: TreeEvent) => {
    onCategorySelect(item.id as EventCategory);
  };

  return (
    <>
      {!selectedCategory && (
        <>
          <div className="text-black max-md:max-w-full">
            Quick Events (Press SHIFT for 1-touch events)
          </div>
          <EventButtonRow items={quickEvents} onSelect={onEventSelect} />
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
