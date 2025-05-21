
import { AnnotationFlag, FlagCondition, FlagValue } from '@/types/annotation';

/**
 * Process flags: convert values from JSON to array if needed and ensure correct structure
 * @param flagsData Raw flag data from database
 * @returns Processed flags with consistent structure
 */
export const processFlags = (flagsData: any[]): AnnotationFlag[] => {
  return flagsData.map((flag: any) => {
    try {
      let values: (string | FlagValue)[] = [];
      
      // Handle different data formats with proper error handling
      if (Array.isArray(flag.values)) {
        values = flag.values;
      } else if (typeof flag.values === 'string') {
        // Handle string values (raw JSON)
        try {
          const parsed = JSON.parse(flag.values);
          values = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          console.warn(`Could not parse flag values for ${flag.name}, using as single value`, e);
          values = [flag.values];
        }
      } else if (flag.values && typeof flag.values === 'object') {
        // Handle object but non-array values
        values = [flag.values];
      } else {
        // Default to empty array for null/undefined
        values = [];
      }
      
      // Convert legacy string values to FlagValue objects if needed
      const processedValues = values.map((val: any, index) => {
        if (typeof val === 'string') {
          // Legacy format - create a FlagValue object with auto-assigned hotkey
          return {
            value: val,
            hotkey: String.fromCharCode(81 + Math.min(index, 25)) // Start from Q (ASCII 81), limit to avoid overflow
          };
        } else if (typeof val === 'object' && val !== null && 'value' in val && 'hotkey' in val) {
          // Already in the right format
          return val;
        } else {
          // Unexpected format - create a placeholder
          return {
            value: String(val || ''),
            hotkey: String.fromCharCode(81 + Math.min(index, 25))
          };
        }
      });

      return {
        ...flag,
        order_priority: flag.order_priority || 0, 
        values: processedValues
      };
    } catch (error) {
      console.error(`Error processing flag ${flag.id || 'unknown'}:`, error);
      // Return safe default to prevent UI errors
      return {
        ...flag,
        order_priority: flag.order_priority || 0,
        values: [{ value: "Error", hotkey: "E" }]
      };
    }
  });
};

/**
 * Process flag conditions: convert legacy nextFlagId to flagsToHideIds array
 * @param conditions Raw conditions from database
 * @returns Processed conditions with consistent structure
 */
export const processConditions = (conditions: any[]): FlagCondition[] => {
  if (!conditions) return [];
  if (!Array.isArray(conditions)) {
    console.error('Invalid conditions format:', conditions);
    return [];
  }
  
  try {
    return conditions.map(condition => {
      try {
        // Safety check for null/undefined condition
        if (!condition) return { flagId: '', value: '', flagsToHideIds: [] };
        
        // Handle legacy format with nextFlagId
        if ('nextFlagId' in condition && !('flagsToHideIds' in condition)) {
          return {
            flagId: condition.flagId || '',
            value: condition.value || '',
            flagsToHideIds: condition.nextFlagId ? [condition.nextFlagId] : []
          };
        }
        
        // Ensure flagsToHideIds is an array
        const flagsToHideIds = Array.isArray(condition.flagsToHideIds) 
          ? condition.flagsToHideIds 
          : (condition.flagsToHideIds ? [condition.flagsToHideIds] : []);
          
        return {
          flagId: condition.flagId || '',
          value: condition.value || '',
          flagsToHideIds: flagsToHideIds
        };
      } catch (e) {
        console.error('Error processing condition:', e);
        return { flagId: '', value: '', flagsToHideIds: [] };
      }
    });
  } catch (e) {
    console.error('Error processing conditions array:', e);
    return [];
  }
};

/**
 * Safely stringifies an object to JSON
 * @param obj Object to stringify
 * @param fallback Fallback value if stringification fails
 * @returns JSON string or fallback
 */
export const safeStringify = (obj: any, fallback: string = '[]'): string => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error('Error stringifying object:', e);
    return fallback;
  }
};

/**
 * Safely parses a JSON string
 * @param jsonString String to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export const safeParse = (jsonString: string, fallback: any = []): any => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON string:', e);
    return fallback;
  }
};
