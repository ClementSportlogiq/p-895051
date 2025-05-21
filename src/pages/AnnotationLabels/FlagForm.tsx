
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { AnnotationFlag, FlagValue } from "@/types/annotation";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FlagFormProps {
  newFlag: Partial<AnnotationFlag>;
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
    <div className="space-y-4 mb-4 border-b pb-4">
      <h3 className="font-medium">{editingFlagId ? "Edit Flag" : "Add New Flag"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="flag-name" className="block text-sm font-medium mb-1">Flag Name</Label>
          <Input 
            id="flag-name"
            value={newFlag.name || ""} 
            onChange={(e) => onFlagNameChange(e.target.value)}
            placeholder="e.g., Outcome, Direction"
          />
        </div>
        
        <div>
          <Label htmlFor="flag-order" className="block text-sm font-medium mb-1">Order (Decision Tree Priority)</Label>
          <Input 
            id="flag-order"
            type="number" 
            value={newFlag.order || 0} 
            onChange={(e) => onFlagOrderChange(parseInt(e.target.value))}
            placeholder="1, 2, 3, etc."
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="flag-desc" className="block text-sm font-medium mb-1">Description (Optional)</Label>
        <Textarea 
          id="flag-desc"
          value={newFlag.description || ""} 
          onChange={(e) => onFlagDescriptionChange(e.target.value)}
          placeholder="Brief description of what this flag represents"
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium mb-1">Flag Values with Hotkeys</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input 
            value={newFlagValue} 
            onChange={(e) => onNewFlagValueChange(e.target.value)}
            placeholder="Value (e.g., Success)"
            className="col-span-2"
          />
          <Input 
            value={newFlagHotkey} 
            onChange={(e) => onNewFlagHotkeyChange(e.target.value)}
            placeholder="Hotkey (e.g., S)"
            maxLength={1}
          />
        </div>
        <div className="mt-2">
          <Button type="button" onClick={onAddFlagValue}>Add Value</Button>
        </div>
        
        {newFlag.values && newFlag.values.length > 0 && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Hotkey</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newFlag.values.map((value, index) => (
                <TableRow key={index}>
                  <TableCell>{value.value}</TableCell>
                  <TableCell>{value.hotkey}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveFlagValue(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
