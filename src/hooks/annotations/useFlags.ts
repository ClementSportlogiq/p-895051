
import { useState } from 'react';
import { AnnotationFlag, AnnotationLabel } from '@/types/annotation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useFlags() {
  const [flags, setFlags] = useState<AnnotationFlag[]>([]);

  const getFlagsByLabel = (labelId: string, allLabels: AnnotationLabel[]): AnnotationFlag[] => {
    const label = allLabels.find(l => l.id === labelId);
    return label?.flags || [];
  };

  // Save flag to database
  const saveFlag = async (flag: AnnotationFlag) => {
    try {
      // For new flags, if id is empty string, let Supabase generate it
      const { error } = await supabase
        .from('annotation_flags')
        .upsert({
          id: flag.id,
          name: flag.name,
          description: flag.description || '',
          order_priority: flag.order_priority || 0, // Use order_priority instead of order
          // Convert FlagValue[] to JSON for storage
          values: JSON.stringify(flag.values)
        });
      
      if (error) throw error;
      
      // No need to manually update the state as the subscription will trigger a reload
      return true;
    } catch (error) {
      console.error('Error saving flag:', error);
      toast({
        title: "Error saving flag",
        description: "Could not save flag to the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete flag from database
  const deleteFlag = async (id: string, labels: AnnotationLabel[]) => {
    try {
      // First update any labels that use this flag
      for (const label of labels) {
        if (label.flags?.some(f => f.id === id)) {
          const updatedFlags = label.flags.filter(f => f.id !== id);
          const flagIds = updatedFlags.map(f => f.id);
          
          await supabase
            .from('annotation_labels')
            .update({ flags: flagIds })
            .eq('id', label.id);
        }
      }
      
      // Then delete the flag
      const { error } = await supabase
        .from('annotation_flags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // No need to manually update the state as the subscription will trigger a reload
      return true;
    } catch (error) {
      console.error('Error deleting flag:', error);
      toast({
        title: "Error deleting flag",
        description: "Could not delete flag from the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    flags,
    setFlags,
    getFlagsByLabel,
    saveFlag,
    deleteFlag
  };
}
