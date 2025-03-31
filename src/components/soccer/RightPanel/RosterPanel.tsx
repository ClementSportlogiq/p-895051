import React from "react";

export const RosterPanel: React.FC = () => {
  return (
    <div className="bg-white border w-full mt-6 border-black border-solid max-md:max-w-full">
      <div className="flex min-h-12 w-full items-center gap-4 flex-wrap px-4 py-2 border-black border-b max-md:max-w-full">
        <div className="text-black text-base font-normal self-stretch my-auto">
          Roster
        </div>
        <div className="self-stretch flex items-center gap-2 my-auto">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/230992e6776d24130cb9368c23c6256a3d8780e6?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/b49767f335b8fd403d54dadb2520fdf54a0ab1a0?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
          />
        </div>
        <div className="self-stretch flex min-w-60 items-center gap-px text-base text-white font-normal whitespace-nowrap flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
          <div className="self-stretch bg-[rgba(12,37,54,1)] gap-2 my-auto px-2 py-1.5">
            0-9
          </div>
          <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
            A-Z
          </div>
          <div className="self-stretch bg-[rgba(137,150,159,1)] gap-2 my-auto px-2 py-1.5">
            Pos
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/f421eaf7865091ef5fc70cad49c72d93adac57e7?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
        />
      </div>
      <div className="flex w-full text-base text-[rgba(34,34,34,1)] font-semibold leading-none flex-wrap p-4 max-md:max-w-full">
        <div className="min-w-60 flex-1 shrink basis-[0%]">
          {[
            "2 Hernandez CD",
            "3 Williams LFB",
            "5 Gregersen RFB",
            "8 Muyumba RW",
            "9 Saba S",
            "10 Slisz CD",
            "11 Lennon DM (C)",
          ].map((player) => (
            <div
              key={player}
              className="bg-white min-h-6 w-full p-1 rounded-xl"
            >
              {player}
            </div>
          ))}
        </div>
        <div className="min-w-60 flex-1 shrink basis-[0%]">
          {[
            "13 Marx RW",
            "16 Xande Silva LW",
            "19 Liu CD",
            "20 Sukumaran CD",
            "21 Hogg LFB",
            "23 Mueller S",
            "24 Cobb CD",
          ].map((player) => (
            <div
              key={player}
              className="bg-white min-h-6 w-full p-1 rounded-xl"
            >
              {player}
            </div>
          ))}
        </div>
        <div className="self-stretch min-w-60 flex-1 shrink basis-[0%]">
          {["25 Spec CD", "28 Gervais RFB", "29 Rios CMI", "32 Morin DM"].map(
            (player) => (
              <div
                key={player}
                className="bg-white min-h-6 w-full p-1 rounded-xl"
              >
                {player}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default RosterPanel;
