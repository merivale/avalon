import type { Player, TeamProposal } from "@/core/types.ts";
import type { VNode } from "preact";
import { teamList } from "@/core/gameConfig.ts";

type Props = {
  proposal: TeamProposal;
  players: Player[];
};

export default ({ proposal, players }: Props): VNode => {
  const proposer = players.find((p) => p.id === proposal.leaderId)!;
  const teamMembers = proposal.teamMemberIds.map((id) =>
    players.find((p) => p.id === id)!
  );
  const votesIn = Object.keys(proposal.votes).length;
  const votes = Object.entries(proposal.votes)
    .toSorted(([aId], [bId]) => {
      const a = players.findIndex((p) => p.id === aId)!;
      const b = players.findIndex((p) => p.id === bId)!;
      return a - b;
    })
    .map(([playerId, vote]) => {
      const player = players.find((p) => p.id === playerId)!;
      return (
        <span key={playerId} class="flex gap-2">
          <span>{player.displayName}:</span>
          <span>{vote ? "✅" : "❌"}</span>
        </span>
      );
    });

  return (
    <div class="flex gap-4 bg-light-gray justify-between py-1 px-2">
      <p>
        {proposer.displayName} proposed:{" "}
        {teamList(teamMembers)}
      </p>
      <div class="flex flex-wrap gap-3">
        {votesIn < players.length ? "Waiting for votes..." : votes}
      </div>
    </div>
  );
};
