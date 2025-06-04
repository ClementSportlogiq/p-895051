
import { useState, useEffect } from 'react';
import { AnnotationCategory } from '@/types/annotation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { defaultCategories } from './constants';

export function useCategories() {
  const [categories, setCategories] = useState<AnnotationCategory[]>([]);

  // Load categories from database
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('annotation_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      // Convert database format to our type format
      const processedCategories: AnnotationCategory[] = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        hotkey: cat.hotkey,
        matrix_position: cat.matrix_position || undefined
      }));

      setCategories(processedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to default categories if database fails
      setCategories(defaultCategories);
    }
  };

  // Save category to database
  const saveCategory = async (category: AnnotationCategory) => {
    try {
      const { error } = await supabase
        .from('annotation_categories')
        .upsert({
          id: category.id,
          name: category.name,
          hotkey: category.hotkey,
          matrix_position: category.matrix_position || null
        });

      if (error) throw error;

      // Reload categories to get the latest data
      await loadCategories();
      return true;
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error saving category",
        description: "Could not save category to the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete category from database
  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('annotation_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Reload categories to get the latest data
      await loadCategories();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error deleting category",
        description: "Could not delete category from the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    setCategories,
    loadCategories,
    saveCategory,
    deleteCategory
  };
}
