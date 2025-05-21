
import React from "react";
import { Button } from "@/components/ui/button";
import { AnnotationFlag } from "@/types/annotation";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FlagListProps {
  flags: AnnotationFlag[];
  onEditFlag: (flag: AnnotationFlag) => void;
  onDeleteFlag: (id: string) => Promise<boolean>;
}

export const FlagList: React.FC<FlagListProps> = ({
  flags,
  onEditFlag,
  onDeleteFlag
}) => {
  // Sort flags by order for display
  const sortedFlags = [...flags].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  return (
    <div className="mt-4">
      <h3 className="font-medium text-sm mb-2">Available Flags (Ordered by Decision Tree Priority)</h3>
      
      {flags.length === 0 && (
        <p className="text-sm text-gray-500">No flags created yet.</p>
      )}
      
      <div className="space-y-4">
        {sortedFlags.map(flag => (
          <div key={flag.id} className="p-3 bg-white border rounded-md">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{flag.name}</h4>
                <Badge variant="outline">Order: {flag.order || 0}</Badge>
              </div>
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
            
            {flag.values && flag.values.length > 0 ? (
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                    <TableHead>Hotkey</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flag.values.map((value, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="py-1">{typeof value === 'string' ? value : value.value}</TableCell>
                      <TableCell className="py-1">{typeof value === 'string' ? '-' : value.hotkey}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <span className="text-xs text-gray-400">No values</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
