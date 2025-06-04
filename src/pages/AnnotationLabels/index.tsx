
import React from "react";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";
import { LoadingState } from "./LoadingState";
import { LabelManagement } from "./components/LabelManagement";
import { FlagManagement } from "./FlagManagement";
import { CategoryManagement } from "./components/CategoryManagement";
import DefaultWizardConfig from "./DefaultWizardConfig";

export default function AnnotationLabels() {
  const { 
    labels, 
    flags, 
    categories,
    isLoading, 
    saveLabel, 
    deleteLabel, 
    saveFlag, 
    deleteFlag,
    saveCategory,
    deleteCategory
  } = useAnnotationLabels();

  if (isLoading) {
    return <LoadingState />;
  }

  // Convert labels to the format expected by CategoryManagement
  const labelsForCategories = labels.map(label => ({
    id: label.id,
    name: label.name,
    category: label.category
  }));

  // Placeholder function for editing flags - this will be handled internally by FlagManagement
  const handleEditFlag = () => {
    // This is handled internally by the FlagManagement component
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Annotation Configuration
        </h1>
        <p className="text-lg text-gray-600">
          Manage your annotation labels, flags, categories, and wizard defaults
        </p>
      </div>

      {/* Default Wizard Configuration */}
      <DefaultWizardConfig 
        labels={labels} 
        flags={flags}
        categories={categories}
      />

      {/* Category Management */}
      <CategoryManagement
        categories={categories}
        labels={labelsForCategories}
        onSaveCategory={saveCategory}
        onDeleteCategory={deleteCategory}
      />

      {/* Label Management */}
      <LabelManagement
        labels={labels}
        flags={flags}
        categories={categories}
        onSaveLabel={saveLabel}
        onDeleteLabel={deleteLabel}
      />

      {/* Flag Management */}
      <FlagManagement
        flags={flags}
        onEditFlag={handleEditFlag}
        onSaveFlag={saveFlag}
        onDeleteFlag={deleteFlag}
      />
    </div>
  );
}
