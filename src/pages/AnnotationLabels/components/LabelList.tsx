
import React from "react";
import { Button } from "@/components/ui/button";
import { AnnotationLabel } from "@/types/annotation";

interface LabelListProps {
  labels: AnnotationLabel[];
  categories: Array<{ id: string; name: string; hotkey: string }>;
  onEditLabel: (label: AnnotationLabel) => void;
  onDeleteLabel: (id: string) => void;
}

export const LabelList: React.FC<LabelListProps> = ({
  labels,
  categories,
  onEditLabel,
  onDeleteLabel,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hotkey
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {labels.map((label) => {
            const categoryName = categories.find(c => c.id === label.category)?.name || label.category;
            
            return (
              <tr key={label.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{label.name}</div>
                  {label.description && (
                    <div className="text-xs text-gray-500">{label.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{categoryName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{label.hotkey}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {label.flags?.length || 0} flags
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditLabel(label)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteLabel(label.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LabelList;
