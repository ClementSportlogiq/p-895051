
import { useState, useEffect } from "react";

export function useVideoTime() {
  const [gameTime, setGameTime] = useState<string>("05:30");
  const [videoTime, setVideoTime] = useState<string>("00:00:00:00");
  const [loggedVideoTime, setLoggedVideoTime] = useState<string>("");

  // Handle video time updates
  useEffect(() => {
    const handleTimeUpdate = (e: CustomEvent) => {
      setGameTime(e.detail.gameTime);
      setVideoTime(e.detail.videoTime);
    };

    window.addEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
    
    // Dispatch an initial event to request current video time
    const timeUpdateEvent = new CustomEvent("getVideoTimeRequest");
    window.dispatchEvent(timeUpdateEvent);
    
    return () => {
      window.removeEventListener("videoTimeUpdate", handleTimeUpdate as EventListener);
    };
  }, []);

  return {
    gameTime,
    videoTime,
    loggedVideoTime,
    setLoggedVideoTime
  };
}

export default useVideoTime;
