
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, X } from "lucide-react";
import { AnnotationLabel, EventCategory, AnnotationFlag } from "@/types/annotation";
import { categoriesData } from "./utils";

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
