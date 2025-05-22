
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnnotationLabel, AnnotationFlag, FlagCondition, EventCategory } from "@/types/annotation";
import { GitMerge } from "lucide-react";
import { LabelFormInputs } from "./components/LabelFormInputs";
import { FlagSelector } from "./components/FlagSelector";
import { FlagConditionBuilder } from "./components/FlagConditionBuilder";
import { DecisionTreePreview } from "./components/DecisionTreePreview";

interface LabelFormProps {
  editingId: string | null;
  newLabel: Partial<AnnotationLabel>;
  flags: AnnotationFlag[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onFlagCheckboxChange: (flagId: string, checked: boolean) => void;
  onAddLabel: () => Promise<void>;
  onCancelEdit: () => void;
  onFlagConditionsChange?: (conditions: FlagCondition[]) => void;
}

export const LabelForm: React.FC<LabelFormProps> = ({
  editingId,
  newLabel,
  flags,
  onInputChange,
  onCategoryChange,
  onFlagCheckboxChange,
  onAddLabel,
  onCancelEdit,
  onFlagConditionsChange,
}) => {
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>(
    newLabel.flag_conditions || []
  );

  // Update local flagConditions when prop changes
  useEffect(() => {
    setFlagConditions(newLabel.flag_conditions || []);
  }, [newLabel.flag_conditions]);

  // Handle flag conditions changes and propagate to parent
  const handleFlagConditionsUpdate = (conditions: FlagCondition[]) => {
    setFlagConditions(conditions);
    
    if (onFlagConditionsChange) {
      onFlagConditionsChange(conditions);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Label" : "Add New Label"}</h2>
      
      <div className="space-y-4">
        {/* Basic Label Information */}
        <LabelFormInputs
          name={newLabel.name || ""}
          category={newLabel.category || "offense"}
          hotkey={newLabel.hotkey || ""}
          description={newLabel.description || ""}
          onInputChange={onInputChange}
          onCategoryChange={onCategoryChange}
        />

        {/* Flag Selection */}
        <FlagSelector
          flags={flags}
          selectedFlags={newLabel.flags || []}
          onFlagToggle={onFlagCheckboxChange}
        />

        {/* Decision Tree Configuration */}
        {newLabel.flags && newLabel.flags.length > 1 && (
          <div className="space-y-4">
            <div className="flex items-center">
              <GitMerge className="h-4 w-4 mr-1" />
              <h3 className="font-medium">Flag Logic Configuration</h3>
            </div>
            
            <FlagConditionBuilder
              flags={flags}
              selectedFlags={newLabel.flags}
              flagConditions={flagConditions}
              onConditionsChange={handleFlagConditionsUpdate}
            />
            
            <DecisionTreePreview
              flagConditions={flagConditions}
              flags={flags}
              selectedFlags={newLabel.flags}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={onAddLabel}>
            {editingId ? "Update" : "Add"} Label
          </Button>
          {editingId && (
            <Button variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
