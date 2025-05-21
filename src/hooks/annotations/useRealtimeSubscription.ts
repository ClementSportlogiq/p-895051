
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useRealtimeSubscription(loadData: () => Promise<void>) {
  useEffect(() => {
    console.log('Setting up real-time subscription...');
    
    // Set up real-time subscription for all changes (INSERT, UPDATE, DELETE)
    const labelsSubscription = supabase
      .channel('annotation_labels_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'annotation_labels' 
        },
        (payload) => {
          console.log('Labels data changed:', payload.eventType);
          // Don't use catch directly in the callback to avoid swallowing errors
          loadData().catch(error => {
            console.error('Error reloading data after labels change:', error);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to annotation_labels changes');
        } else if (status === 'CHANNEL_ERROR') {
          toast({
            title: "Subscription Error",
            description: "Failed to subscribe to real-time updates. Some changes may require refreshing.",
            variant: "destructive"
          });
        }
      });
    
    const flagsSubscription = supabase
      .channel('annotation_flags_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'annotation_flags' 
        },
        (payload) => {
          console.log('Flags data changed:', payload.eventType);
          loadData().catch(error => {
            console.error('Error reloading data after flags change:', error);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to annotation_flags changes');
        } else if (status === 'CHANNEL_ERROR') {
          toast({
            title: "Subscription Error", 
            description: "Failed to subscribe to real-time updates. Some changes may require refreshing.",
            variant: "destructive"
          });
        }
      });
      
    return () => {
      // Clean up subscriptions when component unmounts
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(labelsSubscription);
      supabase.removeChannel(flagsSubscription);
    };
  }, [loadData]);
}

export default useRealtimeSubscription;
