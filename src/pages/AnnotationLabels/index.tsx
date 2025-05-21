
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { AnnotationLabel, EventCategory, AnnotationFlag, FlagCondition } from "@/types/annotation";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { LabelForm } from "./LabelForm";
import { LabelList } from "./LabelList";
import { FlagManagement } from "./FlagManagement";
import { LoadingState } from "./LoadingState";

const AnnotationLabels: React.FC = () => {
  const { 
    labels, 
    flags, 
    isLoading, 
    saveLabel,
    deleteLabel,
    saveFlag,
    deleteFlag
  } = useAnnotationLabels();
  
  const [newLabel, setNewLabel] = useState<Partial<AnnotationLabel>>({
    name: "",
    category: "offense",
    hotkey: "",
    description: "",
    flags: [],
    flag_conditions: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLabel(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewLabel(prev => ({ ...prev, category: value as EventCategory }));
  };

  const handleAddLabel = async () => {
    if (newLabel.name && newLabel.hotkey) {
      const labelToSave: AnnotationLabel = {
        id: editingId || uuidv4(),
        name: newLabel.name,
        category: newLabel.category as EventCategory,
        hotkey: newLabel.hotkey,
        description: newLabel.description,
        flags: newLabel.flags as AnnotationFlag[],
        flag_conditions: newLabel.flag_conditions as FlagCondition[]
      };

      const success = await saveLabel(labelToSave);
      
      if (success) {
        toast({
          title: editingId ? "Label updated" : "Label added",
          description: `The label "${newLabel.name}" has been ${editingId ? "updated" : "added"} successfully.`
        });
        
        // Reset form
        setNewLabel({
          name: "",
          category: "offense",
          hotkey: "",
          description: "",
          flags: [],
          flag_conditions: []
        });
        setEditingId(null);
      }
    }
  };

  const handleEditLabel = (label: AnnotationLabel) => {
    setNewLabel({
      ...label,
      flags: label.flags || [],
      flag_conditions: label.flag_conditions || []
    });
    setEditingId(label.id);
  };

  const handleDeleteLabel = async (id: string) => {
    const success = await deleteLabel(id);
    
    if (success) {
      toast({
        title: "Label deleted",
        description: "The label has been deleted successfully."
      });
      
      if (editingId === id) {
        cancelEdit();
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewLabel({
      name: "",
      category: "offense",
      hotkey: "",
      description: "",
      flags: [],
      flag_conditions: []
    });
  };

  // Flag checkbox management
  const handleFlagCheckboxChange = (flagId: string, checked: boolean) => {
    if (checked) {
      // Add flag to label
      const flagToAdd = flags.find(f => f.id === flagId);
      if (flagToAdd) {
        setNewLabel(prev => ({
          ...prev,
          flags: [...(prev.flags || []), flagToAdd]
        }));
      }
    } else {
      // Remove flag from label
      setNewLabel(prev => ({
        ...prev,
        flags: prev.flags?.filter(f => f.id !== flagId) || []
      }));
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-1" size={16} />
              Back to Main
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Annotation Labels</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Label form */}
          <LabelForm
            editingId={editingId}
            newLabel={newLabel}
            flags={flags}
            onInputChange={handleInputChange}
            onCategoryChange={handleCategoryChange}
            onFlagCheckboxChange={handleFlagCheckboxChange}
            onAddLabel={handleAddLabel}
            onCancelEdit={cancelEdit}
          />

          {/* Labels list */}
          <LabelList
            labels={labels}
            onEditLabel={handleEditLabel}
            onDeleteLabel={handleDeleteLabel}
          />

          {/* Flags management */}
          <FlagManagement
            flags={flags}
            onEditFlag={(flag) => {}} // Will be implemented in component
            onDeleteFlag={deleteFlag}
            onSaveFlag={saveFlag}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnotationLabels;
