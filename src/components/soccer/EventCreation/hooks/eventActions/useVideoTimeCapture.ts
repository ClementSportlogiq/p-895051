
import { useEffect } from "react";

interface UseVideoTimeCaptureProps {
  selectedEventCategory: any;
  videoTime: string;
  loggedVideoTime: string;
  setLoggedVideoTime: (time: string) => void;
}

export function useVideoTimeCapture({
  selectedEventCategory,
  videoTime,
  loggedVideoTime,
  setLoggedVideoTime
}: UseVideoTimeCaptureProps) {
  // Update logged time when user selects an event category
  useEffect(() => {
    if (selectedEventCategory && !loggedVideoTime) {
      setLoggedVideoTime(videoTime);
    }
  }, [selectedEventCategory, videoTime, loggedVideoTime, setLoggedVideoTime]);
}

export default useVideoTimeCapture;
