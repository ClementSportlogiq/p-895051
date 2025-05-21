
import React from "react";
import { Button } from "@/components/ui/button";
import { AnnotationFlag } from "@/types/annotation";
import { Edit, Trash2 } from "lucide-react";

interface FlagListProps {
  flags: AnnotationFlag[];
  onEditFlag: (flag: AnnotationFlag) => void;
  onDeleteFlag: (id: string) => Promise<boolean>; // Changed from Promise<void> to Promise<boolean>
}

export const FlagList: React.FC<FlagListProps> = ({
  flags,
  onEditFlag,
  onDeleteFlag
}) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium text-sm mb-2">Available Flags</h3>
      
      {flags.length === 0 && (
        <p className="text-sm text-gray-500">No flags created yet.</p>
      )}
      
      <div className="space-y-2">
        {flags.map(flag => (
          <div key={flag.id} className="p-3 bg-white border rounded-md">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">{flag.name}</h4>
              <div className="space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEditFlag(flag)}>
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete "${flag.name}"?`)) {
                      await onDeleteFlag(flag.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            {flag.description && (
              <p className="text-sm text-gray-500 mb-2">{flag.description}</p>
            )}
            
            <div className="flex flex-wrap gap-1">
              {flag.values.map((value, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                >
                  {value}
                </span>
              ))}
              {flag.values.length === 0 && (
                <span className="text-xs text-gray-400">No values</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
