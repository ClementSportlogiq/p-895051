
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings, Save, Grid3X3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnotationLabel, AnnotationFlag } from "@/types/annotation";
import { useDefaultWizardConfig } from "@/hooks/useDefaultWizardConfig";
import { MatrixConfiguration } from "./MatrixConfiguration";
import { QuickEventsConfig } from "./components/QuickEventsConfig";
import { FlagDefinitionsConfig } from "./components/FlagDefinitionsConfig";

interface DefaultWizardConfigProps {
  labels: AnnotationLabel[];
  flags: AnnotationFlag[];
}

export const DefaultWizardConfig: React.FC<DefaultWizardConfigProps> = ({
  labels,
  flags,
}) => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [selectedQuickEvents, setSelectedQuickEvents] = useState<string[]>([]);
  const [selectedFlagDefinitions, setSelectedFlagDefinitions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("matrix");

  const { config, isLoading, saveConfig, getConfiguredQuickEvents, getConfiguredFlagDefinitions } = useDefaultWizardConfig();

  // Initialize selections from current config
  useEffect(() => {
    if (config) {
      setSelectedQuickEvents(config.default_quick_events || []);
      setSelectedFlagDefinitions(config.default_flag_definitions || []);
    }
  }, [config]);

  // Track changes for non-matrix configurations
  useEffect(() => {
    if (!config) return;
    
    const quickEventsChanged = JSON.stringify(selectedQuickEvents) !== JSON.stringify(config.default_quick_events);
    const flagDefsChanged = JSON.stringify(selectedFlagDefinitions) !== JSON.stringify(config.default_flag_definitions);
    
    setHasChanges(quickEventsChanged || flagDefsChanged);
  }, [selectedQuickEvents, selectedFlagDefinitions, config]);

  const handleQuickEventToggle = (labelId: string) => {
    setSelectedQuickEvents(prev => {
      if (prev.includes(labelId)) {
        return prev.filter(id => id !== labelId);
      } else if (prev.length < 4) {
        return [...prev, labelId];
      } else {
        // Replace the first item if already at limit
        return [...prev.slice(1), labelId];
      }
    });
  };

  const handleFlagDefinitionToggle = (flagId: string) => {
    setSelectedFlagDefinitions(prev => {
      if (prev.includes(flagId)) {
        return prev.filter(id => id !== flagId);
      } else {
        return [...prev, flagId];
      }
    });
  };

  const handleSave = async () => {
    const success = await saveConfig(selectedQuickEvents, selectedFlagDefinitions);
    if (success) {
      setHasChanges(false);
    }
  };

  const configuredQuickEvents = getConfiguredQuickEvents(labels);
  const configuredFlagDefinitions = getConfiguredFlagDefinitions(flags);

  if (isLoading) {
    return <div className="text-gray-500">Loading wizard configuration...</div>;
  }

  return (
    <Collapsible
      open={showConfigPanel}
      onOpenChange={setShowConfigPanel}
      className="bg-blue-50 p-4 rounded-md border"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex gap-2 p-0">
            <Settings className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Default Wizard Configuration</h2>
            {showConfigPanel ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </Button>
        </CollapsibleTrigger>
        {hasChanges && activeTab !== "matrix" && (
          <Button onClick={handleSave} variant="default" size="sm" className="ml-2">
            <Save className="h-4 w-4 mr-1" />
            Save Configuration
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="mt-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Matrix Layout
            </TabsTrigger>
            <TabsTrigger value="quick-events">Quick Events</TabsTrigger>
            <TabsTrigger value="flags">Flag Definitions</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="mt-6">
            <MatrixConfiguration 
              labels={labels}
              categories={[
                { id: 'offense', name: 'Offense', hotkey: 'O' },
                { id: 'defense', name: 'Defense', hotkey: 'D' },
                { id: 'transition', name: 'Transition', hotkey: 'T' },
                { id: 'set_piece', name: 'Set Piece', hotkey: 'S' },
                { id: 'general', name: 'General', hotkey: 'G' },
                { id: 'stoppage', name: 'Stoppage', hotkey: 'P' },
                { id: 'disciplinary', name: 'Disciplinary', hotkey: 'I' },
                { id: 'substitution', name: 'Substitution', hotkey: 'U' }
              ]}
            />
          </TabsContent>

          <TabsContent value="quick-events" className="mt-6">
            <QuickEventsConfig
              labels={labels}
              selectedQuickEvents={selectedQuickEvents}
              configuredQuickEvents={configuredQuickEvents}
              onQuickEventToggle={handleQuickEventToggle}
            />
          </TabsContent>

          <TabsContent value="flags" className="mt-6">
            <FlagDefinitionsConfig
              flags={flags}
              selectedFlagDefinitions={selectedFlagDefinitions}
              configuredFlagDefinitions={configuredFlagDefinitions}
              onFlagDefinitionToggle={handleFlagDefinitionToggle}
            />
          </TabsContent>
        </Tabs>

        {hasChanges && activeTab !== "matrix" && (
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DefaultWizardConfig;
