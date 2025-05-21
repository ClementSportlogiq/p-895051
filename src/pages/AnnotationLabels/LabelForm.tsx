
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, X, ArrowRight, GitMerge } from "lucide-react";
import { AnnotationLabel, EventCategory, AnnotationFlag, FlagCondition } from "@/types/annotation";
import { categoriesData } from "./utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface LabelFormProps {
  editingId: string | null;
  newLabel: Partial<AnnotationLabel>;
  flags: AnnotationFlag[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onFlagCheckboxChange: (flagId: string, checked: boolean) => void;
  onAddLabel: () => Promise<void>;
  onCancelEdit: () => void;
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
}) => {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [selectedFlagValue, setSelectedFlagValue] = useState<string | null>(null);
  const [flagToKeepId, setFlagToKeepId] = useState<string | null>(null);
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>(
    newLabel.flag_conditions || []
  );

  // Save flag condition relationship
  const handleSaveCondition = () => {
    if (selectedFlagId && selectedFlagValue && flagToKeepId) {
      const newCondition: FlagCondition = {
        flagId: selectedFlagId,
        value: selectedFlagValue,
        nextFlagId: flagToKeepId // We keep the property name for DB compatibility
      };
      
      // Add the new condition
      const updatedConditions = [...flagConditions, newCondition];
      setFlagConditions(updatedConditions);
      
      // Update the parent component's state
      if (newLabel && typeof newLabel === 'object') {
        const updatedLabel = {
          ...newLabel,
          flag_conditions: updatedConditions
        };
        // Use a custom handler to update the parent component
        handleUpdateFlagConditions(updatedConditions);
      }
      
      // Reset form
      setSelectedFlagId(null);
      setSelectedFlagValue(null);
      setFlagToKeepId(null);
    }
  };

  // Delete a condition
  const handleDeleteCondition = (index: number) => {
    const updatedConditions = flagConditions.filter((_, i) => i !== index);
    setFlagConditions(updatedConditions);
    handleUpdateFlagConditions(updatedConditions);
  };

  // Update parent component with new flag conditions
  const handleUpdateFlagConditions = (conditions: FlagCondition[]) => {
    // This function assumes the parent component passes a handler to update flagConditions
    // For now, we'll update our local state
    setFlagConditions(conditions);
    
    // Also update the newLabel object with the updated conditions
    const updatedLabel = {
      ...newLabel,
      flag_conditions: conditions
    };
    
    // Since we don't have a direct handler, we need to set the new label state
    // You would need to add this handler to the props and implement it in the parent
    
    // For now, just update the local state
    // In a real implementation, this would need to pass back to the parent
  };

  // Get flag name from ID
  const getFlagName = (flagId: string): string => {
    const flag = flags.find(f => f.id === flagId);
    return flag ? flag.name : 'Unknown Flag';
  };

  // Get value options for a selected flag
  const getFlagValues = (flagId: string): {value: string, label: string}[] => {
    const flag = flags.find(f => f.id === flagId);
    if (!flag || !flag.values) return [];
    
    return flag.values.map(v => ({
      value: typeof v === 'string' ? v : v.value,
      label: typeof v === 'string' ? v : v.value
    }));
  };

  // Handle change of selected flag
  const handleFlagSelect = (flagId: string) => {
    setSelectedFlagId(flagId);
    setSelectedFlagValue(null); // Reset value when flag changes
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Label" : "Add New Label"}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Label Name</label>
          <Input 
            name="name" 
            value={newLabel.name || ""} 
            onChange={onInputChange} 
            placeholder="e.g., Pass, Shot, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select 
            value={newLabel.category} 
            onValueChange={onCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesData.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hotkey</label>
          <Input 
            name="hotkey" 
            value={newLabel.hotkey || ""} 
            onChange={onInputChange} 
            placeholder="e.g., Q, W, E, etc."
            maxLength={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
          <Textarea 
            name="description" 
            value={newLabel.description || ""} 
            onChange={onInputChange} 
            placeholder="Brief description of the label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Associated Flags</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Tag className="mr-2 h-4 w-4" />
                <span>
                  {newLabel.flags && newLabel.flags.length > 0
                    ? `${newLabel.flags.length} flag${newLabel.flags.length > 1 ? 's' : ''} selected`
                    : 'Select flags'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-2">
                {flags.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2">No flags available. Create flags first.</p>
                ) : (
                  <div className="space-y-2">
                    {flags.map((flag) => {
                      const isSelected = newLabel.flags?.some(f => f.id === flag.id);
                      return (
                        <div key={flag.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`flag-${flag.id}`} 
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              onFlagCheckboxChange(flag.id, checked === true)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`flag-${flag.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {flag.name}
                            </label>
                            {flag.description && (
                              <p className="text-xs text-muted-foreground">
                                {flag.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {newLabel.flags && newLabel.flags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {newLabel.flags.map(flag => (
                <Badge key={flag.id} variant="secondary" className="flex items-center gap-1">
                  {flag.name}
                  <button
                    type="button"
                    onClick={() => onFlagCheckboxChange(flag.id, false)}
                    className="hover:bg-muted rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Decision Tree Configuration */}
        {newLabel.flags && newLabel.flags.length > 1 && (
          <div className="border p-3 rounded-md bg-white">
            <h3 className="font-medium mb-2 flex items-center">
              <GitMerge className="h-4 w-4 mr-1" />
              Decision Tree Configuration
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">If Flag</label>
                  <Select 
                    value={selectedFlagId || ""}
                    onValueChange={handleFlagSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select flag" />
                    </SelectTrigger>
                    <SelectContent>
                      {newLabel.flags.map(flag => (
                        <SelectItem key={flag.id} value={flag.id}>
                          {flag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500">Value is</label>
                  <Select 
                    value={selectedFlagValue || ""}
                    onValueChange={setSelectedFlagValue}
                    disabled={!selectedFlagId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedFlagId && getFlagValues(selectedFlagId).map((option, idx) => (
                        <SelectItem key={idx} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500">Then hide all except</label>
                  <Select 
                    value={flagToKeepId || ""}
                    onValueChange={setFlagToKeepId}
                    disabled={!selectedFlagValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select flag to keep" />
                    </SelectTrigger>
                    <SelectContent>
                      {newLabel.flags
                        .filter(f => f.id !== selectedFlagId)
                        .map(flag => (
                          <SelectItem key={flag.id} value={flag.id}>
                            {flag.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSaveCondition}
                disabled={!selectedFlagId || !selectedFlagValue || !flagToKeepId}
                className="w-full"
              >
                Add Condition
              </Button>
            </div>
            
            {/* Display the flag conditions */}
            {flagConditions.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="text-sm font-medium mb-2">Defined Conditions:</h4>
                <div className="space-y-2">
                  {flagConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{getFlagName(condition.flagId)}</span>
                        <span className="text-gray-500">=</span>
                        <Badge variant="outline">{condition.value}</Badge>
                        <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                        <span>Hide all except {getFlagName(condition.nextFlagId)}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCondition(index)}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Visual Decision Tree */}
            {flagConditions.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <h4 className="text-sm font-medium mb-2">Decision Tree Preview:</h4>
                <div className="bg-gray-50 p-3 rounded-md overflow-auto">
                  {/* This is a simplified visualization - in a real app you might use a library */}
                  <div className="flex flex-col items-center">
                    {newLabel.flags && newLabel.flags.length > 0 && (
                      <div className="p-2 border rounded bg-white mb-2">
                        <strong>{newLabel.flags[0]?.name || "Start"}</strong>
                      </div>
                    )}
                    <div className="h-5 border-l"></div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {/* Just a simple tree visualization */}
                      {flagConditions
                        .filter(c => newLabel.flags && newLabel.flags[0] && c.flagId === newLabel.flags[0].id)
                        .map((condition, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <Badge>{condition.value}</Badge>
                            <div className="h-5 border-l"></div>
                            <div className="p-2 border rounded bg-white">
                              Only {getFlagName(condition.nextFlagId)} remains visible
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
