
import React from "react";
import { DefaultWizardConfig } from "./DefaultWizardConfig";
import { FlagManagement } from "./FlagManagement";
import { LabelManagement } from "./components/LabelManagement";
import { LoadingState } from "./LoadingState";
import { useAnnotationLabels } from "@/hooks/useAnnotationLabels";

const AnnotationLabelsPage = () => {
  const { 
    labels, 
    flags, 
    isLoading, 
    categories, 
    saveLabel, 
    deleteLabel, 
    saveFlag, 
    deleteFlag 
  } = useAnnotationLabels();

  // Handle editing a flag (passed to FlagManagement)
  const handleEditFlag = (flag: any) => {
    // This is handled by the FlagManagement component
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Annotation Labels Management</h1>
      
      {/* Default Wizard Configuration Section */}
      <DefaultWizardConfig labels={labels} flags={flags} />
      
      {/* Flag Management Section */}
      <FlagManagement
        flags={flags}
        onEditFlag={handleEditFlag}
        onDeleteFlag={deleteFlag}
        onSaveFlag={saveFlag}
      />

      {/* Labels Management Section */}
      <LabelManagement
        labels={labels}
        flags={flags}
        categories={categories}
        onSaveLabel={saveLabel}
        onDeleteLabel={deleteLabel}
      />
    </div>
  );
};

export default AnnotationLabelsPage;
