import React, { useState, useEffect } from "react";
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
  onFlagConditionsChange?: (conditions: FlagCondition[]) => void; // New prop for flag conditions changes
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
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [selectedFlagValue, setSelectedFlagValue] = useState<string | null>(null);
  const [flagsToHide, setFlagsToHide] = useState<string[]>([]); // New state for flags to hide
  const [flagConditions, setFlagConditions] = useState<FlagCondition[]>(
    newLabel.flag_conditions || []
  );

  // Update local flagConditions when prop changes
  useEffect(() => {
    setFlagConditions(newLabel.flag_conditions || []);
  }, [newLabel.flag_conditions]);

  // Save flag condition relationship
  const handleSaveCondition = () => {
    if (selectedFlagId && selectedFlagValue && flagsToHide.length > 0) {
      const newCondition: FlagCondition = {
        flagId: selectedFlagId,
        value: selectedFlagValue,
        flagsToHideIds: flagsToHide // Using the array of flag IDs to hide
      };
      
      // Add the new condition
      const updatedConditions = [...flagConditions, newCondition];
      setFlagConditions(updatedConditions);
      
      // Notify parent component about the change
      if (onFlagConditionsChange) {
        onFlagConditionsChange(updatedConditions);
      }
      
      // Reset form
      setSelectedFlagId(null);
      setSelectedFlagValue(null);
      setFlagsToHide([]);
    }
  };

  // Delete a condition
  const handleDeleteCondition = (index: number) => {
    const updatedConditions = flagConditions.filter((_, i) => i !== index);
    setFlagConditions(updatedConditions);
    
    // Notify parent component about the change
    if (onFlagConditionsChange) {
      onFlagConditionsChange(updatedConditions);
    }
  };

  // Toggle a flag in the flags to hide array
  const handleFlagToHideToggle = (flagId: string, checked: boolean) => {
    if (checked) {
      setFlagsToHide(prev => [...prev, flagId]);
    } else {
      setFlagsToHide(prev => prev.filter(id => id !== flagId));
    }
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
    setFlagsToHide([]); // Reset flags to hide when flag changes
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              </div>
              
              {/* Multi-select for flags to hide */}
              {selectedFlagId && selectedFlagValue && (
                <div>
                  <label className="text-xs text-gray-500">Then hide these flags:</label>
                  <div className="max-h-32 overflow-y-auto border rounded-md p-2 mt-1">
                    {newLabel.flags
                      .filter(f => f.id !== selectedFlagId)
                      .map(flag => (
                        <div key={flag.id} className="flex items-center space-x-2 py-1">
                          <Checkbox 
                            id={`hide-flag-${flag.id}`}
                            checked={flagsToHide.includes(flag.id)}
                            onCheckedChange={(checked) => 
                              handleFlagToHideToggle(flag.id, checked === true)
                            }
                          />
                          <label
                            htmlFor={`hide-flag-${flag.id}`}
                            className="text-sm"
                          >
                            {flag.name}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSaveCondition}
                disabled={!selectedFlagId || !selectedFlagValue || flagsToHide.length === 0}
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
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{getFlagName(condition.flagId)}</span>
                          <span className="text-gray-500">=</span>
                          <Badge variant="outline">{condition.value}</Badge>
                          <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                          <span>Hide:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 ml-6">
                          {condition.flagsToHideIds?.map(flagId => (
                            <Badge key={flagId} variant="secondary" className="text-xs">
                              {getFlagName(flagId)}
                            </Badge>
                          ))}
                        </div>
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
                  {/* Simplified tree visualization */}
                  <div className="flex flex-col items-center">
                    {newLabel.flags && newLabel.flags.length > 0 && (
                      <div className="p-2 border rounded bg-white mb-2">
                        <strong>{newLabel.flags[0]?.name || "Start"}</strong>
                      </div>
                    )}
                    <div className="h-5 border-l"></div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {flagConditions
                        .filter(c => newLabel.flags && newLabel.flags[0] && c.flagId === newLabel.flags[0].id)
                        .map((condition, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <Badge>{condition.value}</Badge>
                            <div className="h-5 border-l"></div>
                            <div className="p-2 border rounded bg-white">
                              <div className="text-xs">
                                Hidden flags: {condition.flagsToHideIds.map(id => getFlagName(id)).join(", ")}
                              </div>
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
