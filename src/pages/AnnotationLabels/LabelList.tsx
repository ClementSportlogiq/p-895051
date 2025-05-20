
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import { AnnotationLabel } from "@/types/annotation";
import { categoriesData } from "./utils";

interface LabelListProps {
  labels: AnnotationLabel[];
  onEditLabel: (label: AnnotationLabel) => void;
  onDeleteLabel: (id: string) => Promise<void>;
}

export const LabelList: React.FC<LabelListProps> = ({
  labels,
  onEditLabel,
  onDeleteLabel,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Label List</h2>
      
      <div className="space-y-2">
        {labels.length === 0 ? (
          <p className="text-gray-500">No labels created yet. Add your first label.</p>
        ) : (
          labels.map(label => (
            <div 
              key={label.id} 
              className="flex flex-col bg-white p-3 border rounded-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{label.name} ({label.hotkey})</div>
                  <div className="text-sm text-gray-500">
                    Category: {categoriesData.find(c => c.id === label.category)?.name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEditLabel(label)}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDeleteLabel(label.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              
              {label.flags && label.flags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {label.flags.map(flag => (
                    <Badge key={flag.id} variant="outline" className="text-xs">
                      {flag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
