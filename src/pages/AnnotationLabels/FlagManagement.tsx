
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnnotationFlag, FlagValue } from "@/types/annotation";
import { FlagForm } from "./FlagForm";
import { FlagList } from "./FlagList";
import { v4 as uuidv4 } from "uuid";

interface FlagManagementProps {
  flags: AnnotationFlag[];
  onEditFlag: (flag: AnnotationFlag) => void;
  onDeleteFlag: (id: string) => Promise<boolean>;
  onSaveFlag: (flag: AnnotationFlag) => Promise<boolean>;
}

export const FlagManagement: React.FC<FlagManagementProps> = ({
  flags,
  onEditFlag,
  onDeleteFlag,
  onSaveFlag,
}) => {
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  const [newFlag, setNewFlag] = useState<{
    name: string;
    description?: string;
    values?: (FlagValue | string)[];
    order_priority?: number;
  }>({ 
    name: "", 
    description: "", 
    values: [], 
    order_priority: 0 
  });
  const [newFlagValue, setNewFlagValue] = useState("");
  const [newFlagHotkey, setNewFlagHotkey] = useState("");
  const [editingFlagId, setEditingFlagId] = useState<string | null>(null);

  const handleAddFlagValue = () => {
    if (newFlagValue && newFlagHotkey) {
      // Check if the hotkey is already used
      const isHotkeyUsed = newFlag.values?.some(val => 
        typeof val === 'object' && val.hotkey.toUpperCase() === newFlagHotkey.toUpperCase()
      );
      
      if (isHotkeyUsed) {
        alert("This hotkey is already used for another value. Please choose a different hotkey.");
        return;
      }
      
      const newValue: FlagValue = {
        value: newFlagValue,
        hotkey: newFlagHotkey.toUpperCase()
      };
      
      setNewFlag(prev => ({ 
        ...prev, 
        values: [...(prev.values || []), newValue] 
      }));
      
      setNewFlagValue("");
      setNewFlagHotkey("");
    }
  };

  const handleRemoveFlagValue = (index: number) => {
    setNewFlag(prev => ({
      ...prev,
      values: prev.values?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveFlag = async () => {
    if (newFlag.name) {
      // Create the flag object for saving
      let flagToSave: AnnotationFlag;
      
      if (editingFlagId) {
        // Editing existing flag - include the ID
        flagToSave = {
          id: editingFlagId,
          name: newFlag.name,
          description: newFlag.description || "",
          order_priority: newFlag.order_priority || 0,
          values: newFlag.values as FlagValue[] || []
        };
      } else {
        // Creating new flag - generate a UUID client side
        flagToSave = {
          id: uuidv4(), // Generate a client-side UUID for new flags
          name: newFlag.name,
          description: newFlag.description || "",
          order_priority: newFlag.order_priority || 0,
          values: newFlag.values as FlagValue[] || []
        };
      }

      const success = await onSaveFlag(flagToSave);
      
      if (success) {
        resetFlagForm();
      }
    }
  };

  const handleEditFlag = (flag: AnnotationFlag) => {
    setNewFlag({
      name: flag.name,
      description: flag.description,
      values: flag.values,
      order_priority: flag.order_priority
    });
    setEditingFlagId(flag.id);
    setIsAddingFlag(true);
  };

  const resetFlagForm = () => {
    setNewFlag({ name: "", description: "", values: [], order_priority: 0 });
    setNewFlagValue("");
    setNewFlagHotkey("");
    setIsAddingFlag(false);
    setEditingFlagId(null);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Flag Management</h2>
        {!isAddingFlag && (
          <Button onClick={() => setIsAddingFlag(true)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Flag
          </Button>
        )}
      </div>
      
      <div className="mt-2">
        {isAddingFlag ? (
          <FlagForm
            newFlag={newFlag}
            newFlagValue={newFlagValue}
            newFlagHotkey={newFlagHotkey}
            editingFlagId={editingFlagId}
            onFlagNameChange={(name) => setNewFlag({...newFlag, name})}
            onFlagDescriptionChange={(description) => setNewFlag({...newFlag, description})}
            onFlagOrderChange={(order_priority) => setNewFlag({...newFlag, order_priority})}
            onNewFlagValueChange={setNewFlagValue}
            onNewFlagHotkeyChange={setNewFlagHotkey}
            onAddFlagValue={handleAddFlagValue}
            onRemoveFlagValue={handleRemoveFlagValue}
            onSaveFlag={handleSaveFlag}
            onCancelFlag={resetFlagForm}
          />
        ) : null}
        
        <FlagList
          flags={flags}
          onEditFlag={handleEditFlag}
          onDeleteFlag={onDeleteFlag}
        />
      </div>
    </div>
  );
};

export default FlagManagement;
