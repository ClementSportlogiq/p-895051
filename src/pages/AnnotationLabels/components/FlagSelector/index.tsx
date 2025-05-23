
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, X } from "lucide-react";
import { AnnotationFlag } from "@/types/annotation";

interface FlagSelectorProps {
  flags: AnnotationFlag[];
  selectedFlags: AnnotationFlag[];
  onFlagToggle: (flagId: string, checked: boolean) => void;
}

export const FlagSelector: React.FC<FlagSelectorProps> = ({
  flags,
  selectedFlags,
  onFlagToggle,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Associated Flags</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Tag className="mr-2 h-4 w-4" />
            <span>
              {selectedFlags && selectedFlags.length > 0
                ? `${selectedFlags.length} flag${selectedFlags.length > 1 ? 's' : ''} selected`
                : 'Select flags'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2">
            {flags.length === 0 ? (
              <p className="text-sm text-gray-500 p-2">No flags available. Create flags first.</p>
            ) : (
              <div className="space-y-2">
                {flags.map((flag) => {
                  const isSelected = selectedFlags?.some(f => f.id === flag.id);
                  return (
                    <div key={flag.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`flag-${flag.id}`} 
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          onFlagToggle(flag.id, checked === true)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`flag-${flag.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {flag.name}
                        </label>
                        {flag.description && (
                          <p className="text-xs text-muted-foreground">
                            {flag.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {selectedFlags && selectedFlags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedFlags.map(flag => (
            <Badge key={flag.id} variant="secondary" className="flex items-center gap-1">
              {flag.name}
              <button
                type="button"
                onClick={() => onFlagToggle(flag.id, false)}
                className="hover:bg-muted rounded-full p-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
