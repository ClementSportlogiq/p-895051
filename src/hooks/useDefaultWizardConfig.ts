
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AnnotationLabel, AnnotationFlag } from '@/types/annotation';

export interface WizardDefaultConfig {
  id: string;
  config_name: string;
  default_quick_events: string[];
  default_flag_definitions: string[];
  quick_events_matrix_positions: Record<string, string>;
  categories_matrix_positions: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export function useDefaultWizardConfig() {
  const [config, setConfig] = useState<WizardDefaultConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the default wizard configuration
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wizard_default_config')
        .select('*')
        .eq('config_name', 'default')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Cast the Json types to string arrays and objects with proper type checking
        const configData: WizardDefaultConfig = {
          ...data,
          default_quick_events: Array.isArray(data.default_quick_events) ? data.default_quick_events as string[] : [],
          default_flag_definitions: Array.isArray(data.default_flag_definitions) ? data.default_flag_definitions as string[] : [],
          quick_events_matrix_positions: (data.quick_events_matrix_positions && typeof data.quick_events_matrix_positions === 'object' && !Array.isArray(data.quick_events_matrix_positions)) ? data.quick_events_matrix_positions as Record<string, string> : {},
          categories_matrix_positions: (data.categories_matrix_positions && typeof data.categories_matrix_positions === 'object' && !Array.isArray(data.categories_matrix_positions)) ? data.categories_matrix_positions as Record<string, string> : {}
        };
        setConfig(configData);
      } else {
        setConfig(null);
      }
    } catch (error) {
      console.error('Error loading wizard default config:', error);
      toast({
        title: "Error loading wizard configuration",
        description: "Could not load default wizard settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save the default wizard configuration including matrix positions
  const saveConfig = async (
    quickEventIds: string[], 
    flagDefinitionIds: string[],
    quickEventsMatrix?: Record<string, string>,
    categoriesMatrix?: Record<string, string>
  ) => {
    try {
      const updateData: any = {
        config_name: 'default',
        default_quick_events: quickEventIds,
        default_flag_definitions: flagDefinitionIds
      };

      // Include matrix positions if provided
      if (quickEventsMatrix !== undefined) {
        updateData.quick_events_matrix_positions = quickEventsMatrix;
      }
      if (categoriesMatrix !== undefined) {
        updateData.categories_matrix_positions = categoriesMatrix;
      }

      const { data, error } = await supabase
        .from('wizard_default_config')
        .upsert(updateData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const configData: WizardDefaultConfig = {
          ...data,
          default_quick_events: Array.isArray(data.default_quick_events) ? data.default_quick_events as string[] : [],
          default_flag_definitions: Array.isArray(data.default_flag_definitions) ? data.default_flag_definitions as string[] : [],
          quick_events_matrix_positions: (data.quick_events_matrix_positions && typeof data.quick_events_matrix_positions === 'object' && !Array.isArray(data.quick_events_matrix_positions)) ? data.quick_events_matrix_positions as Record<string, string> : {},
          categories_matrix_positions: (data.categories_matrix_positions && typeof data.categories_matrix_positions === 'object' && !Array.isArray(data.categories_matrix_positions)) ? data.categories_matrix_positions as Record<string, string> : {}
        };
        setConfig(configData);
      }
      
      toast({
        title: "Configuration saved",
        description: "Default wizard settings have been updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error saving wizard config:', error);
      toast({
        title: "Error saving configuration",
        description: "Could not save default wizard settings.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Get configured quick events from available labels with matrix positions
  const getConfiguredQuickEvents = (allLabels: AnnotationLabel[]): AnnotationLabel[] => {
    if (!config || !config.default_quick_events) return [];
    
    return config.default_quick_events
      .map(eventId => allLabels.find(label => label.id === eventId))
      .filter(Boolean) as AnnotationLabel[];
  };

  // Get quick events by matrix position (Q, W, E, R)
  const getQuickEventsByMatrix = (allLabels: AnnotationLabel[]): Record<string, AnnotationLabel> => {
    if (!config || !config.quick_events_matrix_positions) return {};
    
    const result: Record<string, AnnotationLabel> = {};
    Object.entries(config.quick_events_matrix_positions).forEach(([position, labelId]) => {
      const label = allLabels.find(l => l.id === labelId);
      if (label) {
        result[position] = label;
      }
    });
    
    return result;
  };

  // Get categories by matrix position (A, S, D, F, Z, X, C, V)
  const getCategoriesByMatrix = (allCategories: any[]): Record<string, any> => {
    if (!config || !config.categories_matrix_positions) return {};
    
    const result: Record<string, any> = {};
    Object.entries(config.categories_matrix_positions).forEach(([position, categoryId]) => {
      const category = allCategories.find(c => c.id === categoryId);
      if (category) {
        result[position] = category;
      }
    });
    
    return result;
  };

  // Get configured flag definitions from available flags
  const getConfiguredFlagDefinitions = (allFlags: AnnotationFlag[]): AnnotationFlag[] => {
    if (!config || !config.default_flag_definitions) return [];
    
    return config.default_flag_definitions
      .map(flagId => allFlags.find(flag => flag.id === flagId))
      .filter(Boolean) as AnnotationFlag[];
  };

  // Load configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  // Set up real-time subscription for configuration changes
  useEffect(() => {
    const subscription = supabase
      .channel('wizard_config_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wizard_default_config' },
        () => loadConfig()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    config,
    isLoading,
    saveConfig,
    getConfiguredQuickEvents,
    getConfiguredFlagDefinitions,
    getQuickEventsByMatrix,
    getCategoriesByMatrix,
    loadConfig
  };
}
