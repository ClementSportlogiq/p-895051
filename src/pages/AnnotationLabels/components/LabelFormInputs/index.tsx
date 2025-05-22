
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCategory } from "@/types/annotation";
import { categoriesData } from "../../utils";

interface LabelFormInputsProps {
  name: string;
  category: string; 
  hotkey: string;
  description: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
}

export const LabelFormInputs: React.FC<LabelFormInputsProps> = ({
  name,
  category,
  hotkey,
  description,
  onInputChange,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label Name</label>
        <Input 
          name="name" 
          value={name} 
          onChange={onInputChange} 
          placeholder="e.g., Pass, Shot, etc."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select 
          value={category} 
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
          value={hotkey} 
          onChange={onInputChange} 
          placeholder="e.g., Q, W, E, etc."
          maxLength={1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
        <Textarea 
          name="description" 
          value={description} 
          onChange={onInputChange} 
          placeholder="Brief description of the label"
        />
      </div>
    </div>
  );
};
