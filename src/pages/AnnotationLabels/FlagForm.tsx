
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AnnotationFlag } from "@/types/annotation";

interface FlagFormProps {
  newFlag: Partial<AnnotationFlag>;
  newFlagValue: string;
  editingFlagId: string | null;
  onFlagNameChange: (name: string) => void;
  onFlagDescriptionChange: (description: string) => void;
  onNewFlagValueChange: (value: string) => void;
  onAddFlagValue: () => void;
  onRemoveFlagValue: (value: string) => void;
  onSaveFlag: () => Promise<void>;
  onCancelFlag: () => void;
}

export const FlagForm: React.FC<FlagFormProps> = ({
  newFlag,
  newFlagValue,
  editingFlagId,
  onFlagNameChange,
  onFlagDescriptionChange,
  onNewFlagValueChange,
  onAddFlagValue,
  onRemoveFlagValue,
  onSaveFlag,
  onCancelFlag,
}) => {
  return (
    <div className="space-y-4 mb-4 border-b pb-4">
      <h3 className="font-medium">{editingFlagId ? "Edit Flag" : "Add New Flag"}</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Flag Name</label>
        <Input 
          value={newFlag.name || ""} 
          onChange={(e) => onFlagNameChange(e.target.value)}
          placeholder="e.g., Outcome, Direction"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
        <Textarea 
          value={newFlag.description || ""} 
          onChange={(e) => onFlagDescriptionChange(e.target.value)}
          placeholder="Brief description of what this flag represents"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Flag Values</label>
        <div className="flex gap-2">
          <Input 
            value={newFlagValue} 
            onChange={(e) => onNewFlagValueChange(e.target.value)}
            placeholder="Add a value"
          />
          <Button type="button" onClick={onAddFlagValue}>Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {newFlag.values?.map((value) => (
            <Badge key={value} variant="secondary" className="flex items-center gap-1">
              {value}
              <button
                type="button"
                onClick={() => onRemoveFlagValue(value)}
                className="hover:bg-muted rounded-full p-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onSaveFlag}>
          {editingFlagId ? "Update" : "Save"} Flag
        </Button>
        <Button 
          variant="ghost" 
          onClick={onCancelFlag}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
