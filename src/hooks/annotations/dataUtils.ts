
import { supabase } from '@/integrations/supabase/client';
import { processFlags, processConditions } from './utils';

// Fetch data from the database
export const fetchDatabaseData = async () => {
  try {
    console.log('Fetching database data...');
    
    // Fetch labels
    const { data: labelsData, error: labelsError } = await supabase
      .from('annotation_labels')
      .select('*');
    
    if (labelsError) {
      throw labelsError;
    }

    // Fetch flags
    const { data: flagsData, error: flagsError } = await supabase
      .from('annotation_flags')
      .select('*');
    
    if (flagsError) {
      throw flagsError;
    }

    console.log(`Fetched ${labelsData?.length || 0} labels and ${flagsData?.length || 0} flags`);
    return { labelsData: labelsData || [], flagsData: flagsData || [] };
  } catch (error) {
    console.error('Error fetching database data:', error);
    throw error;
  }
};

// Process the fetched data
export const processData = (labelsData: any[], flagsData: any[]) => {
  try {
    console.log('Processing fetched data...');
    
    // Process flags with the new structure
    const processedFlags = processFlags(flagsData);

    // Process labels with the processed flags
    const processedLabels = labelsData.map((label: any) => {
      // Convert flags from IDs to actual flag objects
      const labelFlags = label.flags && Array.isArray(label.flags) 
        ? label.flags.map((flagId: string) => 
            processedFlags.find((f: any) => f.id === flagId)
          ).filter(Boolean)
        : [];

      // Process flag conditions for the new format
      let flagConditions;
      try {
        if (label.flag_conditions) {
          flagConditions = typeof label.flag_conditions === 'string' 
            ? processConditions(JSON.parse(label.flag_conditions))
            : processConditions(label.flag_conditions);
        } else {
          flagConditions = [];
        }
      } catch (e) {
        console.error('Error parsing flag conditions', e);
        flagConditions = [];
      }
      
      return {
        ...label,
        flags: labelFlags,
        flag_conditions: flagConditions
      };
    });

    return { processedLabels, processedFlags };
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

// Helper to safely parse JSON
export const safeParseJSON = (jsonString: string, fallback: any = null) => {
  try {
    return jsonString ? JSON.parse(jsonString) : fallback;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
};
