
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FlagCondition, AnnotationFlag } from "@/types/annotation";

interface DecisionTreePreviewProps {
  flagConditions: FlagCondition[];
  flags: AnnotationFlag[];
  selectedFlags: AnnotationFlag[];
}

export const DecisionTreePreview: React.FC<DecisionTreePreviewProps> = ({
  flagConditions,
  flags,
  selectedFlags,
}) => {
  // Get flag name from ID, with additional null/undefined checking
  const getFlagName = (flagId: string): string => {
    if (!flagId) return 'Unknown Flag';
    const flag = flags.find(f => f.id === flagId);
    return flag ? flag.name : 'Unknown Flag';
  };

  // Safe array check
  if (!flagConditions || flagConditions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t pt-3">
      <h4 className="text-sm font-medium mb-2">Decision Tree Preview:</h4>
      <div className="bg-gray-50 p-3 rounded-md overflow-auto">
        {/* Simplified tree visualization */}
        <div className="flex flex-col items-center">
          {selectedFlags && selectedFlags.length > 0 && (
            <div className="p-2 border rounded bg-white mb-2">
              <strong>{selectedFlags[0]?.name || "Start"}</strong>
            </div>
          )}
          <div className="h-5 border-l"></div>
          <div className="flex flex-wrap justify-center gap-3">
            {flagConditions
              .filter(c => selectedFlags && 
                       selectedFlags[0] && 
                       c && 
                       c.flagId === selectedFlags[0].id)
              .map((condition, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <Badge>{condition.value || "N/A"}</Badge>
                  <div className="h-5 border-l"></div>
                  <div className="p-2 border rounded bg-white">
                    <div className="text-xs">
                      Hidden flags: {(condition.flagsToHideIds || [])
                        .map(id => getFlagName(id))
                        .join(", ") || "None"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
