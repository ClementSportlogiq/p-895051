
import { useState, useEffect, useCallback } from 'react';
import { useDataDiagnostics } from './useDataDiagnostics';
import { useDataRepair } from './useDataRepair';
import { useDataService } from '@/hooks/annotations/useDataService';
import { useRealtimeHandler } from '@/hooks/annotations/useRealtimeHandler';
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
  
  // Loading state from data service
  const { isLoading: isDataLoading } = useDataService();
  
  // Combine loading states and errors
  const isLoading = isDiagnosticsLoading || isRepairLoading || isDataLoading;
  const lastError = repairError || diagnosticsError;
  
  // Run diagnostics after repair
  const runRepairAndDiagnostics = useCallback(async () => {
    try {
      const success = await fixAllFlagIssues();
      if (success) {
        // Re-run diagnostics to update stats and issues
        console.log('Repair completed, running diagnostics again');
        await runDiagnostics();
      }
      return success;
    } catch (error) {
      console.error('Error in repair and diagnostics:', error);
      return false;
    }
  }, [fixAllFlagIssues, runDiagnostics]);
  
  // Run diagnostics on initial load
  useEffect(() => {
    console.log('Database maintenance hook initialized, running initial diagnostics');
    runDiagnostics().catch(error => {
      console.error('Initial diagnostics failed:', error);
    });
  }, [runDiagnostics]);
  
  // Setup real-time subscriptions for data changes
  useRealtimeHandler(runDiagnostics);
  
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
