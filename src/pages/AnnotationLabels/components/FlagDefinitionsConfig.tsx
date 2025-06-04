
import React from "react";
import { AnnotationFlag } from "@/types/annotation";

interface FlagDefinitionsConfigProps {
  flags: AnnotationFlag[];
  selectedFlagDefinitions: string[];
  configuredFlagDefinitions: AnnotationFlag[];
  onFlagDefinitionToggle: (flagId: string) => void;
}

export const FlagDefinitionsConfig: React.FC<FlagDefinitionsConfigProps> = ({
  flags,
  selectedFlagDefinitions,
  configuredFlagDefinitions,
  onFlagDefinitionToggle,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Configuration Preview */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-medium mb-3">Current Flag Definitions ({configuredFlagDefinitions.length})</h3>
        <div className="space-y-1">
          {configuredFlagDefinitions.map((flag) => (
            <div key={flag.id} className="text-sm bg-gray-100 px-2 py-1 rounded">
              {flag.name} ({flag.values?.length || 0} values)
            </div>
          ))}
        </div>
      </div>

      {/* Flag Definitions Selection */}
      <div>
        <h3 className="font-medium mb-3">Select Default Flag Definitions</h3>
        <p className="text-sm text-gray-600 mb-3">
          Choose which flag definitions should be available by default in the wizard's reset state.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {flags.map((flag) => (
            <label key={flag.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFlagDefinitions.includes(flag.id)}
                onChange={() => onFlagDefinitionToggle(flag.id)}
                className="rounded"
              />
              <span className="text-sm">
                {flag.name} ({flag.values?.length || 0} values)
                {flag.description && ` - ${flag.description}`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlagDefinitionsConfig;
