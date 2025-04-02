
import React from "react";
import { useSoccer } from "@/context/SoccerContext";

const SoccerFieldSVG: React.FC<{
  onClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  selectedLocation: { x: number; y: number } | null;
}> = ({ onClick, selectedLocation }) => {
  // Field dimensions
  const width = 300;
  const height = 200;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      onClick={onClick}
      className="cursor-crosshair"
    >
      {/* Field background */}
      <rect x="0" y="0" width={width} height={height} fill="#5a9947" />
      
      {/* Outer boundary */}
      <rect 
        x="5" 
        y="5" 
        width={width - 10} 
        height={height - 10} 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
      />
      
      {/* Center line */}
      <line 
        x1={width / 2} 
        y1="5" 
        x2={width / 2} 
        y2={height - 5} 
        stroke="white" 
        strokeWidth="2" 
      />
      
      {/* Center circle */}
      <circle 
        cx={width / 2} 
        cy={height / 2} 
        r="20" 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
      />
      <circle 
        cx={width / 2} 
        cy={height / 2} 
        r="2" 
        fill="white" 
      />
      
      {/* Goal areas */}
      {/* Left goal area */}
      <rect 
        x="5" 
        y={height / 2 - 30} 
        width="30" 
        height="60" 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
      />
      <rect 
        x="5" 
        y={height / 2 - 15} 
        width="10" 
        height="30" 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
      />
      
      {/* Right goal area */}
      <rect 
        x={width - 35} 
        y={height / 2 - 30} 
        width="30" 
        height="60" 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
      />
      <rect 
        x={width - 15} 
        y={height / 2 - 15} 
        width="10" 
        height="30" 
        fill="none" 
        stroke="white" 
        strokeWidth="2" 
      />
      
      {/* Selected location marker */}
      {selectedLocation && (
        <circle
          cx={selectedLocation.x}
          cy={selectedLocation.y}
          r="5"
          fill="red"
          stroke="white"
          strokeWidth="1"
        />
      )}
    </svg>
  );
};

export const LocationPicker: React.FC = () => {
  const { selectedLocation, setSelectedLocation } = useSoccer();

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSelectedLocation({ x, y });
  };

  return (
    <div className="min-w-60 flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      <div className="text-black max-md:max-w-full mb-2">Field XY Mockup</div>
      <div className="bg-[#5a9947] flex justify-center items-center p-1">
        <SoccerFieldSVG 
          onClick={handleClick} 
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
};

export default LocationPicker;
