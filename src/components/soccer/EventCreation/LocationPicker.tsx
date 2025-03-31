
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSoccer } from "@/context/SoccerContext";

export const LocationPicker: React.FC = () => {
  const { setSelectedLocation, selectedLocation } = useSoccer();
  const [fieldDimensions, setFieldDimensions] = useState({ width: 0, height: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);
  
  const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    
    setSelectedLocation({ x, y });
  };
  
  // Use useEffect instead of a ref callback to measure the field dimensions
  useEffect(() => {
    if (fieldRef.current) {
      setFieldDimensions({
        width: fieldRef.current.clientWidth,
        height: fieldRef.current.clientHeight
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex min-w-60 flex-col items-stretch justify-center w-[370px] p-4">
      <div 
        ref={fieldRef}
        className="bg-[#468f56] border flex min-h-[205px] max-w-full w-[338px] border-black border-solid relative cursor-pointer"
        onClick={handleFieldClick}
      >
        {/* Soccer field lines */}
        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Center line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white transform -translate-y-1/2" />
        
        {/* Center spot */}
        <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Goal areas */}
        <div className="absolute left-0 top-1/3 right-[85%] bottom-1/3 border-2 border-white" />
        <div className="absolute right-0 top-1/3 left-[85%] bottom-1/3 border-2 border-white" />
        
        {/* Penalty areas */}
        <div className="absolute left-0 top-1/4 right-[70%] bottom-1/4 border-2 border-white" />
        <div className="absolute right-0 top-1/4 left-[70%] bottom-1/4 border-2 border-white" />
        
        {/* Field boundary */}
        <div className="absolute inset-1 border-2 border-white" />
        
        {/* Penalty spots */}
        <div className="absolute left-[15%] top-1/2 w-2 h-2 bg-white rounded-full transform -translate-y-1/2" />
        <div className="absolute right-[15%] top-1/2 w-2 h-2 bg-white rounded-full transform -translate-y-1/2" />
        
        {/* Location dot */}
        {selectedLocation && (
          <div 
            className="absolute w-3 h-3 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${selectedLocation.x * 100}%`, 
              top: `${selectedLocation.y * 100}%` 
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
