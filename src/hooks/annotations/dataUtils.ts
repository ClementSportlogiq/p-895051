
import { supabase } from '@/integrations/supabase/client';
import { processFlags, processConditions } from './utils';

/**
 * Fetch data from the database
 * Handles errors and returns empty arrays if needed
 */
export const fetchDatabaseData = async () => {
  try {
    console.log('Fetching database data...');
    
    // Fetch labels with error handling
    const { data: labelsData, error: labelsError } = await supabase
      .from('annotation_labels')
      .select('*');
    
    if (labelsError) {
      console.error('Error fetching labels:', labelsError);
      throw labelsError;
    }

    // Fetch flags with error handling
    const { data: flagsData, error: flagsError } = await supabase
      .from('annotation_flags')
      .select('*');
    
    if (flagsError) {
      console.error('Error fetching flags:', flagsError);
      throw flagsError;
    }

    console.log(`Fetched ${labelsData?.length || 0} labels and ${flagsData?.length || 0} flags`);
    return { 
      labelsData: labelsData || [], 
      flagsData: flagsData || [] 
    };
  } catch (error) {
    console.error('Error fetching database data:', error);
    throw error;
  }
};

/**
 * Process the fetched data
 * Handles data transformation and validation
 */
export const processData = (labelsData: any[], flagsData: any[]) => {
  try {
    console.log('Processing fetched data...');
    
    // Process flags with the new structure
    const processedFlags = processFlags(flagsData);

    // Process labels with the processed flags
    const processedLabels = labelsData.map((label: any) => {
      try {
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
          console.error(`Error parsing flag conditions for label ${label.id}:`, e);
          flagConditions = [];
        }
        
        return {
          ...label,
          flags: labelFlags,
          flag_conditions: flagConditions
        };
      } catch (error) {
        console.error(`Error processing label ${label.id}:`, error);
        // Return label with minimal processing to prevent errors
        return {
          ...label,
          flags: [],
          flag_conditions: []
        };
      }
    });

    return { 
      processedLabels, 
      processedFlags 
    };
  } catch (error) {
    console.error('Error processing data:', error);
    // Return empty arrays to prevent null references
    return { 
      processedLabels: [], 
      processedFlags: [] 
    };
  }
};

/**
 * Helper to safely parse JSON
 * Returns fallback value if parsing fails
 */
export const safeParseJSON = (jsonString: string, fallback: any = null) => {
  try {
    return jsonString ? JSON.parse(jsonString) : fallback;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
};
