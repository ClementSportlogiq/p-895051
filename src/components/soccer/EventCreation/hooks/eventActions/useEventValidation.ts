
import { useToast } from "@/hooks/use-toast";

export function useEventValidation() {
  const { toast } = useToast();
  
  const validateEvent = (selectedPlayer: any, selectedLocation: any, selectedEventType: any) => {
    if (!selectedPlayer) {
      toast({
        variant: "destructive",
        title: "Missing Player",
        description: "Please select a player before saving the event"
      });
      return false;
    }

    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Missing Location",
        description: "Please select a field location before saving the event"
      });
      return false;
    }

    // Updated check to be consistent with the main validation logic
    if (!selectedEventType) {
      toast({
        variant: "destructive",
        title: "Missing Event Type",
        description: "Please select an event type before saving"
      });
      return false;
    }
    
    return true;
  };
  
  return { validateEvent, toast };
}

export default useEventValidation;
