import React from "react";

export const GameInfo: React.FC = () => {
  return (
    <div className="border flex w-full items-center gap-2 overflow-hidden font-normal flex-wrap px-4 py-2 border-black border-solid max-md:max-w-full">
      <div className="self-stretch flex min-w-60 items-center gap-2 flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        <div className="text-[rgba(17,17,17,1)] text-base self-stretch my-auto">
          2024-12-20 - #38595
          <br />
          MTL 0 - 0 ATL
        </div>
        <div className="self-stretch whitespace-nowrap w-[203px] my-auto">
          <div className="text-[rgba(34,34,34,1)] text-xs">Task</div>
          <div className="rounded bg-[rgba(137,150,159,1)] flex min-h-8 w-full items-center gap-2 text-base text-white pl-2 pr-1 py-1">
            <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
              Eventing
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/e4407de0ee5eb6a61df06e07e9c0dc3a7a16f109?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
            />
          </div>
        </div>
        <div className="self-stretch whitespace-nowrap w-[132px] my-auto">
          <div className="text-[rgba(34,34,34,1)] text-xs">Period</div>
          <div className="rounded bg-[rgba(137,150,159,1)] flex min-h-8 w-full items-center gap-2 text-base text-white pl-2 pr-1 py-1">
            <div className="self-stretch flex-1 shrink basis-[0%] my-auto">
              1st
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/0ffe173d5d92bfb79da4a50960c918f9abbc644f?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
            />
          </div>
        </div>
        <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 text-base text-white whitespace-nowrap my-auto px-2 py-1.5">
          Hotkeys
        </div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/21752be40f11d1f225efb9807b3066cc90e4861e?placeholderIfAbsent=true"
        className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
      />
    </div>
  );
};

export default GameInfo;
