
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import { AnnotationFlag } from "@/types/annotation";

interface FlagListProps {
  flags: AnnotationFlag[];
  onEditFlag: (flag: AnnotationFlag) => void;
  onDeleteFlag: (id: string) => Promise<void>;
}

export const FlagList: React.FC<FlagListProps> = ({
  flags,
  onEditFlag,
  onDeleteFlag,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-2">Existing Flags</h3>
      {flags.length === 0 ? (
        <p className="text-gray-500">No flags created yet.</p>
      ) : (
        flags.map(flag => (
          <div 
            key={flag.id} 
            className="flex flex-col bg-white p-3 border rounded-md"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{flag.name}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEditFlag(flag)}>
                  <Pencil size={16} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDeleteFlag(flag.id)}>
                  <Trash size={16} />
                </Button>
              </div>
            </div>
            
            {flag.description && (
              <div className="text-sm text-gray-500 mt-1">{flag.description}</div>
            )}
            
            <div className="mt-2">
              <div className="text-xs font-medium text-gray-500">Values:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {flag.values.map(value => (
                  <Badge key={value} variant="outline" className="text-xs">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
