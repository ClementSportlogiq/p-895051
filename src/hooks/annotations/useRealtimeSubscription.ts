
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeSubscription(loadData: () => Promise<void>) {
  useEffect(() => {
    // Load initial data
    loadData();
    
    // Set up real-time subscription for changes
    const labelsSubscription = supabase
      .channel('annotation_labels_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'annotation_labels' },
        () => loadData()
      )
      .subscribe();
    
    const flagsSubscription = supabase
      .channel('annotation_flags_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'annotation_flags' },
        () => loadData()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(labelsSubscription);
      supabase.removeChannel(flagsSubscription);
    };
  }, []);
}
