import Button from "@/components/Button.tsx";
import Card from "@/components/Card.tsx";
import Error from "@/components/Error.tsx";
import Input from "@/components/Input.tsx";
import { getRequiredTeamSize } from "@/core/gameConfig.ts";
import { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  const leader = game.players[game.leaderIndex]!;
  const isLeader = player.id === leader.id;
  const requiredTeamSize = getRequiredTeamSize(
    game.players.length,
    game.questIndex + 1,
  );

  return (
    <Card class="grid-span-2 flex flex-col gap-4">
      {error && <Error message={error} />}
      {isLeader
        ? (
          <>
            <h3 class="font-semibold">
              Propose a Team ({requiredTeamSize} players)
            </h3>
            <form
              method="POST"
              action={`/game/${game.id}/propose-team`}
              class="flex flex-wrap gap-4"
            >
              <div class="flex-1 flex gap-4 flex-wrap">
                {game.players.map((player) => (
                  <Input
                    key={player.id}
                    label={player.displayName}
                    type="checkbox"
                    name={player.id}
                  />
                ))}
                <input
                  type="hidden"
                  name="player-ids"
                  value={game.players.map((p) => p.id).join(",")}
                />
              </div>
              <Button class="self-end">Propose Team</Button>
            </form>
          </>
        )
        : (
          <p class="py-2">
            Waiting for {leader.displayName} to propose a team of{" "}
            {requiredTeamSize} players...
          </p>
        )}
    </Card>
  );
};
