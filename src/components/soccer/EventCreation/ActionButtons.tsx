
import React from "react";
import { useWizardState } from "./hooks/useWizardState";

interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onCancel }) => {
  const { resetWizard } = useWizardState();
  
  const handleCancel = () => {
    console.log("Cancel button clicked, performing full reset sequence");
    
    // Reset wizard state first to ensure UI resets immediately
    resetWizard();
    
    // Then dispatch the custom event for other components
    setTimeout(() => {
      console.log("Dispatching cancelEvent after wizard reset");
      window.dispatchEvent(new CustomEvent("cancelEvent"));
      
      // Finally call the original onCancel function
      onCancel();
    }, 0);
  };

  return (
    <div className="bg-white border flex w-full gap-4 text-base font-normal flex-wrap p-4 border-black border-solid max-md:max-w-full">
      <button 
        onClick={onSave}
        className="self-stretch bg-[rgba(137,150,159,1)] min-w-60 gap-2 text-white flex-1 shrink basis-[0%] px-2 py-1.5 max-md:max-w-full hover:bg-[#082340] transition-colors"
      >
        Save (B or Enter)
      </button>
      <button 
        onClick={handleCancel} 
        className="self-stretch bg-white border min-w-60 gap-2 text-[rgba(34,34,34,1)] flex-1 shrink basis-[0%] px-2 py-1.5 border-[rgba(137,150,159,1)] border-solid max-md:max-w-full hover:bg-gray-100 transition-colors"
      >
        Cancel (ESC)
      </button>
    </div>
  );
};

export default ActionButtons;
