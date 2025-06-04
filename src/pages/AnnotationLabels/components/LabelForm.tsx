
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnotationFlag, EventCategory, FlagCondition } from "@/types/annotation";

interface LabelFormProps {
  newLabel: {
    name: string;
    category: EventCategory;
    hotkey: string;
    description?: string;
  };
  selectedFlags: string[];
  flagConditions: FlagCondition[];
  flags: AnnotationFlag[];
  categories: Array<{ id: string; name: string; hotkey: string }>;
  editingLabelId: string | null;
  onLabelChange: (label: any) => void;
  onFlagSelection: (flagId: string) => void;
  onAddFlagCondition: (flagId: string, value: string, flagsToHideIds: string[]) => void;
  onRemoveFlagCondition: (index: number) => void;
  onSaveLabel: () => void;
  onCancel: () => void;
}

export const LabelForm: React.FC<LabelFormProps> = ({
  newLabel,
  selectedFlags,
  flagConditions,
  flags,
  categories,
  editingLabelId,
  onLabelChange,
  onFlagSelection,
  onAddFlagCondition,
  onRemoveFlagCondition,
  onSaveLabel,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<string>("flags");

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium mb-4">
        {editingLabelId ? "Edit Label" : "Add New Label"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="label-name">Label Name</Label>
          <Input
            id="label-name"
            value={newLabel.name}
            onChange={(e) => onLabelChange({...newLabel, name: e.target.value})}
            placeholder="e.g., Pass, Shot, Tackle"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="label-hotkey">Hotkey</Label>
          <Input
            id="label-hotkey"
            value={newLabel.hotkey}
            onChange={(e) => onLabelChange({...newLabel, hotkey: e.target.value})}
            placeholder="e.g., P, S, T"
            maxLength={1}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="label-category">Category</Label>
          <Select
            value={newLabel.category}
            onValueChange={(value) => onLabelChange({...newLabel, category: value as EventCategory})}
          >
            <SelectTrigger id="label-category" className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="label-description">Description (Optional)</Label>
          <Textarea
            id="label-description"
            value={newLabel.description || ""}
            onChange={(e) => onLabelChange({...newLabel, description: e.target.value})}
            placeholder="Brief description of this event type"
            className="mt-1"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="flags">Associated Flags</TabsTrigger>
          <TabsTrigger value="conditions">Flag Conditions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flags" className="pt-4">
          <div className="text-sm text-gray-500 mb-2">
            Select flags that should be prompted for when this event is selected:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`flag-${flag.id}`}
                  checked={selectedFlags.includes(flag.id)}
                  onCheckedChange={() => onFlagSelection(flag.id)}
                />
                <Label htmlFor={`flag-${flag.id}`} className="text-sm cursor-pointer">
                  {flag.name}
                </Label>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="conditions" className="pt-4">
          <div className="text-sm text-gray-500 mb-2">
            Define conditions for when certain flags should be hidden based on previous selections:
          </div>
          
          <div className="bg-gray-100 p-3 rounded text-sm">
            Flag conditions configuration UI would be implemented here.
            This would allow setting up which flags to hide based on previous flag selections.
          </div>
          
          {flagConditions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Current Conditions:</h4>
              <div className="space-y-2">
                {flagConditions.map((condition, index) => {
                  const flag = flags.find(f => f.id === condition.flagId);
                  const hiddenFlags = condition.flagsToHideIds.map(
                    id => flags.find(f => f.id === id)?.name || "Unknown"
                  ).join(", ");
                  
                  return (
                    <div key={index} className="flex justify-between bg-gray-50 p-2 rounded text-sm">
                      <div>
                        When <span className="font-medium">{flag?.name || "Unknown"}</span> is{" "}
                        <span className="font-medium">{condition.value}</span>, hide:{" "}
                        <span className="font-medium">{hiddenFlags || "None"}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFlagCondition(index)}
                        className="h-5 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSaveLabel}>
          {editingLabelId ? "Update Label" : "Create Label"}
        </Button>
      </div>
    </div>
  );
};

export default LabelForm;
