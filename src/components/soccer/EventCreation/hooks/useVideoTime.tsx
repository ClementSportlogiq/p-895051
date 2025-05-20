
import { useState, useEffect } from "react";

export function useVideoTime() {
  const [gameTime, setGameTime] = useState<string>("05:30");
  const [videoTime, setVideoTime] = useState<string>("00:00:00:00");
  const [loggedVideoTime, setLoggedVideoTime] = useState<string>("");

  // One-time handler for initial video time
  useEffect(() => {
    const handleInitialTimeUpdate = (e: CustomEvent) => {
      if (!loggedVideoTime) {
        setLoggedVideoTime(e.detail.videoTime);
      }
    };

    window.addEventListener("videoTimeUpdate", handleInitialTimeUpdate as EventListener);
    
    // Request current video time
    const timeUpdateEvent = new CustomEvent("getVideoTimeRequest");
    window.dispatchEvent(timeUpdateEvent);
    
    // Cleanup
    return () => {
      window.removeEventListener("videoTimeUpdate", handleInitialTimeUpdate as EventListener);
    };
  }, [loggedVideoTime]);

  // Separate effect for current time (for display/save purposes)
  useEffect(() => {
    const handleTimeUpdate = (e: CustomEvent) => {
      setGameTime(e.detail.gameTime);
      setVideoTime(e.detail.videoTime);
    };

    const handleGetVideoTime = () => {
      if (!loggedVideoTime) {
        // Dispatch an event to request current video time
        const timeUpdateEvent = new CustomEvent("getVideoTimeRequest");
        window.dispatchEvent(timeUpdateEvent);
      }
    };

    window.addEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
    window.addEventListener("getVideoTime", handleGetVideoTime as EventListener);
    
    return () => {
      window.removeEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
      window.removeEventListener("getVideoTime", handleGetVideoTime as EventListener);
    };
  }, [loggedVideoTime]);

  return {
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  };
}

export default useVideoTime;
