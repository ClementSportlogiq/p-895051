
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight } from "lucide-react";
import { AnnotationFlag, FlagCondition } from "@/types/annotation";

interface FlagConditionBuilderProps {
  flags: AnnotationFlag[];
  selectedFlags: AnnotationFlag[];
  flagConditions: FlagCondition[];
  onConditionsChange: (conditions: FlagCondition[]) => void;
}

export const FlagConditionBuilder: React.FC<FlagConditionBuilderProps> = ({
  flags,
  selectedFlags,
  flagConditions,
  onConditionsChange,
}) => {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [selectedFlagValue, setSelectedFlagValue] = useState<string | null>(null);
  const [flagsToHide, setFlagsToHide] = useState<string[]>([]);

  // Save flag condition relationship
  const handleSaveCondition = () => {
    if (selectedFlagId && selectedFlagValue && flagsToHide.length > 0) {
      const newCondition: FlagCondition = {
        flagId: selectedFlagId,
        value: selectedFlagValue,
        flagsToHideIds: flagsToHide
      };
      
      // Add the new condition
      const updatedConditions = [...flagConditions, newCondition];
      
      // Notify parent component about the change
      onConditionsChange(updatedConditions);
      
      // Reset form
      setSelectedFlagId(null);
      setSelectedFlagValue(null);
      setFlagsToHide([]);
    }
  };

  // Delete a condition
  const handleDeleteCondition = (index: number) => {
    const updatedConditions = flagConditions.filter((_, i) => i !== index);
    onConditionsChange(updatedConditions);
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
    <div className="border p-3 rounded-md bg-white">
      <h3 className="font-medium mb-2 flex items-center">
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
                {selectedFlags.map(flag => (
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
              {selectedFlags
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
    </div>
  );
};
