
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HotkeyMatrix } from "@/components/ui/hotkey-matrix";
import { AnnotationLabel } from "@/types/annotation";
import { useDefaultWizardConfig } from "@/hooks/useDefaultWizardConfig";
import { toast } from "@/components/ui/use-toast";

interface MatrixConfigurationProps {
  labels: AnnotationLabel[];
  categories: Array<{ id: string; name: string; hotkey: string }>;
}

export const MatrixConfiguration: React.FC<MatrixConfigurationProps> = ({
  labels,
  categories
}) => {
  const { config, saveConfig, getQuickEventsByMatrix, getCategoriesByMatrix } = useDefaultWizardConfig();
  const [quickEventsMatrix, setQuickEventsMatrix] = useState<Record<string, string>>({});
  const [categoriesMatrix, setCategoriesMatrix] = useState<Record<string, string>>({});
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [assignmentType, setAssignmentType] = useState<'quick-event' | 'category'>('quick-event');

  // Initialize matrix from config
  useEffect(() => {
    if (config) {
      setQuickEventsMatrix(config.quick_events_matrix_positions || {});
      setCategoriesMatrix(config.categories_matrix_positions || {});
    }
  }, [config]);

  const handlePositionClick = (position: string) => {
    setSelectedPosition(position);
    // Determine assignment type based on position
    if (['Q', 'W', 'E', 'R'].includes(position)) {
      setAssignmentType('quick-event');
    } else {
      setAssignmentType('category');
    }
    setShowAssignmentModal(true);
  };

  const handleAssignment = (itemId: string) => {
    if (assignmentType === 'quick-event') {
      setQuickEventsMatrix(prev => ({ ...prev, [selectedPosition]: itemId }));
    } else {
      setCategoriesMatrix(prev => ({ ...prev, [selectedPosition]: itemId }));
    }
    setShowAssignmentModal(false);
  };

  const handleRemoveAssignment = (position: string) => {
    if (['Q', 'W', 'E', 'R'].includes(position)) {
      setQuickEventsMatrix(prev => {
        const newMatrix = { ...prev };
        delete newMatrix[position];
        return newMatrix;
      });
    } else {
      setCategoriesMatrix(prev => {
        const newMatrix = { ...prev };
        delete newMatrix[position];
        return newMatrix;
      });
    }
  };

  const handleSave = async () => {
    // Extract current quick events and flag definitions from config
    const quickEventIds = config?.default_quick_events || [];
    const flagDefinitionIds = config?.default_flag_definitions || [];
    
    const success = await saveConfig(
      quickEventIds,
      flagDefinitionIds,
      quickEventsMatrix,
      categoriesMatrix
    );
    
    if (success) {
      toast({
        title: "Matrix configuration saved",
        description: "Hotkey matrix positions have been updated successfully.",
      });
    }
  };

  // Build combined assignments for display
  const matrixAssignments: Record<string, { id: string; name: string; type: 'quick-event' | 'category' }> = {};
  
  // Add quick events to assignments
  Object.entries(quickEventsMatrix).forEach(([position, labelId]) => {
    const label = labels.find(l => l.id === labelId);
    if (label) {
      matrixAssignments[position] = {
        id: label.id,
        name: label.name,
        type: 'quick-event'
      };
    }
  });
  
  // Add categories to assignments
  Object.entries(categoriesMatrix).forEach(([position, categoryId]) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      matrixAssignments[position] = {
        id: category.id,
        name: category.name,
        type: 'category'
      };
    }
  });

  const hasChanges = 
    JSON.stringify(quickEventsMatrix) !== JSON.stringify(config?.quick_events_matrix_positions || {}) ||
    JSON.stringify(categoriesMatrix) !== JSON.stringify(config?.categories_matrix_positions || {});

  const availableItems = assignmentType === 'quick-event' ? labels : categories;
  const usedItems = assignmentType === 'quick-event' 
    ? Object.values(quickEventsMatrix)
    : Object.values(categoriesMatrix);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">3x4 Hotkey Matrix Configuration</h3>
          <p className="text-sm text-gray-600">
            Assign quick events and categories to specific matrix positions for optimal workflow.
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            Save Matrix Configuration
          </Button>
        )}
      </div>

      <HotkeyMatrix
        assignments={matrixAssignments}
        onPositionClick={handlePositionClick}
        onAssignmentRemove={handleRemoveAssignment}
        showLabels={true}
      />

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">
              Assign {assignmentType === 'quick-event' ? 'Quick Event' : 'Category'} to {selectedPosition}
            </h4>
            
            <Select onValueChange={handleAssignment}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${assignmentType === 'quick-event' ? 'label' : 'category'}`} />
              </SelectTrigger>
              <SelectContent>
                {availableItems
                  .filter(item => !usedItems.includes(item.id))
                  .map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.hotkey})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixConfiguration;
