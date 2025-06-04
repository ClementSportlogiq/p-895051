
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnnotationCategory } from "@/types/annotation";

interface CategoryFormProps {
  newCategory: {
    name: string;
    hotkey: string;
    matrix_position?: string;
  };
  categories: AnnotationCategory[];
  editingCategoryId: string | null;
  onCategoryChange: (category: any) => void;
  onSaveCategory: () => void;
  onCancel: () => void;
}

// Available matrix positions for categories (second row in the 3x4 matrix)
const CATEGORY_MATRIX_POSITIONS = [
  { value: "A", label: "A (Primary 1)" },
  { value: "S", label: "S (Primary 2)" },
  { value: "D", label: "D (Primary 3)" },
  { value: "F", label: "F (Primary 4)" },
  { value: "Z", label: "Z (Secondary 1)" },
  { value: "X", label: "X (Secondary 2)" },
  { value: "C", label: "C (Secondary 3)" },
  { value: "V", label: "V (Secondary 4)" },
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  newCategory,
  categories,
  editingCategoryId,
  onCategoryChange,
  onSaveCategory,
  onCancel,
}) => {
  // Get used matrix positions
  const usedMatrixPositions = categories
    .filter(cat => cat.id !== editingCategoryId && cat.matrix_position)
    .map(cat => cat.matrix_position);

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium">
        {editingCategoryId ? "Edit Category" : "Add New Category"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category-name">Category Name</Label>
          <Input
            id="category-name"
            value={newCategory.name}
            onChange={(e) => onCategoryChange({ ...newCategory, name: e.target.value })}
            placeholder="e.g., Offense"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="category-hotkey">Hotkey</Label>
          <Input
            id="category-hotkey"
            value={newCategory.hotkey}
            onChange={(e) => onCategoryChange({ ...newCategory, hotkey: e.target.value.toUpperCase().slice(0, 1) })}
            placeholder="e.g., A"
            maxLength={1}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="category-matrix">Matrix Position (Optional)</Label>
          <Select
            value={newCategory.matrix_position || "none"}
            onValueChange={(value) => onCategoryChange({ ...newCategory, matrix_position: value === "none" ? undefined : value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No matrix position</SelectItem>
              {CATEGORY_MATRIX_POSITIONS.map((position) => (
                <SelectItem 
                  key={position.value} 
                  value={position.value}
                  disabled={usedMatrixPositions.includes(position.value)}
                >
                  {position.label} {usedMatrixPositions.includes(position.value) ? "(Used)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button onClick={onSaveCategory}>
          {editingCategoryId ? "Update Category" : "Add Category"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CategoryForm;
