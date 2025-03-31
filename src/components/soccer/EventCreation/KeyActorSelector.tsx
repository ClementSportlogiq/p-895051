import React from "react";

export const KeyActorSelector: React.FC = () => {
  return (
    <div className="flex min-h-12 w-full items-center gap-2.5 text-base font-normal whitespace-nowrap flex-wrap pl-4 max-md:max-w-full">
      <div className="self-stretch flex items-center gap-2 text-[rgba(137,150,159,1)] my-auto">
        <div className="self-stretch my-auto">(~)</div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/66efc5c69d4bb652a6aad8b2a8cd023d56d56e67?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/28bc98fdcb842d951b85245c20cd704e15d790a8?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
        />
      </div>
      <div className="self-stretch flex min-w-60 items-center gap-px text-white flex-wrap my-auto max-md:max-w-full">
        {[
          2, 3, 5, 8, 9, 10, 11, 13, 16, 19, 20, 21, 23, 24, 25, 28, 29, 32,
        ].map((number) => (
          <div
            key={number}
            className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5"
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyActorSelector;
