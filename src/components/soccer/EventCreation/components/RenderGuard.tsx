
import React from "react";

interface RenderGuardProps {
  isStateStale: boolean;
}

export const RenderGuard: React.FC<RenderGuardProps> = ({ isStateStale }) => {
  if (!isStateStale) return null;

  console.log("🛑 Render blocked: waiting for state synchronization");
  
  return (
    <div className="min-w-60 text-base text-white font-normal flex-1 shrink basis-[0%] p-4 max-md:max-w-full">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
};

export default RenderGuard;
