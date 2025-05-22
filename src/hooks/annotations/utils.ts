
import { AnnotationFlag, FlagCondition, FlagValue } from '@/types/annotation';

// Process flags: convert values from JSON to array if needed and ensure correct structure
export const processFlags = (flagsData: any[]): AnnotationFlag[] => {
  if (!flagsData || !Array.isArray(flagsData)) return [];
  
  return flagsData.map((flag: any) => {
    let values: (string | FlagValue)[] = [];
    
    // Handle different data formats
    if (Array.isArray(flag.values)) {
      values = flag.values;
    } else if (typeof flag.values === 'string') {
      try {
        values = JSON.parse(flag.values);
      } catch (e) {
        values = [];
        console.error('Error parsing flag values', e);
      }
    }
    
    // Convert legacy string values to FlagValue objects if needed
    const processedValues = values.map((val: any, index) => {
      if (typeof val === 'string') {
        // Legacy format - create a FlagValue object with auto-assigned hotkey
        return {
          value: val,
          hotkey: String.fromCharCode(81 + index) // Start from Q (ASCII 81)
        };
      } else if (typeof val === 'object' && val !== null && 'value' in val && 'hotkey' in val) {
        // Already in the right format
        return val;
      } else {
        // Unexpected format - create a placeholder
        return {
          value: String(val),
          hotkey: String.fromCharCode(81 + index)
        };
      }
    });

    return {
      ...flag,
      order_priority: flag.order_priority || 0, // Use order_priority from database
      values: processedValues
    };
  });
};

// Process flag conditions: convert legacy nextFlagId to flagsToHideIds array if needed
export const processConditions = (conditions: any[]): FlagCondition[] => {
  if (!conditions || !Array.isArray(conditions)) return [];
  
  return conditions.map(condition => {
    if (!condition) return {
      flagId: '',
      value: '',
      flagsToHideIds: []
    };
    
    // Handle legacy format with nextFlagId
    if ('nextFlagId' in condition && !('flagsToHideIds' in condition)) {
      return {
        flagId: condition.flagId || '',
        value: condition.value || '',
        flagsToHideIds: condition.nextFlagId ? [condition.nextFlagId] : []
      };
    }
    
    // Ensure all properties exist even if undefined in source
    return {
      flagId: condition.flagId || '',
      value: condition.value || '',
      flagsToHideIds: Array.isArray(condition.flagsToHideIds) ? condition.flagsToHideIds : []
    };
  });
};
