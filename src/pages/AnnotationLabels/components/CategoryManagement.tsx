
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnnotationCategory } from "@/types/annotation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";

interface CategoryManagementProps {
  categories: AnnotationCategory[];
  labels: any[];
  onSaveCategory: (category: AnnotationCategory) => Promise<boolean>;
  onDeleteCategory: (id: string) => Promise<boolean>;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  labels,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    hotkey: string;
    matrix_position?: string;
  }>({
    name: "",
    hotkey: "",
    matrix_position: ""
  });

  // Reset form when closing
  const resetForm = () => {
    setNewCategory({
      name: "",
      hotkey: "",
      matrix_position: ""
    });
    setIsAddingCategory(false);
    setEditingCategoryId(null);
  };

  // Handle editing a category
  const handleEditCategory = (category: AnnotationCategory) => {
    setNewCategory({
      name: category.name,
      hotkey: category.hotkey,
      matrix_position: category.matrix_position || ""
    });
    setEditingCategoryId(category.id);
    setIsAddingCategory(true);
  };

  // Handle saving a category
  const handleSaveCategory = async () => {
    if (newCategory.name && newCategory.hotkey) {
      // Check for duplicate hotkeys
      const isDuplicateHotkey = categories.some(cat => 
        cat.hotkey.toLowerCase() === newCategory.hotkey.toLowerCase() && 
        cat.id !== editingCategoryId
      );
      
      if (isDuplicateHotkey) {
        toast({
          title: "Validation error",
          description: "This hotkey is already in use by another category.",
          variant: "destructive"
        });
        return;
      }

      // Check for duplicate matrix position if provided
      if (newCategory.matrix_position) {
        const isDuplicateMatrix = categories.some(cat => 
          cat.matrix_position === newCategory.matrix_position && 
          cat.id !== editingCategoryId
        );
        
        if (isDuplicateMatrix) {
          toast({
            title: "Validation error",
            description: "This matrix position is already in use by another category.",
            variant: "destructive"
          });
          return;
        }
      }

      const categoryToSave: AnnotationCategory = {
        id: editingCategoryId || newCategory.name.toLowerCase().replace(/\s+/g, ''),
        name: newCategory.name,
        hotkey: newCategory.hotkey.toUpperCase(),
        matrix_position: newCategory.matrix_position || undefined
      };

      const success = await onSaveCategory(categoryToSave);
      
      if (success) {
        toast({
          title: editingCategoryId ? "Category updated" : "Category created",
          description: `Successfully ${editingCategoryId ? "updated" : "created"} category: ${newCategory.name}`,
        });
        resetForm();
      }
    } else {
      toast({
        title: "Validation error",
        description: "Name and hotkey are required.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id: string) => {
    // Check if category is in use by any labels
    const labelsUsingCategory = labels.filter(label => label.category === id);
    
    if (labelsUsingCategory.length > 0) {
      toast({
        title: "Cannot delete category",
        description: `This category is used by ${labelsUsingCategory.length} label(s). Please reassign or delete those labels first.`,
        variant: "destructive"
      });
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      const success = await onDeleteCategory(id);
      if (success) {
        toast({
          title: "Category deleted",
          description: "Successfully deleted the category.",
        });
      }
    }
  };

  // Get usage count for each category
  const getCategoryUsageCount = (categoryId: string) => {
    return labels.filter(label => label.category === categoryId).length;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Event Categories</h2>
        {!isAddingCategory && (
          <Button onClick={() => setIsAddingCategory(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        )}
      </div>

      {isAddingCategory ? (
        <CategoryForm
          newCategory={newCategory}
          categories={categories}
          editingCategoryId={editingCategoryId}
          onCategoryChange={setNewCategory}
          onSaveCategory={handleSaveCategory}
          onCancel={resetForm}
        />
      ) : (
        <CategoryList
          categories={categories}
          getCategoryUsageCount={getCategoryUsageCount}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
