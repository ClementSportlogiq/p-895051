
import React, { useEffect } from "react";
import { useSoccer, TeamType } from "@/context/SoccerContext";

export const KeyActorSelector: React.FC = () => {
  const { 
    selectedTeam, 
    setSelectedTeam, 
    mltRoster, 
    atlRoster, 
    selectedPlayer, 
    setSelectedPlayer 
  } = useSoccer();

  // Handle tilde key press to switch teams
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setSelectedTeam(selectedTeam === "MTL" ? "ATL" : "MTL");
        setSelectedPlayer(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTeam, setSelectedTeam, setSelectedPlayer]);

  const handleTeamSelect = (team: TeamType) => {
    setSelectedTeam(team);
    setSelectedPlayer(null);
  };

  const handlePlayerSelect = (playerNumber: number) => {
    const roster = selectedTeam === "MTL" ? mltRoster : atlRoster;
    const player = roster.find(p => p.number === playerNumber) || null;
    setSelectedPlayer(player);
  };

  const currentRoster = selectedTeam === "MTL" ? mltRoster : atlRoster;
  const playerNumbers = currentRoster.map(player => player.number).sort((a, b) => a - b);

  return (
    <div className="flex min-h-12 w-full items-center gap-2.5 text-base font-normal whitespace-nowrap flex-wrap pl-4 max-md:max-w-full">
      <div className="self-stretch flex items-center gap-2 text-[rgba(137,150,159,1)] my-auto">
        <div className="self-stretch my-auto">(~)</div>
        <div 
          className={`cursor-pointer ${selectedTeam === "MTL" ? "border-2 border-[#082340]" : "opacity-30"}`}
          onClick={() => handleTeamSelect("MTL")}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/66efc5c69d4bb652a6aad8b2a8cd023d56d56e67?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
          />
        </div>
        <div 
          className={`cursor-pointer ${selectedTeam === "ATL" ? "border-2 border-[#082340]" : "opacity-30"}`}
          onClick={() => handleTeamSelect("ATL")}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/e77b69f6e966445580894134b3c026b9/28bc98fdcb842d951b85245c20cd704e15d790a8?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[30px] self-stretch shrink-0 my-auto"
          />
        </div>
      </div>
      <div className="self-stretch flex min-w-60 items-center gap-px text-white flex-wrap my-auto max-md:max-w-full">
        {playerNumbers.map((number) => (
          <div
            key={number}
            className={`self-stretch ${selectedPlayer?.number === number ? "bg-[#082340]" : "bg-[rgba(137,150,159,1)]"} gap-2 my-auto px-2 py-1.5 cursor-pointer`}
            onClick={() => handlePlayerSelect(number)}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyActorSelector;
