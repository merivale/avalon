import TeamProposal from "@/components/VotingHistory/TeamProposal.tsx";
import type { Player, Quest } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  index: number;
  quest: Quest;
  players: Player[];
};

export default ({ index, quest, players }: Props): VNode => {
  return (
    <div key={index} class="flex flex-col gap-2">
      <h3 class="font-semibold">Quest {index + 1}</h3>
      <ul class="flex flex-col gap-2">
        {quest.teamProposals.map((proposal, index) => (
          <TeamProposal key={index} proposal={proposal} players={players} />
        ))}
      </ul>
    </div>
  );
};
