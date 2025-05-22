
import { useToast } from "@/hooks/use-toast";

interface UseEventValidationProps {
  sockerContext: any;
}

export function useEventValidation({ sockerContext }: UseEventValidationProps) {
  const { toast } = useToast();
  
  // Validate all required event components
  const validateEvent = () => {
    const { selectedPlayer, selectedLocation, selectedEventType } = sockerContext;
    
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
