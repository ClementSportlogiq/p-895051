
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnnotationLabel, EventCategory, AnnotationFlag, FlagCondition } from "@/types/annotation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { LabelForm } from "./LabelForm";
import { LabelList } from "./LabelList";

interface LabelManagementProps {
  labels: AnnotationLabel[];
  flags: AnnotationFlag[];
  categories: Array<{ id: string; name: string; hotkey: string }>;
  onSaveLabel: (label: AnnotationLabel) => Promise<boolean>;
  onDeleteLabel: (id: string) => Promise<boolean>;
}

export const LabelManagement: React.FC<LabelManagementProps> = ({
  labels,
  flags,
  categories,
  onSaveLabel,
  onDeleteLabel,
}) => {
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState<{
    name: string;
    category: EventCategory;
    hotkey: string;
    description?: string;
    flags?: string[];
    flag_conditions?: FlagCondition[];
  }>({
    name: "",
    category: "offense",
    hotkey: "",
    description: "",
    flags: [],
    flag_conditions: []
  });
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>([]);

  // Reset form when closing
  const resetForm = () => {
    setNewLabel({
      name: "",
      category: "offense",
      hotkey: "",
      description: "",
      flags: [],
      flag_conditions: []
    });
    setSelectedFlags([]);
    setFlagConditions([]);
    setIsAddingLabel(false);
    setEditingLabelId(null);
  };

  // Handle editing a label
  const handleEditLabel = (label: AnnotationLabel) => {
    setNewLabel({
      name: label.name,
      category: label.category,
      hotkey: label.hotkey,
      description: label.description || "",
      flags: label.flags?.map(flag => flag.id) || [],
      flag_conditions: label.flag_conditions || []
    });
    setSelectedFlags(label.flags?.map(flag => flag.id) || []);
    setFlagConditions(label.flag_conditions || []);
    setEditingLabelId(label.id);
    setIsAddingLabel(true);
  };

  // Handle saving a label
  const handleSaveLabel = async () => {
    if (newLabel.name && newLabel.category && newLabel.hotkey) {
      // Create the label object for saving
      const labelToSave: AnnotationLabel = {
        id: editingLabelId || uuidv4(),
        name: newLabel.name,
        category: newLabel.category,
        hotkey: newLabel.hotkey.toUpperCase(),
        description: newLabel.description,
        flags: selectedFlags.map(id => flags.find(f => f.id === id)).filter(Boolean) as AnnotationFlag[],
        flag_conditions: flagConditions
      };

      const success = await onSaveLabel(labelToSave);
      
      if (success) {
        toast({
          title: editingLabelId ? "Label updated" : "Label created",
          description: `Successfully ${editingLabelId ? "updated" : "created"} label: ${newLabel.name}`,
        });
        resetForm();
      }
    } else {
      toast({
        title: "Validation error",
        description: "Name, category, and hotkey are required.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting a label
  const handleDeleteLabel = async (id: string) => {
    if (confirm("Are you sure you want to delete this label?")) {
      const success = await onDeleteLabel(id);
      if (success) {
        toast({
          title: "Label deleted",
          description: "Successfully deleted the label.",
        });
      }
    }
  };

  // Handle flag selection
  const handleFlagSelection = (flagId: string) => {
    setSelectedFlags(prev => {
      if (prev.includes(flagId)) {
        return prev.filter(id => id !== flagId);
      } else {
        return [...prev, flagId];
      }
    });
  };

  // Handle adding a flag condition
  const handleAddFlagCondition = (flagId: string, value: string, flagsToHideIds: string[]) => {
    setFlagConditions(prev => [
      ...prev,
      { flagId, value, flagsToHideIds }
    ]);
  };

  // Handle removing a flag condition
  const handleRemoveFlagCondition = (index: number) => {
    setFlagConditions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Event Labels</h2>
        {!isAddingLabel && (
          <Button onClick={() => setIsAddingLabel(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Label
          </Button>
        )}
      </div>

      {isAddingLabel ? (
        <LabelForm
          newLabel={newLabel}
          selectedFlags={selectedFlags}
          flagConditions={flagConditions}
          flags={flags}
          categories={categories}
          editingLabelId={editingLabelId}
          onLabelChange={setNewLabel}
          onFlagSelection={handleFlagSelection}
          onAddFlagCondition={handleAddFlagCondition}
          onRemoveFlagCondition={handleRemoveFlagCondition}
          onSaveLabel={handleSaveLabel}
          onCancel={resetForm}
        />
      ) : (
        <LabelList
          labels={labels}
          categories={categories}
          onEditLabel={handleEditLabel}
          onDeleteLabel={handleDeleteLabel}
        />
      )}
    </div>
  );
};

export default LabelManagement;
