
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { FlagValue } from "@/types/annotation";

interface FlagFormProps {
  newFlag: {
    name: string;
    description?: string;
    order_priority?: number;
    values?: (FlagValue | string)[];
  };
  newFlagValue: string;
  newFlagHotkey: string;
  editingFlagId: string | null;
  onFlagNameChange: (name: string) => void;
  onFlagDescriptionChange: (description: string) => void;
  onFlagOrderChange: (order: number) => void;
  onNewFlagValueChange: (value: string) => void;
  onNewFlagHotkeyChange: (hotkey: string) => void;
  onAddFlagValue: () => void;
  onRemoveFlagValue: (index: number) => void;
  onSaveFlag: () => Promise<void>;
  onCancelFlag: () => void;
}

export const FlagForm: React.FC<FlagFormProps> = ({
  newFlag,
  newFlagValue,
  newFlagHotkey,
  editingFlagId,
  onFlagNameChange,
  onFlagDescriptionChange,
  onFlagOrderChange,
  onNewFlagValueChange,
  onNewFlagHotkeyChange,
  onAddFlagValue,
  onRemoveFlagValue,
  onSaveFlag,
  onCancelFlag,
}) => {
  return (
    <div className="border rounded-md p-4 mb-4 bg-white">
      <h3 className="font-medium mb-3">{editingFlagId ? "Edit Flag" : "Add New Flag"}</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Flag Name</label>
          <Input 
            value={newFlag.name} 
            onChange={(e) => onFlagNameChange(e.target.value)} 
            placeholder="e.g., Impact, Direction, etc."
            className="mb-2"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Description (Optional)</label>
          <Textarea 
            value={newFlag.description || ''} 
            onChange={(e) => onFlagDescriptionChange(e.target.value)} 
            placeholder="Brief description of the flag"
            className="mb-2"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Decision Tree Priority (Order)</label>
          <Input 
            type="number" 
            min="0"
            value={newFlag.order_priority || 0} 
            onChange={(e) => onFlagOrderChange(parseInt(e.target.value))} 
            placeholder="0"
            className="mb-2"
          />
          <p className="text-xs text-gray-500">Lower numbers will appear first in decision trees</p>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Flag Values</label>
          
          <div className="flex gap-2 mb-2">
            <Input 
              value={newFlagValue} 
              onChange={(e) => onNewFlagValueChange(e.target.value)} 
              placeholder="Value"
              className="flex-1"
            />
            <Input 
              value={newFlagHotkey} 
              onChange={(e) => onNewFlagHotkeyChange(e.target.value)} 
              placeholder="Hotkey"
              maxLength={1}
              className="w-20"
            />
            <Button 
              type="button" 
              onClick={onAddFlagValue}
              variant="outline"
              disabled={!newFlagValue || !newFlagHotkey}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {newFlag.values && newFlag.values.length > 0 ? (
            <div className="space-y-2 mt-3">
              {newFlag.values.map((value, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <span className="font-medium">
                      {typeof value === 'string' ? value : value.value}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      (Hotkey: {typeof value === 'string' ? `Unknown` : value.hotkey})
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveFlagValue(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No values added yet.</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onSaveFlag}>
            {editingFlagId ? "Update Flag" : "Add Flag"}
          </Button>
          <Button variant="outline" onClick={onCancelFlag}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
