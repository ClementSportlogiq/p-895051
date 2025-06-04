
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { AnnotationCategory } from "@/types/annotation";

interface CategoryListProps {
  categories: AnnotationCategory[];
  getCategoryUsageCount: (categoryId: string) => number;
  onEditCategory: (category: AnnotationCategory) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  getCategoryUsageCount,
  onEditCategory,
  onDeleteCategory,
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No categories found. Create your first category to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Manage event categories. Categories are used to organize labels and can be assigned to matrix positions for quick access.
      </p>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Hotkey</TableHead>
            <TableHead>Matrix Position</TableHead>
            <TableHead>Labels Using</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const usageCount = getCategoryUsageCount(category.id);
            return (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {category.hotkey}
                  </span>
                </TableCell>
                <TableCell>
                  {category.matrix_position ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                      {category.matrix_position}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${
                    usageCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {usageCount} label{usageCount !== 1 ? 's' : ''}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteCategory(category.id)}
                      disabled={usageCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
