
import { useEffect } from "react";

interface UseVideoTimeCaptureProps {
  selectedEventType: string;  // Changed from selectedEventCategory to selectedEventType
  videoTime: string;
  loggedVideoTime: string;
  setLoggedVideoTime: (time: string) => void;
}

export function useVideoTimeCapture({
  selectedEventType,  // Changed parameter name
  videoTime,
  loggedVideoTime,
  setLoggedVideoTime
}: UseVideoTimeCaptureProps) {
  // Update logged time when user selects an event type (annotation label)
  useEffect(() => {
    if (selectedEventType && !loggedVideoTime) {
      console.log("Event type selected, capturing video time:", videoTime);
      setLoggedVideoTime(videoTime);
    }
  }, [selectedEventType, videoTime, loggedVideoTime, setLoggedVideoTime]);
}

export default useVideoTimeCapture;
