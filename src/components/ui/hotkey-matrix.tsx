
import React from "react";
import { cn } from "@/lib/utils";

export interface MatrixPosition {
  key: string;
  row: number;
  col: number;
  label?: string;
}

export interface HotkeyMatrixProps {
  assignments: Record<string, { id: string; name: string; type?: 'quick-event' | 'category' | 'label' | 'flag' }>;
  onPositionClick?: (position: string) => void;
  onAssignmentRemove?: (position: string) => void;
  className?: string;
  showLabels?: boolean;
  disabled?: boolean;
}

export const MATRIX_POSITIONS: MatrixPosition[] = [
  // Top row - Quick Events
  { key: 'Q', row: 0, col: 0, label: 'Quick Event 1' },
  { key: 'W', row: 0, col: 1, label: 'Quick Event 2' },
  { key: 'E', row: 0, col: 2, label: 'Quick Event 3' },
  { key: 'R', row: 0, col: 3, label: 'Quick Event 4' },
  
  // Middle row - Primary Categories
  { key: 'A', row: 1, col: 0, label: 'Category 1' },
  { key: 'S', row: 1, col: 1, label: 'Category 2' },
  { key: 'D', row: 1, col: 2, label: 'Category 3' },
  { key: 'F', row: 1, col: 3, label: 'Category 4' },
  
  // Bottom row - Secondary Categories
  { key: 'Z', row: 2, col: 0, label: 'Category 5' },
  { key: 'X', row: 2, col: 1, label: 'Category 6' },
  { key: 'C', row: 2, col: 2, label: 'Category 7' },
  { key: 'V', row: 2, col: 3, label: 'Category 8' },
];

export const HotkeyMatrix: React.FC<HotkeyMatrixProps> = ({
  assignments = {},
  onPositionClick,
  onAssignmentRemove,
  className,
  showLabels = true,
  disabled = false
}) => {
  const getRowLabel = (row: number) => {
    switch (row) {
      case 0: return "Quick Events";
      case 1: return "Primary Categories";
      case 2: return "Secondary Categories";
      default: return "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {[0, 1, 2].map(row => (
        <div key={row} className="space-y-2">
          {showLabels && (
            <div className="text-sm font-medium text-gray-600">
              {getRowLabel(row)}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {MATRIX_POSITIONS.filter(pos => pos.row === row).map(position => {
              const assignment = assignments[position.key];
              const hasAssignment = !!assignment;
              
              return (
                <div
                  key={position.key}
                  className={cn(
                    "relative h-16 border-2 rounded-lg transition-all duration-200",
                    "flex flex-col items-center justify-center text-sm",
                    hasAssignment 
                      ? "border-blue-500 bg-blue-50 hover:bg-blue-100" 
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100",
                    !disabled && "cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !disabled && onPositionClick?.(position.key)}
                >
                  {/* Hotkey indicator */}
                  <div className={cn(
                    "absolute top-1 left-1 w-5 h-5 rounded text-xs font-bold",
                    "flex items-center justify-center",
                    hasAssignment ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                  )}>
                    {position.key}
                  </div>
                  
                  {/* Assignment content */}
                  {hasAssignment ? (
                    <div className="text-center p-1">
                      <div className="font-medium text-blue-900 truncate">
                        {assignment.name}
                      </div>
                      {assignment.type && (
                        <div className="text-xs text-blue-600 capitalize">
                          {assignment.type.replace('-', ' ')}
                        </div>
                      )}
                      
                      {/* Remove button */}
                      {onAssignmentRemove && !disabled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAssignmentRemove(position.key);
                          }}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-xs text-center">
                      Click to assign
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotkeyMatrix;
