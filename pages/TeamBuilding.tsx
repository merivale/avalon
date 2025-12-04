import type { VNode } from "preact";
import { Card } from "@/components/Card.tsx";
import { Error } from "@/components/Error.tsx";
import { PlayerList } from "@/components/PlayerList.tsx";
import { Button } from "@/components/Button.tsx";
import { Game, Player } from "@/core/types.ts";
import { getRequiredTeamSize } from "@/core/proposeTeam.ts";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  const leader = game.players[game.leaderIndex];
  const isLeader = player.id === leader.id;
  const requiredTeamSize = getRequiredTeamSize(game.players.length, game.questIndex + 1);

  return (
    <Card class="max-w-md w-full">
      <Error message={error} />
      <h2 class="text-xl font-semibold text-primary mb-4">
        Quest {game.questIndex + 1}: Team Building
      </h2>
      <div class="flex flex-col gap-4">
        <PlayerList game={game} player={player} />
        
        {isLeader ? (
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-secondary mb-3">
              Propose a Team ({requiredTeamSize} players)
            </h3>
            <form method="POST" action={`/game/${game.id}/propose-team`}>
              <div class="flex flex-col gap-2 mb-4">
                {game.players.map((player) => {
                  return (
                    <label
                      key={player.id}
                      class="flex items-center gap-2 px-3 py-2 bg-white rounded cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        name="team"
                        value={player.id}
                        class="cursor-pointer"
                      />
                      <span class="text-primary">
                        {player.displayName}
                      </span>
                    </label>
                  );
                })}
              </div>
              <Button type="submit">Propose Team</Button>
            </form>
          </div>
        ) : (
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-secondary text-sm">
              Waiting for {leader.displayName} to propose a team of {requiredTeamSize} players...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
