
import React from "react";
import { Button } from "@/components/ui/button";
import { AnnotationLabel } from "@/types/annotation";

interface QuickEventsConfigProps {
  labels: AnnotationLabel[];
  selectedQuickEvents: string[];
  configuredQuickEvents: AnnotationLabel[];
  onQuickEventToggle: (labelId: string) => void;
}

export const QuickEventsConfig: React.FC<QuickEventsConfigProps> = ({
  labels,
  selectedQuickEvents,
  configuredQuickEvents,
  onQuickEventToggle,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Configuration Preview */}
      <div className="bg-white p-4 rounded border">
        <h3 className="font-medium mb-3">Current Quick Events Configuration</h3>
        <div className="space-y-1">
          {configuredQuickEvents.map((event, index) => (
            <div key={event.id} className="text-sm bg-gray-100 px-2 py-1 rounded">
              {index + 1}. {event.name} ({event.hotkey})
            </div>
          ))}
        </div>
      </div>

      {/* Quick Events Selection */}
      <div>
        <h3 className="font-medium mb-3">Select Default Quick Events (exactly 4)</h3>
        <p className="text-sm text-gray-600 mb-3">
          Choose which events should appear as quick actions on the wizard's default start screen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {labels.map((label) => (
            <label key={label.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedQuickEvents.includes(label.id)}
                onChange={() => onQuickEventToggle(label.id)}
                disabled={!selectedQuickEvents.includes(label.id) && selectedQuickEvents.length >= 4}
                className="rounded"
              />
              <span className="text-sm">
                {label.name} ({label.hotkey}) - {label.category}
              </span>
            </label>
          ))}
        </div>
        {selectedQuickEvents.length >= 4 && (
          <p className="text-sm text-amber-600 mt-2">
            Maximum of 4 quick events selected. Uncheck an event to select a different one.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuickEventsConfig;
