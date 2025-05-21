
import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  onSave: () => void;
  onCancel: () => void;
}

export function useKeyboardShortcuts({ onSave, onCancel }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "b" || e.key === "B") {
        onSave();
      }
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onCancel]);
}

export default useKeyboardShortcuts;
