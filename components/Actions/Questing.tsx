import Button from "@/components/Button.tsx";
import Card from "@/components/Card.tsx";
import Error from "@/components/Error.tsx";
import { isGood, teamList } from "@/core/gameConfig.ts";
import type { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  const quest = game.quests[game.questIndex]!;
  const proposal = quest.teamProposals.at(-1)!;
  const teamMembers = proposal.teamMemberIds.map((id) =>
    game.players.find((p) => p.id === id)!
  );
  const isOnQuest = proposal.teamMemberIds.includes(player.id);
  const playerRole = game.roleAssignments[player.id]!;
  const playersVote = quest.votes[player.id];

  return (
    <Card class="grid-span-2 flex flex-col gap-4">
      {error && <Error message={error} />}
      <div class="flex gap-4 justify-between">
        <p class="py-2">{teamList(teamMembers)} are going on a quest...</p>
        {isOnQuest && (
          playersVote === undefined
            ? (
              <div class="flex gap-2">
                <form method="POST" action={`/game/${game.id}/fail-mission`}>
                  <Button disabled={isGood(playerRole)} color="red">
                    Fail
                  </Button>
                </form>
                <form method="POST" action={`/game/${game.id}/succeed-mission`}>
                  <Button color="green">Succeed</Button>
                </form>
              </div>
            )
            : (
              <p class="py-2">
                You have voted to {playersVote ? "succeed" : "fail"}{" "}
                this mission.
              </p>
            )
        )}
      </div>
    </Card>
  );
};
