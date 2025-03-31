
import React, { useState } from "react";
import { useSoccer, TeamType } from "@/context/SoccerContext";

export const RosterPanel: React.FC = () => {
  const { selectedTeam, setSelectedTeam, mltRoster, atlRoster } = useSoccer();
  const [sortType, setSortType] = useState<"0-9" | "A-Z" | "Pos">("0-9");

  const handleTeamSelect = (team: TeamType) => {
    setSelectedTeam(team);
  };

  const handleSortTypeChange = (type: "0-9" | "A-Z" | "Pos") => {
    setSortType(type);
  };

  // Get the current roster based on selected team
  const unsortedRoster = selectedTeam === "MTL" ? mltRoster : atlRoster;
  
  // Sort the roster based on the selected sort type
  const currentRoster = [...unsortedRoster].sort((a, b) => {
    if (sortType === "0-9") {
      return a.number - b.number;
    } else if (sortType === "A-Z") {
      return a.name.localeCompare(b.name);
    } else { // Pos
      return a.position.localeCompare(b.position);
    }
  });
  
  // Split roster into 3 columns
  const rosterColumn1 = currentRoster.slice(0, 7);
  const rosterColumn2 = currentRoster.slice(7, 14);
  const rosterColumn3 = currentRoster.slice(14);

  return (
    <div className="bg-white border w-full mt-6 border-black border-solid max-md:max-w-full">
      <div className="flex min-h-12 w-full items-center gap-4 flex-wrap px-4 py-2 border-black border-b max-md:max-w-full">
        <div className="text-black text-base font-normal self-stretch my-auto">
          Roster
        </div>
        <div className="self-stretch flex items-center gap-2 my-auto">
          <div 
            className={`cursor-pointer ${selectedTeam === "MTL" ? "border-2 border-[#082340]" : "opacity-30"}`}
            onClick={() => handleTeamSelect("MTL")}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/230992e6776d24130cb9368c23c6256a3d8780e6?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
            />
          </div>
          <div 
            className={`cursor-pointer ${selectedTeam === "ATL" ? "border-2 border-[#082340]" : "opacity-30"}`}
            onClick={() => handleTeamSelect("ATL")}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/b49767f335b8fd403d54dadb2520fdf54a0ab1a0?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
            />
          </div>
        </div>
        <div className="self-stretch flex min-w-60 items-center gap-px text-base text-white font-normal whitespace-nowrap flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
          <div 
            className={`self-stretch ${sortType === "0-9" ? "bg-[rgba(12,37,54,1)]" : "bg-[rgba(137,150,159,1)]"} cursor-pointer gap-2 my-auto px-2 py-1.5`}
            onClick={() => handleSortTypeChange("0-9")}
          >
            0-9
          </div>
          <div 
            className={`self-stretch ${sortType === "A-Z" ? "bg-[rgba(12,37,54,1)]" : "bg-[rgba(137,150,159,1)]"} cursor-pointer gap-2 my-auto px-2 py-1.5`}
            onClick={() => handleSortTypeChange("A-Z")}
          >
            A-Z
          </div>
          <div 
            className={`self-stretch ${sortType === "Pos" ? "bg-[rgba(12,37,54,1)]" : "bg-[rgba(137,150,159,1)]"} cursor-pointer gap-2 my-auto px-2 py-1.5`}
            onClick={() => handleSortTypeChange("Pos")}
          >
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
          {rosterColumn1.map((player) => (
            <div
              key={player.number}
              className="bg-white min-h-6 w-full p-1 rounded-xl"
            >
              {player.number} {player.name} {player.position}{player.isCaptain ? " (C)" : ""}
            </div>
          ))}
        </div>
        <div className="min-w-60 flex-1 shrink basis-[0%]">
          {rosterColumn2.map((player) => (
            <div
              key={player.number}
              className="bg-white min-h-6 w-full p-1 rounded-xl"
            >
              {player.number} {player.name} {player.position}{player.isCaptain ? " (C)" : ""}
            </div>
          ))}
        </div>
        <div className="self-stretch min-w-60 flex-1 shrink basis-[0%]">
          {rosterColumn3.map((player) => (
            <div
              key={player.number}
              className="bg-white min-h-6 w-full p-1 rounded-xl"
            >
              {player.number} {player.name} {player.position}{player.isCaptain ? " (C)" : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RosterPanel;
