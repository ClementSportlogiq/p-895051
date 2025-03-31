import React from "react";

export const VideoPlayer: React.FC = () => {
  return (
    <div className="relative flex min-h-[543px] w-full flex-col pt-[469px] pb-[13px] px-5 max-md:max-w-full max-md:pt-[100px]">
      <div className="bg-[rgba(217,217,217,1)] absolute z-0 flex min-h-[543px] max-w-full w-[1083px] h-[543px] right-0 bottom-0" />
      <div className="self-center z-0 w-full max-w-[1042px] max-md:max-w-full">
        <div className="flex w-full items-center justify-between flex-wrap max-md:max-w-full">
          <div className="bg-white self-stretch flex min-w-60 w-[334px] shrink-0 h-3 my-auto" />
          <div className="bg-[rgba(136,136,136,1)] self-stretch flex min-w-60 w-[708px] shrink h-3 flex-1 basis-[0%] my-auto" />
        </div>
        <div className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-[17px] max-md:max-w-full">
          <div className="self-stretch flex min-w-60 items-center gap-2 text-base text-white font-normal whitespace-nowrap my-auto max-md:max-w-full">
            <div className="bg-[rgba(137,150,159,1)] self-stretch flex items-center gap-2 justify-center my-auto px-2 py-1.5">
              <div className="self-stretch my-auto">Speed:</div>
              <div className="self-stretch my-auto">1.0</div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/3562ce7e464912ed8767e8e2526588974b5359c4?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
              />
            </div>
            <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
              -15s
            </div>
            <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
              -1s
            </div>
            <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
              -1f
            </div>
            <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
              +1f
            </div>
            <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
              +1s
            </div>
            <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
              +15s
            </div>
          </div>
          <div className="self-stretch flex min-w-60 items-center gap-3.5 my-auto">
            <div className="bg-[rgba(137,150,159,1)] self-stretch flex min-h-8 items-center gap-2 justify-center w-10 my-auto px-2 py-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/975c3da301f31066e7ff7e0f792df27bd85571bd?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-6 self-stretch my-auto"
              />
            </div>
            <div className="bg-[rgba(137,150,159,1)] self-stretch flex min-w-60 items-center gap-4 text-base text-white font-normal justify-center my-auto px-2 py-1.5">
              <div className="self-stretch my-auto">P1</div>
              <div className="self-stretch my-auto">Game Time</div>
              <div className="self-stretch my-auto">Video Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
