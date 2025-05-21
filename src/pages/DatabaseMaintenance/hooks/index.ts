
import { useState, useEffect, useCallback } from 'react';
import { useDataDiagnostics } from './useDataDiagnostics';
import { useDataRepair } from './useDataRepair';
import { DatabaseStats, FlagIssue } from '../types';

// Re-export sub-hooks
export { useDataDiagnostics, useDataRepair };

// Main combined hook
export function useDatabaseMaintenance() {
  const { 
    stats, 
    flagIssues, 
    isLoading: isDiagnosticsLoading, 
    lastError: diagnosticsError,
    runDiagnostics 
  } = useDataDiagnostics();
  
  const {
    isLoading: isRepairLoading,
    lastError: repairError,
    fixAllFlagIssues
  } = useDataRepair();
  
  // Combine loading states and errors
  const isLoading = isDiagnosticsLoading || isRepairLoading;
  const lastError = repairError || diagnosticsError;
  
  // Run diagnostics after repair
  const runRepairAndDiagnostics = useCallback(async () => {
    const success = await fixAllFlagIssues();
    if (success) {
      // Re-run diagnostics to update stats and issues
      console.log('Repair completed, running diagnostics again');
      await runDiagnostics();
    }
    return success;
  }, [fixAllFlagIssues, runDiagnostics]);
  
  // Run diagnostics on initial load
  useEffect(() => {
    console.log('Database maintenance hook initialized, running initial diagnostics');
    runDiagnostics();
  }, [runDiagnostics]);
  
  return {
    stats,
    flagIssues,
    isLoading,
    lastError,
    runDiagnostics,
    fixAllFlagIssues: runRepairAndDiagnostics
  };
}

export default useDatabaseMaintenance;
