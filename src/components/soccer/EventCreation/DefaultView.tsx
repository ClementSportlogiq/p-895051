
import React, { useEffect } from "react";
import EventButtonRow from "./EventButtonRow";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { useDefaultWizardConfig } from "@/hooks/useDefaultWizardConfig";
import { EventCategory, AnnotationLabel } from "@/types/annotation";
import { HotkeyMatrix } from "@/components/ui/hotkey-matrix";

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
  const { getQuickEventsByMatrix, getCategoriesByMatrix } = useDefaultWizardConfig();
  
  // ADDED: Component lifecycle logging to verify proper mounting
  useEffect(() => {
    console.log("🔄 DefaultView mounted/re-mounted", { 
      selectedCategory,
      timestamp: new Date().toISOString() 
    });
    
    return () => {
      console.log("🔄 DefaultView unmounting", { selectedCategory });
    };
  }, []); // Empty dependency array to log only on mount/unmount
  
  // ADDED: Log when selectedCategory changes
  useEffect(() => {
    console.log("📍 DefaultView selectedCategory changed:", { selectedCategory });
  }, [selectedCategory]);
  
  // Get matrix-based assignments
  const quickEventsMatrix = getQuickEventsByMatrix(getQuickEvents());
  const categoriesMatrix = getCategoriesByMatrix(categories);
  
  // Fallback to legacy quick events if no matrix assignments
  const quickEvents = Object.keys(quickEventsMatrix).length > 0 
    ? Object.values(quickEventsMatrix)
    : getQuickEvents().slice(0, 4);
  
  const handleCategorySelect = (item: AnnotationLabel | { id: string; name: string; hotkey: string }) => {
    onCategorySelect(item.id as EventCategory);
  };

  const handleMatrixClick = (position: string) => {
    // Handle quick events (Q, W, E, R)
    if (['Q', 'W', 'E', 'R'].includes(position) && quickEventsMatrix[position]) {
      onEventSelect(quickEventsMatrix[position]);
      return;
    }
    
    // Handle categories (A, S, D, F, Z, X, C, V)
    if (categoriesMatrix[position]) {
      onCategorySelect(categoriesMatrix[position].id as EventCategory);
      return;
    }
  };

  // Build matrix assignments for display
  const matrixAssignments: Record<string, { id: string; name: string; type: 'quick-event' | 'category' }> = {};
  
  // Add quick events to matrix
  Object.entries(quickEventsMatrix).forEach(([position, event]) => {
    matrixAssignments[position] = {
      id: event.id,
      name: event.name,
      type: 'quick-event'
    };
  });
  
  // Add categories to matrix
  Object.entries(categoriesMatrix).forEach(([position, category]) => {
    matrixAssignments[position] = {
      id: category.id,
      name: category.name,
      type: 'category'
    };
  });

  // ADDED: Defensive check to ensure proper prop handling
  if (selectedCategory === undefined) {
    console.warn("⚠️ DefaultView received undefined selectedCategory, treating as null");
  }

  // If no category is selected, show the main default view
  if (!selectedCategory) {
    return (
      <>
        {/* Matrix Layout - Primary interface */}
        {Object.keys(matrixAssignments).length > 0 && (
          <div className="mb-6">
            <div className="text-black font-medium mb-3 max-md:max-w-full">
              Hotkey Matrix (Click or use keyboard shortcuts)
            </div>
            <HotkeyMatrix
              assignments={matrixAssignments}
              onPositionClick={handleMatrixClick}
              showLabels={false}
              className="mb-4"
            />
          </div>
        )}

        {/* Legacy Quick Events Section - Fallback */}
        {Object.keys(quickEventsMatrix).length === 0 && (
          <div className="mb-6">
            <div className="text-black font-medium mb-3 max-md:max-w-full">
              Quick Events (Press SHIFT for 1-touch events)
            </div>
            <EventButtonRow items={quickEvents} onSelect={onEventSelect} />
          </div>
        )}

        {/* Legacy Event Categories Section - Fallback */}
        {Object.keys(categoriesMatrix).length === 0 && (
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
        )}
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
