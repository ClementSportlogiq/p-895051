
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnnotationFlag, FlagValue } from "@/types/annotation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FlagForm } from "./FlagForm";
import { FlagList } from "./FlagList";
import { v4 as uuidv4 } from "uuid";

interface FlagManagementProps {
  flags: AnnotationFlag[];
  onEditFlag: (flag: AnnotationFlag) => void;
  onDeleteFlag: (id: string) => Promise<boolean>; // Changed from Promise<void> to Promise<boolean>
  onSaveFlag: (flag: AnnotationFlag) => Promise<boolean>;
}

export const FlagManagement: React.FC<FlagManagementProps> = ({
  flags,
  onEditFlag,
  onDeleteFlag,
  onSaveFlag,
}) => {
  const [showFlagsPanel, setShowFlagsPanel] = useState(false);
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  const [newFlag, setNewFlag] = useState<Partial<AnnotationFlag>>({ 
    name: "", 
    description: "", 
    values: [], 
    order: 0 
  });
  const [newFlagValue, setNewFlagValue] = useState("");
  const [newFlagHotkey, setNewFlagHotkey] = useState("");
  const [editingFlagId, setEditingFlagId] = useState<string | null>(null);

  const handleAddFlagValue = () => {
    if (newFlagValue && newFlagHotkey) {
      // Check if the hotkey is already used
      const isHotkeyUsed = newFlag.values?.some(val => val.hotkey.toUpperCase() === newFlagHotkey.toUpperCase());
      
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
          order: newFlag.order || 0,
          values: newFlag.values as FlagValue[] || []
        };
      } else {
        // Creating new flag - let the database generate ID
        flagToSave = {
          id: uuidv4(), // Generate a client-side UUID for new flags
          name: newFlag.name,
          description: newFlag.description || "",
          order: newFlag.order || 0,
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
    setNewFlag(flag);
    setEditingFlagId(flag.id);
    setIsAddingFlag(true);
  };

  const resetFlagForm = () => {
    setNewFlag({ name: "", description: "", values: [], order: 0 });
    setNewFlagValue("");
    setNewFlagHotkey("");
    setIsAddingFlag(false);
    setEditingFlagId(null);
  };

  return (
    <Collapsible
      open={showFlagsPanel}
      onOpenChange={setShowFlagsPanel}
      className="bg-gray-50 p-4 rounded-md"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex gap-2 p-0">
            <h2 className="text-lg font-semibold">Flag Management</h2>
            {showFlagsPanel ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </Button>
        </CollapsibleTrigger>
        {!isAddingFlag && (
          <Button onClick={() => setIsAddingFlag(true)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Flag
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="mt-4">
        {isAddingFlag ? (
          <FlagForm
            newFlag={newFlag}
            newFlagValue={newFlagValue}
            newFlagHotkey={newFlagHotkey}
            editingFlagId={editingFlagId}
            onFlagNameChange={(name) => setNewFlag({...newFlag, name})}
            onFlagDescriptionChange={(description) => setNewFlag({...newFlag, description})}
            onFlagOrderChange={(order) => setNewFlag({...newFlag, order})}
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
      </CollapsibleContent>
    </Collapsible>
  );
};
