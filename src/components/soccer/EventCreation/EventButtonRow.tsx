
import React from "react";
import { TreeEvent } from "./eventData";

interface EventButtonRowProps {
  items: TreeEvent[];
  onSelect: (item: TreeEvent) => void;
  start?: number;
  end?: number;
}

export const EventButtonRow: React.FC<EventButtonRowProps> = ({ 
  items, 
  onSelect, 
  start = 0, 
  end 
}) => {
  const displayItems = end ? items.slice(start, end) : items.slice(start);
  
  return (
    <div className="flex w-full items-center gap-2 flex-wrap mt-2 max-md:max-w-full">
      {displayItems.map((item) => (
        <button
          key={item.id}
          className="self-stretch bg-[rgba(8,35,64,1)] text-white gap-2 my-auto px-2 py-1.5 hover:bg-[#0e4f93] transition-colors"
          onClick={() => onSelect(item)}
        >
          {item.name} ({item.hotkey})
        </button>
      ))}
    </div>
  );
};

export default EventButtonRow;
