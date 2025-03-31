
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Volume2, VolumeX, Play } from "lucide-react";

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameTime, setGameTime] = useState("05:30");
  const [videoTimeFormatted, setVideoTimeFormatted] = useState("00:00:00:00");
  const [playbackRate, setPlaybackRate] = useState(1);
  const { toast } = useToast();

  // Handle play/pause with spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            toast({
              variant: "destructive",
              title: "Video Error",
              description: "Could not play the video: " + error.message,
            });
          });
          setIsPlaying(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [toast]);

  // Update time displays
  useEffect(() => {
    const updateTime = () => {
      if (videoRef.current) {
        const current = videoRef.current.currentTime;
        setCurrentTime(current);
        
        // Format video time as HH:MM:SS:FF (assuming 30fps)
        const hours = Math.floor(current / 3600);
        const minutes = Math.floor((current % 3600) / 60);
        const seconds = Math.floor(current % 60);
        const frames = Math.floor((current % 1) * 30); // Assuming 30fps
        
        setVideoTimeFormatted(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}:${frames.toString().padStart(2, "0")}`
        );
        
        // Simulate game time by adding the base game time (5:30)
        const gameMinutes = 5 + Math.floor(current / 60);
        const gameSeconds = 30 + Math.floor(current % 60);
        const adjustedGameSeconds = gameSeconds >= 60 ? gameSeconds - 60 : gameSeconds;
        const adjustedGameMinutes = gameSeconds >= 60 ? gameMinutes + 1 : gameMinutes;
        
        setGameTime(
          `${adjustedGameMinutes
            .toString()
            .padStart(2, "0")}:${adjustedGameSeconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    const interval = setInterval(updateTime, 33); // ~30fps update rate
    return () => clearInterval(interval);
  }, []);

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleTimeChange = (seconds: number) => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime + seconds;
      if (newTime < 0) {
        videoRef.current.currentTime = 0;
        toast({
          variant: "destructive",
          title: "Time Change Error",
          description: "Cannot seek before the beginning of the video",
        });
      } else if (newTime > videoRef.current.duration) {
        videoRef.current.currentTime = videoRef.current.duration;
        toast({
          variant: "destructive",
          title: "Time Change Error",
          description: "Cannot seek beyond the end of the video",
        });
      } else {
        videoRef.current.currentTime = newTime;
      }
    }
  };

  const handleFrameChange = (frames: number) => {
    // Assuming 30fps, one frame is 1/30 of a second
    handleTimeChange(frames / 30);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          toast({
            variant: "destructive",
            title: "Video Error",
            description: "Could not play the video: " + error.message,
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative flex min-h-[543px] w-full flex-col max-md:max-w-full max-md:pt-[100px]">
      <div className="absolute z-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover bg-[rgba(217,217,217,1)]"
          src="/Passing Sequence.mp4"
          muted={isMuted}
          onClick={togglePlay}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 z-10">
        <div className="flex w-full items-center justify-between flex-wrap max-md:max-w-full">
          <div className="bg-white self-stretch flex min-w-60 w-[334px] shrink-0 h-3 my-auto" />
          <div className="bg-[rgba(136,136,136,1)] self-stretch flex min-w-60 w-[708px] shrink h-3 flex-1 basis-[0%] my-auto" />
        </div>
        
        <div className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-[17px] max-md:max-w-full">
          <div className="self-stretch flex min-w-60 items-center gap-2 text-base text-white font-normal whitespace-nowrap my-auto max-md:max-w-full">
            <div className="bg-[rgba(137,150,159,1)] self-stretch flex items-center gap-2 justify-center my-auto px-2 py-1.5">
              <div className="self-stretch my-auto">Speed:</div>
              <div className="self-stretch my-auto">{playbackRate}</div>
              <div className="flex space-x-1">
                {[0.25, 1, 1.5, 1.8, 4].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-1 text-xs ${playbackRate === rate ? "bg-[#082340] text-white" : "bg-[rgba(137,150,159,0.5)]"}`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => handleTimeChange(-15)}
              className="self-stretch bg-[rgba(137,150,159,1)] px-2 py-1.5"
            >
              -15s
            </button>
            <button 
              onClick={() => handleTimeChange(-1)}
              className="self-stretch bg-[rgba(137,150,159,1)] px-2 py-1.5"
            >
              -1s
            </button>
            <button 
              onClick={() => handleFrameChange(-1)}
              className="self-stretch bg-[rgba(137,150,159,1)] px-2 py-1.5"
            >
              -1f
            </button>
            <button 
              onClick={() => handleFrameChange(1)}
              className="self-stretch bg-[rgba(137,150,159,1)] px-2 py-1.5"
            >
              +1f
            </button>
            <button 
              onClick={() => handleTimeChange(1)}
              className="self-stretch bg-[rgba(137,150,159,1)] px-2 py-1.5"
            >
              +1s
            </button>
            <button 
              onClick={() => handleTimeChange(15)}
              className="self-stretch bg-[rgba(137,150,159,1)] px-2 py-1.5"
            >
              +15s
            </button>
          </div>
          
          <div className="self-stretch flex min-w-60 items-center gap-3.5 my-auto">
            <div 
              className="bg-[rgba(137,150,159,1)] self-stretch flex min-h-8 items-center gap-2 justify-center w-10 my-auto px-2 py-1 cursor-pointer"
              onClick={togglePlay}
            >
              <Play className="w-6 h-6" />
            </div>
            <div 
              className="bg-[rgba(137,150,159,1)] self-stretch flex min-h-8 items-center gap-2 justify-center w-10 my-auto px-2 py-1 cursor-pointer"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </div>
            <div className="bg-[rgba(137,150,159,1)] self-stretch flex min-w-60 items-center gap-4 text-base text-white font-normal justify-center my-auto px-2 py-1.5">
              <div className="self-stretch my-auto">P1</div>
              <div className="self-stretch my-auto">{gameTime}</div>
              <div className="self-stretch my-auto">{videoTimeFormatted}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
