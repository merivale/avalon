import Button from "@/components/Button.tsx";
import Card from "@/components/Card.tsx";
import Error from "@/components/Error.tsx";
import type { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";
import { teamList } from "@/core/gameConfig.ts";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  const quest = game.quests[game.questIndex]!;
  const proposal = quest.teamProposals.at(-1)!;
  const proposer = game.players.find((p) => p.id === proposal.leaderId)!;
  const teamMembers = proposal.teamMemberIds.map((id) =>
    game.players.find((p) => p.id === id)!
  );
  const playersVote = proposal.votes[player.id];

  return (
    <Card class="grid-span-2 flex flex-col gap-4">
      {error && <Error message={error} />}
      <div class="flex gap-4 justify-between">
        <p class="py-2">
          {player.id === proposer.id ? "You are" : `${proposer.displayName} is`}
          {" "}
          proposing: {teamList(teamMembers)}
        </p>
        {playersVote === undefined
          ? (
            <div class="flex gap-2">
              <form method="POST" action={`/game/${game.id}/reject-team`}>
                <Button color="red">Reject</Button>
              </form>
              <form method="POST" action={`/game/${game.id}/approve-team`}>
                <Button color="green">Approve</Button>
              </form>
            </div>
          )
          : <p class="py-2">You have {playersVote ? "approved" : "rejected"} this team.</p>}
      </div>
    </Card>
  );
};
